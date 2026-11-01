import asyncio
import copy
import json
from dataclasses import replace

import pytest
from test_summary_comparison import dataset
from test_summary_providers import RESULT, settings

from app.evaluation.comparison_runner import ComparisonPolicy, output_lock
from app.evaluation.summaries import compare, digest, promote
from app.services.summary_providers import ProviderError, summary_config


class FakeClock:
    def __init__(self):
        self.now = 1000.0
        self.waits = []

    def time(self):
        return self.now

    async def sleep(self, delay):
        self.waits.append(delay)
        self.now += delay


def policy(**kwargs):
    return ComparisonPolicy(
        rpm={p: 0 for p in ("gemini", "groq", "ollama")},
        tpm={p: 0 for p in ("gemini", "groq", "ollama")},
        **kwargs,
    )


def test_retries_honor_hint_checkpoint_before_wait_and_preserve_attempts(tmp_path):
    clock = FakeClock()
    calls = []
    output = tmp_path / "run"

    async def evaluator(provider, request):
        calls.append(provider)
        if len(calls) == 1:
            raise ProviderError("model_busy", status=429, retryable=True, retry_after=35)
        return RESULT, {}, summary_config(settings()).profile

    async def sleeper(delay):
        saved = json.loads((output / "results.json").read_text())
        assert saved["rows"][0]["status"] == "pending"
        assert saved["rows"][0]["attempts"][0]["status"] == "model_busy"
        await clock.sleep(delay)

    result = asyncio.run(
        compare(
            settings(),
            dataset(),
            ["groq"],
            output,
            run=True,
            evaluator=evaluator,
            policy=policy(),
            sleep=sleeper,
            clock=clock.time,
            jitter=lambda: 0,
        )
    )
    assert result["state"] == "complete"
    assert len(calls) == 3
    assert sum(clock.waits) >= 35
    assert max(clock.waits) <= 30
    assert len(result["rows"][0]["attempts"]) == 2


def test_long_quota_pauses_only_that_provider_and_resume_reuses_completed_outputs(tmp_path):
    clock = FakeClock()
    calls = []
    output = tmp_path / "run"
    limited = True

    async def evaluator(provider, request):
        calls.append(provider)
        if provider == "gemini" and limited:
            raise ProviderError("model_busy", status=429, retryable=True, retry_after=86400)
        return RESULT, {}, summary_config(replace(settings(), summary_provider=provider)).profile

    args = dict(
        run=True,
        evaluator=evaluator,
        policy=policy(max_wait=60),
        sleep=clock.sleep,
        clock=clock.time,
        jitter=lambda: 0,
    )
    result = asyncio.run(compare(settings(), dataset(), ["gemini", "groq"], output, **args))
    assert result["state"] == "pending"
    assert calls.count("gemini") == 1
    assert calls.count("groq") == 2
    before_ids = {r["candidate_id"] for r in result["rows"]}
    clock.now += 86401
    limited = False
    result = asyncio.run(
        compare(settings(), dataset(), ["gemini", "groq"], output, resume=True, **args)
    )
    assert result["state"] == "complete"
    assert calls.count("gemini") == 3 and calls.count("groq") == 2
    assert {r["candidate_id"] for r in result["rows"]} == before_ids
    saved_digest = digest(result)
    result = asyncio.run(
        compare(settings(), dataset(), ["gemini", "groq"], output, resume=True, **args)
    )
    assert digest(result) == saved_digest
    assert len(calls) == 5


def test_bounded_attempts_and_budget_never_retry_permanent_or_invalid_outputs(tmp_path):
    clock = FakeClock()
    calls = []

    async def evaluator(provider, request):
        calls.append(provider)
        raise ProviderError("provider_unavailable", status=503, retryable=True)

    result = asyncio.run(
        compare(
            settings(),
            dataset(),
            ["groq"],
            tmp_path / "transient",
            run=True,
            evaluator=evaluator,
            policy=policy(max_attempts=2, budget=20),
            sleep=clock.sleep,
            clock=clock.time,
            jitter=lambda: 0,
        )
    )
    assert result["state"] == "pending"
    assert max(len(r["attempts"]) for r in result["rows"]) <= 2
    assert len(calls) == 2
    assert clock.now <= 1020

    async def permanent(provider, request):
        raise ProviderError("provider_unavailable", status=401)

    result = asyncio.run(
        compare(
            settings(),
            dataset(),
            ["groq"],
            tmp_path / "permanent",
            run=True,
            evaluator=permanent,
            policy=policy(),
            sleep=clock.sleep,
            clock=clock.time,
        )
    )
    assert result["state"] == "complete"
    assert all(len(r["attempts"]) == 1 for r in result["rows"])


def test_resume_rejects_changed_models_data_and_completed_review(tmp_path):
    clock = FakeClock()

    async def evaluator(provider, request):
        raise ProviderError("model_busy", status=429, retryable=True, retry_after=86400)

    output = tmp_path / "run"
    args = dict(run=True, evaluator=evaluator, policy=policy(), sleep=clock.sleep, clock=clock.time)
    asyncio.run(compare(settings(), dataset(), ["groq"], output, **args))
    with pytest.raises(ValueError):
        asyncio.run(
            compare(
                replace(settings(), groq_model="changed"),
                dataset(),
                ["groq"],
                output,
                resume=True,
                **args,
            )
        )
    changed = copy.deepcopy(dataset())
    changed["cases"][0]["request"]["locale"] = "ar"
    with pytest.raises(ValueError):
        asyncio.run(compare(settings(), changed, ["groq"], output, resume=True, **args))
    review_path = output / "blind-review.json"
    review = json.loads(review_path.read_text())
    review["candidates"][0]["ratings"]["coverage"] = 3
    review_path.write_text(json.dumps(review))
    with pytest.raises(ValueError):
        asyncio.run(compare(settings(), dataset(), ["groq"], output, resume=True, **args))


