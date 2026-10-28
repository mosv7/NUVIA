"""A single owned subprocess, hard deadlines and cancellation recovery."""

import asyncio
import json
import multiprocessing
import os
import threading
import time

BODY_LIMIT = 65536
OUTPUT_LIMIT = 262144


class ExecutionError(Exception):
    pass


def restrict_environment():
    # Restrict the inference process environment; never give models product secrets.
    allowed = {
        "SYSTEMROOT",
        "WINDIR",
        "PATH",
        "TEMP",
        "TMP",
        "HOME",
        "USERPROFILE",
        "LOCALAPPDATA",
        "CUDA_PATH",
        "USERNAME",
        "USER",
        "LOGNAME",
        "APPDATA",
        "PROGRAMDATA",
    }
    for key in list(os.environ):
        if key.upper() not in allowed:
            del os.environ[key]
    os.environ.update(HF_HUB_OFFLINE="1", TRANSFORMERS_OFFLINE="1", TOKENIZERS_PARALLELISM="false")
    os.environ.update(USE_TF="0", USE_FLAX="0", HF_HUB_DISABLE_TELEMETRY="1")


def model_worker(connection, manifests, settings):
    restrict_environment()
    try:
        from app.models.transformers_adapter import TransformersRuntime
        from app.schemas.ai import REQUESTS
        from app.services.interfaces import prompt, validate_result

        runtime = TransformersRuntime(manifests, settings)
        while True:
            raw = json.loads(connection.recv_bytes(BODY_LIMIT))
            operation = raw["operation"]
            request = REQUESTS[operation].model_validate(raw["payload"])
            try:
                result = (
                    runtime.analyze(request.model_dump())
                    if operation == "analyze"
                    else json.loads(runtime.generate(prompt(operation), request.model_dump()))
                )
                result = validate_result(operation, result, request)
                response = {"result": result}
            except (ValueError, KeyError, TypeError, IndexError) as error:
                code = (
                    "input_too_large" if str(error) == "input_too_large" else "invalid_model_output"
                )
                response = {"error": code}
            encoded = json.dumps(response, allow_nan=False).encode()
            if len(encoded) > OUTPUT_LIMIT:
                encoded = b'{"error":"invalid_model_output"}'
            connection.send_bytes(encoded)
    except (EOFError, BrokenPipeError):
        pass
    except Exception:
        try:
            connection.send_bytes(b'{"error":"model_failed"}')
        except (OSError, EOFError):
            pass
    finally:
        connection.close()


class Supervisor:
    def __init__(self, manifests, settings, *, target=model_worker):
        self.manifests, self.settings, self.target = manifests, settings, target
        self.process = self.connection = None
        self.lock = threading.Lock()

    def close(self):
        process, connection = self.process, self.connection
        self.process = self.connection = None
        if process is not None:
            if process.is_alive():
                process.terminate()
            process.join(2)
            if process.is_alive():
                process.kill()
                process.join(2)
            process.close()
        if connection is not None:
            connection.close()

    async def execute(self, operation, payload, *, timeout=180):
        if not self.lock.acquire(blocking=False):
            raise ExecutionError("model_busy")
        sending = None
        try:
            message = json.dumps({"operation": operation, "payload": payload}).encode()
            if len(message) > BODY_LIMIT:
                raise ExecutionError("input_too_large")
            if self.process is None or not self.process.is_alive():
                self.close()
                context = multiprocessing.get_context("spawn")
                self.connection, child = context.Pipe()
                self.process = context.Process(
                    target=self.target, args=(child, self.manifests, self.settings), daemon=True
                )
                try:
                    self.process.start()
                finally:
                    child.close()
            connection = self.connection
            sending = asyncio.create_task(asyncio.to_thread(connection.send_bytes, message))
            deadline = time.monotonic() + timeout
            while time.monotonic() < deadline:
                if sending.done():
                    sending.result()
                    if connection.poll():
                        response = json.loads(connection.recv_bytes(OUTPUT_LIMIT))
                        if "error" in response:
                            raise ExecutionError(response["error"])
                        return response["result"]
                if not self.process.is_alive():
                    raise ExecutionError("model_failed")
                await asyncio.sleep(0.02)
            raise ExecutionError("model_timeout")
        except BaseException as error:
            if not isinstance(error, ExecutionError) or str(error) not in (
                "invalid_model_output",
                "input_too_large",
            ):
                self.close()
            if isinstance(error, (OSError, EOFError, ValueError, KeyError, TypeError)):
                raise ExecutionError("model_failed") from error
            raise
        finally:
            if sending is not None:
                if not sending.done():
                    self.close()
                try:
                    await sending
                except (OSError, EOFError):
                    pass
            self.lock.release()
