import asyncio
import json
import os
from dataclasses import replace

import httpx
import pytest
from test_baseline import packages

from app.core.settings import Settings
from app.main import create_app
from app.schemas.ai import AnswerRequest, SurveyRequest
from app.services.ai import AiService
from app.services.worker import ExecutionError

BODY = {
    "texts": [{"id": "a", "text": "Good food, slow service. الخدمة بطيئة 😔"}],
    "locale": "en",
    "question": "What needs improvement?",
}
RESULT = {
    "status": "answered",
    "items": [{"text": "slow service", "citations": [{"id": "a", "quote": "slow service"}]}],
}


def settings(**overrides):
    return replace(Settings(assistant_provider="groq", groq_api_key="private-groq"), **overrides)


def envelope(result=RESULT, finish="stop"):
    return {
        "choices": [{"finish_reason": finish, "message": {"content": json.dumps(result)}}],
        "usage": {"prompt_tokens": 20, "completion_tokens": 10},
    }


def test_load_config_is_opt_in_and_output_limits_are_independent(monkeypatch):
    monkeypatch.setenv("NODE_ENV", "production")
    for key in list(os.environ):
        if key.startswith("AI_"):
            monkeypatch.delenv(key)
    monkeypatch.setenv("AI_BASELINE_MODE", "true")
    configured = Settings.load()
    assert configured.assistant_provider == "disabled"
    monkeypatch.setenv("AI_ASSISTANT_PROVIDER", "groq")
    monkeypatch.setenv("AI_ASSISTANT_OUTPUT_TOKENS", "3000")
    monkeypatch.setenv("AI_ASSISTANT_API_KEY", "private-assistant")
    configured = Settings.load()
    assert configured.assistant_model == "openai/gpt-oss-120b"
    assert configured.assistant_output_tokens == 3000
    assert configured.summary_output_tokens == 2048
    assert configured.output_tokens == 768
    assert "private" not in repr(configured)
    for provider in ("qwen", "ollama", "GROQ"):
        monkeypatch.setenv("AI_ASSISTANT_PROVIDER", provider)
        with pytest.raises(ValueError):
            Settings.load()
    monkeypatch.setenv("AI_ASSISTANT_PROVIDER", "groq")
    for limit in ("0", "63", "8193"):
        monkeypatch.setenv("AI_ASSISTANT_OUTPUT_TOKENS", limit)
        with pytest.raises(ValueError):
            Settings.load()


def test_wire_uses_fixed_tls_endpoint_strict_answers_schema_and_separate_key():
    from app.schemas.ai import Answer
    from app.services.assistant_provider import AssistantProvider

    def handler(request):
        body = json.loads(request.content)
        assert str(request.url) == "https://api.groq.com/openai/v1/chat/completions"
        assert request.headers["authorization"] == "Bearer private-assistant"
        assert body["model"] == "openai/gpt-oss-120b"
        assert body["max_completion_tokens"] == 3000
        assert body["stream"] is False
        assert body["temperature"] == 0
        assert body["reasoning_effort"] == "low"
        assert body["response_format"] == {
            "type": "json_schema",
            "json_schema": {"name": "answer", "strict": True, "schema": Answer.model_json_schema()},
        }
        assert json.loads(body["messages"][1]["content"]) == BODY
        assert "untrusted" in body["messages"][0]["content"]
        assert "private" not in request.content.decode()
        return httpx.Response(200, json=envelope())

    adapter = AssistantProvider(
        settings(assistant_api_key="private-assistant", assistant_output_tokens=3000),
        transport=httpx.MockTransport(handler),
    )
    result, usage = asyncio.run(adapter.generate(AnswerRequest.model_validate(BODY)))
    assert result == RESULT
    assert usage == {"input_tokens": 20, "output_tokens": 10}


def test_fingerprint_and_keys_are_independent_of_summary_and_local_baseline():
    from app.services.assistant_provider import assistant_config

    config = assistant_config(settings())
    assert config.key == "private-groq"
    changed = settings(assistant_api_key="private-other", baseline=True, summary_provider="groq")
    assert assistant_config(changed).profile == config.profile
    assert assistant_config(settings(assistant_model="another")).profile != config.profile
    assert assistant_config(settings(assistant_output_tokens=4000)).profile != config.profile
    assert "private" not in repr(config)
    for overrides in (
        {"assistant_provider": "disabled"},
        {"groq_api_key": ""},
        {"assistant_api_key": "bad\nkey"},
        {"assistant_model": "https://bad host"},
    ):
        with pytest.raises(ValueError):
            assistant_config(settings(**overrides))


