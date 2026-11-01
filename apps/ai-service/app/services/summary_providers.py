"""Summary-only HTTP adapters. No retries, fallback, downloads or model secrets."""

import asyncio
import hashlib
import json
import math
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from urllib.parse import urlsplit

import httpx

from app.schemas.ai import Summary
from app.services.interfaces import PROMPT_VERSION, prompt, validate_result
from app.services.worker import ExecutionError

OUTPUT_LIMIT = 262144
PROVIDERS = ("gemini", "groq", "ollama")


def summary_prompt():
    return prompt("summaries") + (
        " For this summary operation, select at least one useful exact source quotation. "
        "Cover both praise and complaints when present. Quotes keep their source language. "
        "Do not use Markdown, code fences or explanations. Begin with { and end with }. "
        "The items array must not be empty. Each text and quote must be copied verbatim."
        " Set each item text exactly equal to its first citation quote. "
        "Do not add a full stop, change case, fix grammar or normalize spelling. "
        "For example, source demo='nice food, slow staff.' permits text='nice food' "
        'with citation {"id":"demo","quote":"nice food"}; text=\'Nice food.\' is invalid. '
        "The example is an instruction only, never evidence for the current request."
    )


class ProviderError(ExecutionError):
    """Safe retry hints; never contains upstream text, request headers or keys."""

    def __init__(self, code, *, status=None, retryable=False, retry_after=0):
        super().__init__(code)
        self.status = status
        self.retryable = retryable
        self.retry_after = retry_after


def duration_seconds(value):
    if not isinstance(value, str) or not value.strip():
        return 0
    value = value.strip()
    try:
        number = float(value)
        return number if math.isfinite(number) and number >= 0 else 0
    except ValueError:
        pass
    if re.fullmatch(r"(?:\d+(?:\.\d+)?(?:ms|s|m|h|d))+", value):
        units = {"ms": 0.001, "s": 1, "m": 60, "h": 3600, "d": 86400}
        total = sum(
            float(number) * units[unit]
            for number, unit in re.findall(r"(\d+(?:\.\d+)?)(ms|s|m|h|d)", value)
        )
        return total if math.isfinite(total) else 0
    return 0


def retry_delay(headers, data):
    """Honor server delays, including long/day quotas; callers decide to pause."""
    delays = [duration_seconds(headers.get("retry-after", ""))]
    if not delays[0]:
        try:
            date = parsedate_to_datetime(headers.get("retry-after", ""))
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            delays.append(max(0, (date - datetime.now(timezone.utc)).total_seconds()))
        except (ValueError, TypeError, OverflowError):
            pass
    for kind in ("requests", "tokens"):
        if headers.get(f"x-ratelimit-remaining-{kind}") == "0":
            delays.append(duration_seconds(headers.get(f"x-ratelimit-reset-{kind}", "")))
    if isinstance(data, dict) and isinstance(data.get("error"), dict):
        details = data["error"].get("details", [])
        if isinstance(details, list):
            for detail in details:
                if isinstance(detail, dict) and str(detail.get("@type", "")).endswith(
                    "google.rpc.RetryInfo"
                ):
                    delays.append(duration_seconds(detail.get("retryDelay", "")))
    return max(delays)


@dataclass(frozen=True)
class SummaryConfig:
    provider: str
    model: str
    endpoint: str
    key: str = field(repr=False)
    profile: str
    alias: str


def summary_config(settings):
    provider = settings.summary_provider
    if provider not in PROVIDERS:
        raise ValueError("Summary provider not configured")
    model = getattr(settings, provider + "_model")
    key = getattr(settings, provider + "_api_key")
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_./:-]{0,199}", model):
        raise ValueError("Summary model not configured")
    if (provider != "ollama" and not key) or any(
        c.isspace() or ord(c) < 33 or ord(c) > 126 for c in key
    ):
        raise ValueError("Summary key not configured")
    if provider == "gemini":
        if "/" in model or ":" in model:
            raise ValueError("Use a Gemini model ID without path prefix")
        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        )
    elif provider == "groq":
        endpoint = "https://api.groq.com/openai/v1/chat/completions"
    else:
        url = urlsplit(settings.ollama_url)
        if (
            url.scheme not in ("http", "https")
            or not url.hostname
            or url.username
            or url.password
            or url.query
            or url.fragment
            or url.path not in ("", "/")
        ):
            raise ValueError("Invalid Ollama URL")
        # Validate ports too; URL is private operator configuration, never caller input.
        _ = url.port
        endpoint = settings.ollama_url.rstrip("/") + "/api/chat"
    profile = hashlib.sha256(
        json.dumps(
            {
                "provider": provider,
                "model": model,
                "endpoint": endpoint,
                "prompt": summary_prompt(),
                "prompt_version": PROMPT_VERSION,
                "schema": Summary.model_json_schema(),
                "adapter": "summary-http-v4",
                "output_tokens": settings.summary_output_tokens,
                "timeout": settings.timeout,
                "max_tokens": settings.max_tokens,
            },
            sort_keys=True,
        ).encode()
    ).hexdigest()
    alias = provider + "." + hashlib.sha256(model.encode()).hexdigest()[:16]
    return SummaryConfig(provider, model, endpoint, key, profile, alias)


