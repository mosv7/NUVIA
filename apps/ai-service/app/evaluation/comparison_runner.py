"""Bounded comparison-only retries, pacing and durable resumable artifacts."""

import asyncio
import json
import math
import os
import random
import time
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from pathlib import Path

from app.core.settings import root_directory
from app.schemas.ai import SummaryRequest
from app.services.interfaces import prompt, validate_result
from app.services.summary_providers import PROVIDERS, ProviderError
from app.services.worker import ExecutionError


def validate_saved_rows(saved, dataset, providers, configuration):
    if (
        saved.get("dataset") != dataset
        or saved.get("providers") != providers
        or saved.get("configuration") != configuration
    ):
        raise ValueError("Saved comparison inputs/configuration changed")
    originals = {
        case["id"]: SummaryRequest.model_validate(case["request"]) for case in dataset["cases"]
    }
    rows = saved.get("rows", [])
    state = "pending" if any(r["status"] == "pending" for r in rows) else "complete"
    if saved.get("state") != state:
        raise ValueError("Checkpoint state disagrees with row outcomes")
    expected = {(case_id, provider) for case_id in originals for provider in providers}
    actual = {(row["case_id"], row["provider"]) for row in rows}
    if (
        len(rows) != len(expected)
        or actual != expected
        or len({r["candidate_id"] for r in rows}) != len(rows)
    ):
        raise ValueError("Incomplete or duplicated checkpoint rows")
    statuses = {
        "pending",
        "ok",
        "configuration_or_output_invalid",
        "model_busy",
        "model_timeout",
        "invalid_model_output",
        "capability_unavailable",
        "input_too_large",
        "provider_unavailable",
        "model_failed",
    }
    for row in rows:
        expected_profile = configuration[row["provider"]].get("profile")
        if row["status"] not in statuses or (
            expected_profile and row.get("profile") != expected_profile
        ):
            raise ValueError("Changed checkpoint status/profile")
        if not isinstance(row.get("attempts"), list):
            raise ValueError("Invalid attempt history")
        if row["status"] == "ok":
            validate_result("summaries", row["result"], originals[row["case_id"]])
    for provider, deadline in saved.get("provider_next_at", {}).items():
        if (
            provider not in providers
            or type(deadline) not in (int, float)
            or not math.isfinite(deadline)
            or deadline < 0
        ):
            raise ValueError("Invalid checkpoint cooldown")


@dataclass(frozen=True)
class ComparisonPolicy:
    max_attempts: int = 4
    max_wait: float = 120
    budget: float = 900
    rpm: dict = field(default_factory=lambda: {p: 4 for p in PROVIDERS})
    tpm: dict = field(default_factory=lambda: {p: 6000 for p in PROVIDERS})

    @classmethod
    def load(cls):
        values = {}
        if os.environ.get("NODE_ENV") != "production":
            from dotenv import dotenv_values

            path = root_directory() / ".env"
            if path.exists():
                values = {
                    k: v for k, v in dotenv_values(path).items() if k.startswith("AI_COMPARE_")
                }
        values.update({k: v for k, v in os.environ.items() if k.startswith("AI_COMPARE_")})

        def number(key, default, minimum, maximum, cast=float):
            value = cast(values.get("AI_COMPARE_" + key) or default)
            if not math.isfinite(value) or not minimum <= value <= maximum:
                raise ValueError("Invalid comparison policy")
            return value

        return cls(
            max_attempts=number("MAX_ATTEMPTS", 4, 1, 10, int),
            max_wait=number("MAX_WAIT_SECONDS", 120, 0, 600),
            budget=number("RUN_BUDGET_SECONDS", 900, 1, 3600),
            rpm={p: number(p.upper() + "_RPM", 4, 1, 10000, int) for p in PROVIDERS},
            tpm={p: number(p.upper() + "_TPM", 6000, 1, 1000000000, int) for p in PROVIDERS},
        )

    def interval(self, settings, provider, request):
        if provider not in PROVIDERS:
            return 0
        # Approximate pacing only; server limits and retry hints remain authoritative.
        size = len(json.dumps(request.model_dump(), ensure_ascii=False).encode())
        estimate = math.ceil((size + len(prompt("summaries").encode())) / 2)
        estimate += settings.summary_output_tokens
        rpm, tpm = self.rpm.get(provider, 0), self.tpm.get(provider, 0)
        return max(60 / rpm if rpm else 0, 60 * estimate / tpm if tpm else 0)