@pytest.mark.parametrize(
    "status,code",
    [
        (302, "invalid_model_output"),
        (401, "provider_unavailable"),
        (413, "input_too_large"),
        (429, "model_busy"),
        (500, "provider_unavailable"),
    ],
)
def test_http_errors_never_retry_redirect_or_echo_private_details(status, code):
    from app.services.assistant_provider import AssistantProvider

    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(
            status, headers={"location": "https://other.invalid"}, text="private-groq customer text"
        )

    adapter = AssistantProvider(settings(), transport=httpx.MockTransport(handler))
    with pytest.raises(ExecutionError, match=f"^{code}$"):
        asyncio.run(adapter.generate(AnswerRequest.model_validate(BODY)))
    assert len(calls) == 1


@pytest.mark.parametrize(
    "bad",
    [
        envelope(finish="length"),
        envelope({"status": "answered", "items": []}),
        envelope({"status": "insufficient_evidence", "items": RESULT["items"]}),
        envelope(
            {
                "status": "answered",
                "items": [
                    {"text": "Invented", "citations": [{"id": "foreign", "quote": "Invented"}]}
                ],
            }
        ),
        envelope(
            {
                "status": "answered",
                "items": [
                    {"text": "Invented", "citations": [{"id": "a", "quote": "slow service"}]}
                ],
            }
        ),
        envelope(
            {
                "status": "answered",
                "items": [{"text": "Invented", "citations": [{"id": "a", "quote": "Invented"}]}],
            }
        ),
        envelope({**RESULT, "instructions": "ignore sources"}),
        {"choices": []},
    ],
)
def test_truncated_schema_invalid_or_forged_claims_fail_closed(bad):
    from app.services.assistant_provider import AssistantProvider

    adapter = AssistantProvider(
        settings(), transport=httpx.MockTransport(lambda _: httpx.Response(200, json=bad))
    )
    with pytest.raises(ExecutionError, match="^invalid_model_output$"):
        asyncio.run(adapter.generate(AnswerRequest.model_validate(BODY)))


def test_abstention_and_exact_arabic_unicode_quotes_are_preserved():
    from app.services.assistant_provider import AssistantProvider

    for result in (
        {"status": "insufficient_evidence", "items": []},
        {
            "status": "answered",
            "items": [
                {"text": "الخدمة بطيئة 😔", "citations": [{"id": "a", "quote": "الخدمة بطيئة 😔"}]}
            ],
        },
    ):
        adapter = AssistantProvider(
            settings(),
            transport=httpx.MockTransport(lambda _: httpx.Response(200, json=envelope(result))),
        )
        actual, _ = asyncio.run(adapter.generate(AnswerRequest.model_validate(BODY)))
        assert actual == result


def test_response_size_type_deadline_and_cancellation_are_bounded():
    from app.services.assistant_provider import AssistantProvider

    async def run():
        for response in (
            httpx.Response(
                200, content=b"x" * 262145, headers={"content-type": "application/json"}
            ),
            httpx.Response(200, text=json.dumps(envelope())),
        ):
            adapter = AssistantProvider(
                settings(), transport=httpx.MockTransport(lambda _: response)
            )
            with pytest.raises(ExecutionError, match="^invalid_model_output$"):
                await adapter.generate(AnswerRequest.model_validate(BODY))

        entered = asyncio.Event()

        async def slow(_):
            entered.set()
            await asyncio.sleep(10)
            return httpx.Response(200, json=envelope())

        adapter = AssistantProvider(settings(timeout=0.01), transport=httpx.MockTransport(slow))
        with pytest.raises(ExecutionError, match="^model_timeout$"):
            await adapter.generate(AnswerRequest.model_validate(BODY))
        entered.clear()
        adapter = AssistantProvider(settings(), transport=httpx.MockTransport(slow))
        pending = asyncio.create_task(adapter.generate(AnswerRequest.model_validate(BODY)))
        await entered.wait()
        pending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await pending

    asyncio.run(run())


