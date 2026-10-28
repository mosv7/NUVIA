import asyncio
from dataclasses import replace
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime

import httpx
import pytest
from test_summary_providers import BODY, settings

from app.schemas.ai import SummaryRequest
from app.services.summary_providers import ProviderError, SummaryProvider, retry_delay


def test_retry_delay_accepts_header_dates_google_details_and_groq_reset_units():
    now = datetime.now(timezone.utc).replace(microsecond=0)
    assert retry_delay({"retry-after": "17"}, {}) == 17
    assert (
        28 <= retry_delay({"retry-after": format_datetime(now + timedelta(seconds=30))}, {}) <= 30
    )
    assert (
        retry_delay(
            {},
            {
                "error": {
                    "details": [
                        {"@type": "type.googleapis.com/google.rpc.RetryInfo", "retryDelay": "65.5s"}
                    ]
                }
            },
        )
        == 65.5
    )
    assert (
        retry_delay(
            {"x-ratelimit-remaining-requests": "0", "x-ratelimit-reset-requests": "1h2m3.5s"}, {}
        )
        == 3723.5
    )
    assert (
        retry_delay(
            {
                "retry-after": "1",
                "x-ratelimit-remaining-tokens": "0",
                "x-ratelimit-reset-tokens": "7.66s",
            },
            {},
        )
        == 7.66
    )
    for text in ("NaN", "inf", "-10", "private-key", "1e999"):
        assert retry_delay({"retry-after": text}, {}) == 0


@pytest.mark.parametrize("provider", ["gemini", "groq", "ollama"])
def test_limit_metadata_is_safe_and_single_attempt_for_each_provider(provider):
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(
            429, headers={"retry-after": "61"}, json={"error": "private-key customer text"}
        )

    adapter = SummaryProvider(settings(provider), transport=httpx.MockTransport(handler))
    with pytest.raises(ProviderError) as error:
        asyncio.run(adapter.generate(SummaryRequest.model_validate(BODY)))
    assert str(error.value) == "model_busy"
    assert error.value.retryable is True
    assert error.value.retry_after == 61
    assert error.value.status == 429
    assert "private" not in repr(error.value)
    assert len(calls) == 1


@pytest.mark.parametrize(
    "status,retryable",
    [
        (400, False),
        (401, False),
        (402, False),
        (403, False),
        (404, False),
        (408, True),
        (500, True),
        (502, True),
        (503, True),
        (504, True),
    ],
)
def test_permanent_and_transient_http_failures(status, retryable):
    adapter = SummaryProvider(
        settings(),
        transport=httpx.MockTransport(
            lambda _: httpx.Response(status, json={"error": "sensitive"})
        ),
    )
    with pytest.raises(ProviderError) as error:
        asyncio.run(adapter.generate(SummaryRequest.model_validate(BODY)))
    assert error.value.retryable is retryable
    assert error.value.status == status


def test_cloud_ollama_omits_unsupported_native_schema_but_requests_plain_json():
    adapter = SummaryProvider(
        replace(settings("ollama"), ollama_url="https://ollama.com", ollama_model="gemma4:31b")
    )
    _, body = adapter.wire_request(SummaryRequest.model_validate(BODY))
    assert "format" not in body
    assert body["think"] is False
    assert "JSON" in body["messages"][0]["content"]
    local = SummaryProvider(settings("ollama"))
    assert isinstance(local.wire_request(SummaryRequest.model_validate(BODY))[1]["format"], dict)


def test_groq_reasoning_budget_and_summary_output_limit_are_independent_of_local_models():
    configured = replace(settings(), groq_model="openai/gpt-oss-120b", summary_output_tokens=2048)
    adapter = SummaryProvider(configured)
    _, body = adapter.wire_request(SummaryRequest.model_validate(BODY))
    assert body["reasoning_effort"] == "low"
    assert body["max_completion_tokens"] == 2048
    assert body["response_format"]["type"] == "json_schema"
    assert body["response_format"]["json_schema"]["strict"] is True
    assert configured.local_runtime()["output_tokens"] == 768


def test_summary_prompt_explicitly_requires_nonempty_quotes_and_no_markdown():
    adapter = SummaryProvider(settings("ollama"))
    _, body = adapter.wire_request(SummaryRequest.model_validate(BODY))
    system = body["messages"][0]["content"]
    assert "Do not use Markdown" in system
    assert "at least one" in system