def test_cancel_saves_completed_rows_and_releases_output_lock(tmp_path):
    clock = FakeClock()
    calls = []

    async def evaluator(provider, request):
        calls.append(provider)
        if len(calls) == 2:
            raise asyncio.CancelledError()
        return RESULT, {}, "a" * 64

    output = tmp_path / "run"
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(
            compare(
                settings(),
                dataset(),
                ["groq"],
                output,
                run=True,
                evaluator=evaluator,
                policy=policy(),
                clock=clock.time,
            )
        )
    saved = json.loads((output / "results.json").read_text())
    assert saved["rows"][0]["status"] == "ok"
    assert saved["rows"][1]["status"] == "pending"
    with output_lock(output):
        with pytest.raises(ValueError):
            with output_lock(output):
                pass


def test_provider_pacing_is_configurable_and_persisted(tmp_path):
    clock = FakeClock()

    async def evaluator(provider, request):
        return RESULT, {}, "a" * 64

    result = asyncio.run(
        compare(
            settings(),
            dataset(),
            ["groq"],
            tmp_path / "run",
            run=True,
            evaluator=evaluator,
            policy=ComparisonPolicy(rpm={"groq": 2}, tpm={"groq": 0}),
            sleep=clock.sleep,
            clock=clock.time,
        )
    )
    assert sum(clock.waits) >= 30
    assert result["provider_next_at"]["groq"] >= clock.now


def test_pending_run_cannot_be_promoted(tmp_path):
    from test_summary_comparison import rated_run

    result, review = rated_run(tmp_path)
    result["state"] = "pending"
    review["results_digest"] = digest(result)
    with pytest.raises(ValueError):
        promote(replace(settings(), model_root=str(tmp_path / "models")), result, review, "groq")


@pytest.mark.parametrize("missing", [True, False])
def test_resume_recovers_missing_or_stale_ungraded_review_without_repeating_success(
    tmp_path, missing
):
    clock = FakeClock()
    calls = []

    async def evaluator(provider, request):
        calls.append(provider)
        if len(calls) == 2:
            raise asyncio.CancelledError()
        return RESULT, {}, summary_config(settings()).profile

    output = tmp_path / "run"
    args = dict(run=True, evaluator=evaluator, policy=policy(), clock=clock.time)
    with pytest.raises(asyncio.CancelledError):
        asyncio.run(compare(settings(), dataset(), ["groq"], output, **args))
    path = output / "blind-review.json"
    if missing:
        path.unlink()
    else:
        review = json.loads(path.read_text())
        review["results_digest"] = "stale-after-interrupted-pair-publication"
        path.write_text(json.dumps(review))
    result = asyncio.run(compare(settings(), dataset(), ["groq"], output, resume=True, **args))
    assert result["state"] == "complete"
    assert len(calls) == 3
    assert json.loads(path.read_text())["results_digest"] == digest(result)


def test_resume_rejects_tampered_saved_dataset_even_if_old_signature_is_retained(tmp_path):
    clock = FakeClock()

    async def evaluator(provider, request):
        raise ProviderError("model_busy", status=429, retryable=True, retry_after=86400)

    output = tmp_path / "run"
    args = dict(run=True, evaluator=evaluator, policy=policy(), clock=clock.time)
    asyncio.run(compare(settings(), dataset(), ["groq"], output, **args))
    path = output / "results.json"
    saved = json.loads(path.read_text())
    saved["dataset"]["cases"][0]["request"]["texts"][0]["text"] = "Altered evidence"
    path.write_text(json.dumps(saved))
    with pytest.raises(ValueError):
        asyncio.run(compare(settings(), dataset(), ["groq"], output, resume=True, **args))


def test_resume_rejects_inconsistent_complete_state(tmp_path):
    clock = FakeClock()

    async def evaluator(provider, request):
        raise ProviderError("model_busy", status=429, retryable=True, retry_after=86400)

    output = tmp_path / "run"
    args = dict(run=True, evaluator=evaluator, policy=policy(), clock=clock.time)
    asyncio.run(compare(settings(), dataset(), ["groq"], output, **args))
    path = output / "results.json"
    saved = json.loads(path.read_text())
    saved["state"] = "complete"
    path.write_text(json.dumps(saved))
    review_path = output / "blind-review.json"
    review = json.loads(review_path.read_text())
    review["results_digest"] = digest(saved)
    review_path.write_text(json.dumps(review))
    with pytest.raises(ValueError):
        asyncio.run(compare(settings(), dataset(), ["groq"], output, resume=True, **args))


def test_invocation_budget_cancels_inflight_evaluation_without_failing_quality(tmp_path):
    calls = []

    async def evaluator(provider, request):
        calls.append(provider)
        await asyncio.sleep(1)
        return RESULT, {}, "a" * 64

    result = asyncio.run(
        compare(
            settings(),
            dataset(),
            ["groq"],
            tmp_path / "run",
            run=True,
            evaluator=evaluator,
            policy=policy(budget=0.02),
        )
    )
    assert result["state"] == "pending"
    assert len(calls) == 1
    assert result["rows"][0]["last_error"] == "run_budget_exhausted"