@contextmanager
def output_lock(directory):
    """OS releases this nonblocking lock on exit/crash; no stale-PID recovery."""
    with (Path(directory) / ".run.lock").open("a+b") as handle:
        if handle.tell() == 0:
            handle.write(b"\0")
            handle.flush()
        handle.seek(0)
        try:
            if os.name == "nt":
                import msvcrt

                msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl

                fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            raise ValueError("Comparison output is already in use") from None
        try:
            yield
        finally:
            handle.seek(0)
            if os.name == "nt":
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)


async def run_rows(
    snapshot,
    settings,
    evaluate,
    checkpoint,
    *,
    policy=None,
    sleep=asyncio.sleep,
    clock=time.time,
    jitter=random.random,
    progress=None,
):
    policy = policy or ComparisonPolicy()
    deadline = clock() + policy.budget
    snapshot["policy"] = asdict(policy)
    next_at = snapshot.setdefault("provider_next_at", {})
    cases = {
        case["id"]: SummaryRequest.model_validate(case["request"])
        for case in snapshot["dataset"]["cases"]
    }
    paused_providers = set()

    def notify(**event):
        if progress:
            progress(event)

    for index, row in enumerate(snapshot["rows"]):
        if row["status"] != "pending":
            continue
        provider = row["provider"]
        if provider in paused_providers:
            continue
        request = cases[row["case_id"]]
        for attempt in range(1, policy.max_attempts + 1):
            delay = max(0, next_at.get(provider, 0) - clock())
            row["next_retry_at"] = next_at.get(provider, 0)
            if delay > policy.max_wait or clock() + delay >= deadline:
                notify(provider=provider, row=index + 1, status="paused", retry_after_seconds=delay)
                checkpoint()
                break
            while delay > 0:
                chunk = min(delay, 30)
                notify(provider=provider, row=index + 1, status="waiting", seconds=chunk)
                await sleep(chunk)
                row["wait_seconds"] = row.get("wait_seconds", 0) + chunk
                delay = max(0, next_at.get(provider, 0) - clock())
            if clock() >= deadline:
                break
            started = clock()
            next_at[provider] = started + policy.interval(settings, provider, request)
            metadata = {"number": len(row["attempts"]) + 1, "started_at": started}
            retry = False
            try:
                async with asyncio.timeout(max(0, deadline - clock())):
                    result, usage, profile = await evaluate(provider, request)
                result = validate_result("summaries", result, request)
                row.update(status="ok", result=result, usage=usage, profile=profile)
                metadata["status"] = "ok"
            except ExecutionError as error:
                codes = {
                    "model_busy",
                    "model_timeout",
                    "invalid_model_output",
                    "capability_unavailable",
                    "input_too_large",
                    "provider_unavailable",
                    "model_failed",
                }
                code = str(error) if str(error) in codes else "provider_unavailable"
                metadata["status"] = code
                retry = isinstance(error, ProviderError) and error.retryable
                if isinstance(error, ProviderError):
                    metadata["http_status"] = error.status
                if retry:
                    backoff = min(60, 5 * 2 ** (attempt - 1)) + jitter()
                    hint = error.retry_after
                    metadata["retry_after_seconds"] = hint
                    next_at[provider] = max(next_at[provider], clock() + max(backoff, hint))
                    row.update(status="pending", last_error=code, next_retry_at=next_at[provider])
                else:
                    row["status"] = code
            except ValueError:
                row["status"] = metadata["status"] = "configuration_or_output_invalid"
            except TimeoutError:
                # Invocation budget expired, not a quality failure of the candidate.
                row["status"] = "pending"
                row["last_error"] = metadata["status"] = "run_budget_exhausted"
            except asyncio.CancelledError:
                metadata["status"] = "interrupted"
                metadata["latency_ms"] = round(max(0, clock() - started) * 1000, 2)
                row["attempts"].append(metadata)
                row["last_error"] = "interrupted"
                checkpoint()
                raise
            metadata["latency_ms"] = round(max(0, clock() - started) * 1000, 2)
            row["attempts"].append(metadata)
            row["latency_ms"] = round(sum(a["latency_ms"] for a in row["attempts"]), 2)
            if row["status"] != "pending":
                row.pop("next_retry_at", None)
            checkpoint()
            notify(
                provider=provider, row=index + 1, status=row["status"], attempt=metadata["number"]
            )
            if not retry:
                break
            if attempt == policy.max_attempts:
                # Do not spend another retry budget on each remaining case of
                # a provider which is still limited in this invocation.
                paused_providers.add(provider)
    snapshot["state"] = (
        "pending" if any(r["status"] == "pending" for r in snapshot["rows"]) else "complete"
    )
    checkpoint()
