import asyncio
import json
from dataclasses import replace

import httpx
import pytest

from app.core.settings import Settings
from app.schemas.ai import SummaryRequest
from app.services.summary_providers import SummaryProvider, summary_config
from app.services.worker import ExecutionError

BODY = {"texts": [{"id": "a", "text": "Good food, slow service."}], "locale": "en"}
RESULT = {"items": [{"text": "Good food", "citations": [{"id": "a", "quote": "Good food"}]}]}


def settings(provider="groq"):
    return Settings(
        summary_provider=provider,
        gemini_api_key="private-gemini",
        groq_api_key="private-groq",
        gemini_model="gemini-test",
        groq_model="org/model-test",
        ollama_model="model:latest",
    )


def envelope(provider, result=RESULT):
    content = json.dumps(result)
    if provider == "gemini":
        return {
            "candidates": [{"finishReason": "STOP", "content": {"parts": [{"text": content}]}}],
            "usageMetadata": {"promptTokenCount": 20, "candidatesTokenCount": 10},
        }
    if provider == "groq":
        return {
            "choices": [{"finish_reason": "stop", "message": {"content": content}}],
            "usage": {"prompt_tokens": 20, "completion_tokens": 10},
        }
    return {
        "done": True,
        "done_reason": "stop",
        "message": {"content": content},
        "prompt_eval_count": 20,
        "eval_count": 10,
    }


@pytest.mark.parametrize("provider", ["gemini", "groq", "ollama"])
def test_wire_format_and_validated_result(provider):
    def handler(request):
        body = json.loads(request.content)
        assert "Good food" in request.content.decode()
        if provider == "gemini":
            assert request.url.host == "generativelanguage.googleapis.com"
            assert request.url.path.endswith("/gemini-test:generateContent")
            assert request.headers["x-goog-api-key"] == "private-gemini"
            assert body["generationConfig"]["responseMimeType"] == "application/json"
        elif provider == "groq":
            assert request.url.path == "/openai/v1/chat/completions"
            assert request.headers["authorization"] == "Bearer private-groq"
            assert body["response_format"] == {"type": "json_object"}
        else:
            assert request.url.path == "/api/chat"
            assert body["stream"] is False
            assert isinstance(body["format"], dict)
            assert "authorization" not in request.headers
        return httpx.Response(200, json=envelope(provider))

    adapter = SummaryProvider(settings(provider), transport=httpx.MockTransport(handler))
    result, usage = asyncio.run(adapter.generate(SummaryRequest.model_validate(BODY)))
    assert result == RESULT
    assert usage == {"input_tokens": 20, "output_tokens": 10}


@pytest.mark.parametrize(
    "status,code",
    [
        (302, "invalid_model_output"),
        (401, "provider_unavailable"),
        (429, "model_busy"),
        (500, "provider_unavailable"),
    ],
)
def test_safe_errors_no_retry_redirect_or_upstream_echo(status, code):
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(
            status,
            headers={"location": "https://other.invalid"},
            text="private-groq customer-content",
        )

    adapter = SummaryProvider(settings(), transport=httpx.MockTransport(handler))
    with pytest.raises(ExecutionError, match=f"^{code}$") as error:
        asyncio.run(adapter.generate(SummaryRequest.model_validate(BODY)))
    assert "private" not in str(error.value)
    assert len(calls) == 1


@pytest.mark.parametrize(
    "bad",
    [
        {"choices": [{"finish_reason": "length", "message": {"content": json.dumps(RESULT)}}]},
        envelope(
            "groq",
            {"items": [{"text": "Invented", "citations": [{"id": "foreign", "quote": "X"}]}]},
        ),
        envelope(
            "groq",
            {
                "items": [
                    {"text": "Food is amazing", "citations": [{"id": "a", "quote": "Good food"}]}
                ]
            },
        ),
    ],
)
def test_truncated_or_ungrounded_output_rejected(bad):
    adapter = SummaryProvider(
        settings(), transport=httpx.MockTransport(lambda _: httpx.Response(200, json=bad))
    )
    with pytest.raises(ExecutionError, match="invalid_model_output"):
        asyncio.run(adapter.generate(SummaryRequest.model_validate(BODY)))


def test_response_size_timeout_and_cancellation():
    async def run():
        adapter = SummaryProvider(
            settings(),
            transport=httpx.MockTransport(lambda _: httpx.Response(200, content=b"x" * 262145)),
        )
        with pytest.raises(ExecutionError, match="invalid_model_output"):
            await adapter.generate(SummaryRequest.model_validate(BODY))

        async def slow(_):
            await asyncio.sleep(1)
            return httpx.Response(200, json=envelope("groq"))

        adapter = SummaryProvider(
            replace(settings(), timeout=0.01), transport=httpx.MockTransport(slow)
        )
        with pytest.raises(ExecutionError, match="model_timeout"):
            await adapter.generate(SummaryRequest.model_validate(BODY))
        adapter = SummaryProvider(settings(), transport=httpx.MockTransport(slow))
        pending = asyncio.create_task(adapter.generate(SummaryRequest.model_validate(BODY)))
        await asyncio.sleep(0)
        pending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await pending

    asyncio.run(run())


def test_configuration_fingerprints_exclude_keys_but_track_model_and_limits(monkeypatch):
    config = summary_config(settings())
    assert config.profile == summary_config(replace(settings(), groq_api_key="different")).profile
    assert config.profile != summary_config(replace(settings(), groq_model="another")).profile
    assert config.profile != summary_config(replace(settings(), summary_output_tokens=1024)).profile
    assert "private" not in repr(settings())
    assert "private" not in repr(config)
    monkeypatch.setenv("NODE_ENV", "production")
    monkeypatch.setenv("AI_SUMMARY_PROVIDER", "qwen")
    with pytest.raises(ValueError):
        Settings.load()


@pytest.mark.parametrize(
    "url", ["https://user:pass@host", "http://host?secret=a", "ftp://host", "http://host/#secret"]
)
def test_ollama_rejects_credential_urls(url):
    with pytest.raises(ValueError):
        summary_config(replace(settings("ollama"), ollama_url=url))