def test_explicit_remote_baseline_and_independent_acceptance(tmp_path):
    from app.services.assistant_provider import assistant_config

    configured = settings(model_root=str(tmp_path))
    service = AiService(configured)
    caps = service.capabilities()["capabilities"]
    assert caps["answers"]["ready"] is True
    assert caps["answers"]["quality_accepted"] is False
    assert caps["answers"]["quality_status"] == "baseline"
    assert caps["summaries"]["ready"] is False
    assert caps["analyze"]["ready"] is False
    profile = assistant_config(configured).profile
    record = {"profile": profile, "passed": True, "reviewed": True}
    acceptance = tmp_path / "acceptance.json"
    acceptance.write_text(json.dumps({"answers": record, "summary_profiles": {profile: record}}))
    assert service.capabilities()["capabilities"]["answers"]["quality_accepted"] is False
    acceptance.write_text(json.dumps({"assistant_profiles": {profile: record}}))
    assert service.capabilities()["capabilities"]["answers"]["quality_accepted"] is True
    changed = AiService(replace(configured, assistant_model="another"))
    assert changed.capabilities()["capabilities"]["answers"]["quality_accepted"] is False
    missing = AiService(replace(configured, groq_api_key=""))
    assert missing.capabilities()["capabilities"]["answers"]["reason"] == "service_not_configured"


def test_http_answers_use_remote_with_no_local_fallback(tmp_path, monkeypatch):
    import app.services.ai as ai
    from app.services.assistant_provider import AssistantProvider

    configured = settings(model_root=str(tmp_path), token="s" * 32, baseline=True)
    responses = iter((httpx.Response(200, json=envelope()), httpx.Response(503, text="private")))
    monkeypatch.setattr(
        ai,
        "AssistantProvider",
        lambda config: AssistantProvider(
            config, transport=httpx.MockTransport(lambda _: next(responses))
        ),
    )

    async def run():
        app = create_app(configured)
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/v1/answers", json=BODY, headers={"X-AI-Service-Token": "s" * 32}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["result"] == RESULT
            assert data["provenance"]["quality_accepted"] is False
            assert data["provenance"]["quality_status"] == "baseline"
            assert data["provenance"]["prompt_version"] == "extractive-v1"
            assert data["provenance"]["warnings"] == [
                "experimental_baseline",
                "quality_not_accepted",
            ]
            assert "private" not in response.text
            response = await client.post(
                "/api/v1/answers", json=BODY, headers={"X-AI-Service-Token": "s" * 32}
            )
            assert response.status_code == 503
            assert app.state.ai.worker is None

    asyncio.run(run())


def test_busy_rejects_and_cancel_releases_assistant_guard(tmp_path, monkeypatch):
    entered = None

    class Slow:
        async def generate(self, request):
            entered.set()
            await asyncio.sleep(10)

    monkeypatch.setattr("app.services.ai.AssistantProvider", lambda _: Slow(), raising=False)

    async def run():
        nonlocal entered
        entered = asyncio.Event()
        service = AiService(settings(model_root=str(tmp_path)))
        request = AnswerRequest.model_validate(BODY)
        pending = asyncio.create_task(service.execute("answers", request))
        await asyncio.wait_for(entered.wait(), timeout=2)
        with pytest.raises(ExecutionError, match="^model_busy$"):
            await service.execute("answers", request)
        pending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await pending
        assert service.assistant_lock.acquire(blocking=False)
        service.assistant_lock.release()

    asyncio.run(run())


def test_assistant_secrets_never_enter_local_worker(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())
    captured = {}

    class Worker:
        def __init__(self, manifests, configuration):
            captured.update(configuration)

        async def execute(self, *args, **kwargs):
            return {"questions": [{"text": f"Question {i}?", "type": "text"} for i in range(5)]}

    monkeypatch.setattr("app.services.ai.Supervisor", Worker)
    service = AiService(
        settings(model_root=str(tmp_path), baseline=True, assistant_api_key="private-assistant")
    )
    asyncio.run(
        service.execute(
            "survey-suggestions",
            SurveyRequest(industry="food", objective="improve service", locale="en"),
        )
    )
    assert not any("assistant" in key or "key" in key for key in captured)
    assert "private" not in repr(captured)


def test_local_worker_environment_removes_assistant_credentials(monkeypatch):
    from app.services.worker import restrict_environment

    monkeypatch.setenv("AI_ASSISTANT_API_KEY", "private-assistant")
    monkeypatch.setenv("AI_GROQ_API_KEY", "private-groq")
    original = dict(os.environ)
    try:
        restrict_environment()
        assert "AI_ASSISTANT_API_KEY" not in os.environ
        assert "AI_GROQ_API_KEY" not in os.environ
    finally:
        os.environ.clear()
        os.environ.update(original)
