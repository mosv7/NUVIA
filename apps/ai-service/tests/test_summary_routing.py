import asyncio
import json
from dataclasses import replace

import pytest
from httpx import ASGITransport, AsyncClient
from test_baseline import packages
from test_summary_providers import BODY, RESULT, settings

from app.core.settings import Settings
from app.main import create_app
from app.schemas.ai import SummaryRequest
from app.services.ai import AiService
from app.services.summary_providers import summary_config
from app.services.worker import ExecutionError


def accept(root, config):
    (root / "acceptance.json").write_text(
        json.dumps({"summaries": {"profile": config.profile, "passed": True, "reviewed": True}})
    )


def test_default_summary_disabled_even_with_valid_qwen_and_global_baseline(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())
    configured = Settings(model_root=str(tmp_path), baseline=True)
    service = AiService(configured)
    caps = service.capabilities()["capabilities"]
    assert caps["summaries"]["reason"] == "service_not_configured"
    assert caps["analyze"]["ready"] is True
    assert caps["reports"]["ready"] is True
    local = AiService(replace(configured, summary_provider="qwen"), comparison=True)
    assert local.capabilities()["capabilities"]["summaries"]["quality_status"] == "baseline"


def test_remote_requires_reviewed_profile_and_never_requires_local_dependencies(tmp_path):
    configured = replace(settings(), model_root=str(tmp_path), baseline=True)
    service = AiService(configured)
    assert service.capabilities()["capabilities"]["summaries"]["reason"] == "unassessed"
    accept(tmp_path, summary_config(configured))
    caps = service.capabilities()["capabilities"]
    assert caps["summaries"]["ready"] is True
    assert caps["summaries"]["quality_status"] == "accepted"
    assert caps["analyze"]["ready"] is False
    changed = AiService(replace(configured, groq_model="new-model"))
    assert changed.capabilities()["capabilities"]["summaries"]["ready"] is False
    missing = AiService(replace(configured, groq_api_key=""))
    assert missing.capabilities()["capabilities"]["summaries"]["reason"] == "service_not_configured"


def test_http_summaries_do_not_fallback_to_local_worker(tmp_path, monkeypatch):
    configured = replace(settings(), model_root=str(tmp_path), token="s" * 32)
    accept(tmp_path, summary_config(configured))

    class FakeProvider:
        fail = False

        async def generate(self, request):
            if self.fail:
                raise ExecutionError("provider_unavailable")
            return RESULT, {}

    adapter = FakeProvider()
    monkeypatch.setattr("app.services.ai.SummaryProvider", lambda _: adapter)

    async def run():
        app = create_app(configured)
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            headers = {"X-AI-Service-Token": "s" * 32}
            response = await client.post("/api/v1/summaries", headers=headers, json=BODY)
            assert response.status_code == 200
            assert response.json()["provenance"]["quality_status"] == "accepted"
            assert response.json()["provenance"]["prompt_version"] == "extractive-v1"
            assert response.json()["provenance"]["models"][0].startswith("groq.")
            assert "private" not in response.text
            assert app.state.ai.worker is None
            adapter.fail = True
            response = await client.post("/api/v1/summaries", headers=headers, json=BODY)
            assert response.status_code == 503
            assert app.state.ai.worker is None

    asyncio.run(run())


def test_busy_and_cancel_release_summary_guard(tmp_path, monkeypatch):
    configured = replace(settings(), model_root=str(tmp_path))
    accept(tmp_path, summary_config(configured))

    class Slow:
        async def generate(self, _):
            await asyncio.sleep(10)

    monkeypatch.setattr("app.services.ai.SummaryProvider", lambda _: Slow())

    async def run():
        service = AiService(configured)
        request = SummaryRequest.model_validate(BODY)
        pending = asyncio.create_task(service.execute("summaries", request))
        await asyncio.sleep(0.02)
        with pytest.raises(ExecutionError, match="model_busy"):
            await service.execute("summaries", request)
        pending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await pending
        assert service.summary_lock.acquire(blocking=False)
        service.summary_lock.release()

    asyncio.run(run())


def test_api_credentials_never_enter_local_supervisor(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())
    captured = {}

    class Worker:
        def __init__(self, manifests, configuration):
            captured.update(configuration)

        async def execute(self, *args, **kwargs):
            return {"questions": [{"text": f"Question {i}?", "type": "text"} for i in range(5)]}

    monkeypatch.setattr("app.services.ai.Supervisor", Worker)
    from app.schemas.ai import SurveyRequest

    service = AiService(replace(settings(), baseline=True, model_root=str(tmp_path)))
    asyncio.run(
        service.execute(
            "survey-suggestions",
            SurveyRequest(industry="food", objective="improve service", locale="en"),
        )
    )
    assert not any("key" in k or "token" == k or "url" in k for k in captured)
    assert "private" not in repr(captured)
