import asyncio
import json
import os
import time

import pytest

from app.services.worker import ExecutionError, Supervisor


def test_environment_keeps_windows_identity_but_removes_product_secrets():
    from app.services.worker import restrict_environment

    original = dict(os.environ)
    try:
        os.environ.update(USERNAME="SyntheticWorker", JWT_SECRET="private-test-value")
        restrict_environment()
        assert os.environ["USERNAME"] == "SyntheticWorker"
        assert "JWT_SECRET" not in os.environ
    finally:
        os.environ.clear()
        os.environ.update(original)


def fake_worker(connection, manifests, settings):
    while True:
        request = json.loads(connection.recv_bytes(65536))
        if request["operation"] == "crash":
            os._exit(1)
        if request["operation"] == "slow":
            time.sleep(10)
        connection.send_bytes(json.dumps({"result": {"pid": os.getpid()}}).encode())


def test_worker_reuses_one_child_and_recovers_from_timeout_and_crash():
    async def run():
        worker = Supervisor({}, {}, target=fake_worker)
        try:
            first = await worker.execute("ok", {}, timeout=10)
            assert await worker.execute("ok", {}, timeout=10) == first
            with pytest.raises(ExecutionError, match="model_timeout"):
                await worker.execute("slow", {}, timeout=0.1)
            assert worker.process is None
            second = await worker.execute("ok", {}, timeout=10)
            assert second != first
            with pytest.raises(ExecutionError, match="model_failed"):
                await worker.execute("crash", {}, timeout=10)
        finally:
            worker.close()

    asyncio.run(run())


def test_arabic_body_is_not_expanded_past_the_internal_pipe_limit():
    async def run():
        worker = Supervisor({}, {}, target=fake_worker)
        try:
            payload = {"texts": [{"id": f"a{i}", "text": "س" * 2000} for i in range(6)]}
            assert await worker.execute("ok", payload, timeout=10)
        finally:
            worker.close()

    asyncio.run(run())


def test_cancel_and_busy_reject_without_an_orphan():
    async def run():
        worker = Supervisor({}, {}, target=fake_worker)
        task = asyncio.create_task(worker.execute("slow", {}, timeout=10))
        await asyncio.sleep(0.1)
        with pytest.raises(ExecutionError, match="model_busy"):
            await worker.execute("ok", {})
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert worker.process is None
        assert await worker.execute("ok", {}, timeout=10)
        worker.close()

    asyncio.run(run())