class SummaryProvider:
    def __init__(self, settings, *, transport=None):
        self.settings = settings
        self.config = summary_config(settings)
        self.transport = transport
        self.cooldown = 0

    def wire_request(self, request):
        config = self.config
        user = json.dumps(request.model_dump(), ensure_ascii=False)
        system = summary_prompt()
        headers = {"Content-Type": "application/json"}
        if config.provider == "gemini":
            headers["x-goog-api-key"] = config.key
            body = {
                "systemInstruction": {"parts": [{"text": system}]},
                "contents": [{"role": "user", "parts": [{"text": user}]}],
                "generationConfig": {
                    "temperature": 0,
                    "maxOutputTokens": self.settings.summary_output_tokens,
                    "responseMimeType": "application/json",
                },
            }
        else:
            body = {
                "model": config.model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "stream": False,
            }
            if config.key:
                headers["Authorization"] = "Bearer " + config.key
            if config.provider == "groq":
                body.update(
                    temperature=0,
                    max_completion_tokens=self.settings.summary_output_tokens,
                    response_format={"type": "json_object"},
                )
                if config.model.startswith("openai/gpt-oss-"):
                    body["reasoning_effort"] = "low"
                    body["response_format"] = {
                        "type": "json_schema",
                        "json_schema": {
                            "name": "summary",
                            "strict": True,
                            "schema": Summary.model_json_schema(),
                        },
                    }
            else:
                body.update(
                    options={"temperature": 0, "num_predict": self.settings.summary_output_tokens},
                )
                if urlsplit(config.endpoint).hostname != "ollama.com":
                    body["format"] = Summary.model_json_schema()
                if config.model.startswith("gemma4"):
                    body["think"] = False
        return headers, body

    async def generate(self, request):
        headers, body = self.wire_request(request)
        try:
            # Whole-operation deadline also bounds slow/drip-fed streams.
            async with asyncio.timeout(self.settings.timeout):
                async with httpx.AsyncClient(
                    transport=self.transport,
                    timeout=self.settings.timeout,
                    follow_redirects=False,
                    trust_env=False,
                ) as client:
                    async with client.stream(
                        "POST", self.config.endpoint, headers=headers, json=body
                    ) as response:
                        self.cooldown = retry_delay(response.headers, {})
                        if 300 <= response.status_code < 400:
                            raise ExecutionError("invalid_model_output")
                        if response.status_code != 200:
                            # Parse only bounded structured retry hints; never retain error text.
                            raw, size = [], 0
                            async for chunk in response.aiter_bytes():
                                size += len(chunk)
                                if size > 16384:
                                    raw = []
                                    break
                                raw.append(chunk)
                            try:
                                details = json.loads(b"".join(raw))
                            except (ValueError, UnicodeError):
                                details = {}
                            status = response.status_code
                            raise ProviderError(
                                "model_busy"
                                if status == 429
                                else "input_too_large"
                                if status == 413
                                else "provider_unavailable",
                                status=status,
                                retryable=status in (408, 429, 500, 502, 503, 504),
                                retry_after=retry_delay(response.headers, details),
                            )
                        if "application/json" not in response.headers.get("content-type", ""):
                            raise ExecutionError("invalid_model_output")
                        chunks, size = [], 0
                        async for chunk in response.aiter_bytes():
                            size += len(chunk)
                            if size > OUTPUT_LIMIT:
                                raise ExecutionError("invalid_model_output")
                            chunks.append(chunk)
            data = json.loads(b"".join(chunks))
            text, usage = self.decode(data)
            result = validate_result("summaries", json.loads(text), request)
            return result, usage
        except (TimeoutError, httpx.TimeoutException):
            raise ProviderError("model_timeout", retryable=True) from None
        except httpx.HTTPError:
            raise ProviderError("provider_unavailable", retryable=True) from None
        except (ValueError, KeyError, TypeError, IndexError, AttributeError, UnicodeError):
            raise ExecutionError("invalid_model_output") from None

    def decode(self, data):
        provider = self.config.provider
        if provider == "gemini":
            candidates = data["candidates"]
            if len(candidates) != 1 or candidates[0]["finishReason"] != "STOP":
                raise ValueError("Incomplete candidate")
            parts = candidates[0]["content"]["parts"]
            if any("text" not in p or p.get("thought") for p in parts):
                raise ValueError("Unexpected candidate part")
            text = "".join(p["text"] for p in parts)
            usage = data.get("usageMetadata", {})
            counts = usage.get("promptTokenCount"), usage.get("candidatesTokenCount")
        elif provider == "groq":
            choices = data["choices"]
            if len(choices) != 1 or choices[0]["finish_reason"] != "stop":
                raise ValueError("Incomplete candidate")
            text = choices[0]["message"]["content"]
            usage = data.get("usage", {})
            counts = usage.get("prompt_tokens"), usage.get("completion_tokens")
        else:
            if data["done"] is not True or data.get("done_reason") != "stop":
                raise ValueError("Incomplete candidate")
            text = data["message"]["content"]
            counts = data.get("prompt_eval_count"), data.get("eval_count")
        return text, {
            name: value if type(value) is int and value >= 0 else None
            for name, value in zip(("input_tokens", "output_tokens"), counts, strict=True)
        }
