import asyncio
import hashlib
import json
from dataclasses import replace

from httpx import ASGITransport, AsyncClient

from app.core.settings import Settings
from app.main import create_app
from app.schemas.ai import OPERATIONS
from app.services.ai import AiService


def packages(root):
    for name in ("generation", "aspect", "polarity"):
        folder = root / name
        folder.mkdir()
        (folder / "model.safetensors").write_bytes(b"fixture")
        (folder / "manifest.json").write_text(
            json.dumps(
                {
                    "version": 1,
                    "alias": name,
                    "adapter": name,
                    "input_format": "aspect_review_pair_v1" if name == "polarity" else None,
                    "files": {"model.safetensors": hashlib.sha256(b"fixture").hexdigest()},
                }
            )
        )


def test_baseline_enables_all_five_without_claiming_acceptance(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())
    service = AiService(
        Settings(model_root=str(tmp_path), baseline=True, summary_provider="qwen"), comparison=True
    )
    statuses = service.capabilities()["capabilities"]
    assert set(statuses) == set(OPERATIONS)
    for status in statuses.values():
        assert status["ready"] is True
        assert status["reason"] is None
        assert status["quality_status"] == "baseline"
        assert status["quality_accepted"] is False
        assert status["warnings"] == ["experimental_baseline", "quality_not_accepted"]
    strict = AiService(Settings(model_root=str(tmp_path)))
    assert all(not item["ready"] for item in strict.capabilities()["capabilities"].values())


def test_baseline_cannot_override_missing_or_unknown_packages(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())
    manifest_path = tmp_path / "polarity/manifest.json"
    data = json.loads(manifest_path.read_text())
    data["input_format"] = None
    manifest_path.write_text(json.dumps(data))
    (tmp_path / "generation/model.safetensors").write_bytes(b"tampered")
    statuses = AiService(Settings(model_root=str(tmp_path), baseline=True)).capabilities()[
        "capabilities"
    ]
    assert statuses["analyze"]["reason"] == "unverified_input_format"
    assert statuses["summaries"]["reason"] == "service_not_configured"
    assert all(not item["ready"] for item in statuses.values())


def test_baseline_results_are_marked_and_invalid_model_output_stays_rejected(tmp_path, monkeypatch):
    packages(tmp_path)
    monkeypatch.setattr("app.services.ai.importlib.util.find_spec", lambda _: object())

    class FixtureModel:
        invalid = False

        async def execute(self, operation, payload, **kwargs):
            if self.invalid:
                return {
                    "items": [
                        {
                            "text": "Invented fact",
                            "citations": [{"id": "foreign", "quote": "Not present"}],
                        }
                    ]
                }
            return {
                "items": [{"text": "Good food", "citations": [{"id": "a", "quote": "Good food"}]}]
            }

    async def run():
        app = create_app(Settings(token="s" * 32, model_root=str(tmp_path), baseline=True))
        # Local summaries are a CLI comparison baseline, never a production config option.
        app.state.ai = AiService(
            replace(app.state.settings, summary_provider="qwen"), comparison=True
        )
        app.state.ai.worker = FixtureModel()
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            health = (await client.get("/api/v1/health/live")).json()
            assert health["analysis_available"] is None
            assert health["baseline_enabled"] is True
            headers = {"X-AI-Service-Token": "s" * 32}
            body = {"texts": [{"id": "a", "text": "Good food"}], "locale": "en"}
            response = await client.post("/api/v1/summaries", headers=headers, json=body)
            assert response.status_code == 200
            provenance = response.json()["provenance"]
            assert provenance["quality_status"] == "baseline"
            assert provenance["quality_accepted"] is False
            app.state.ai.worker.invalid = True
            response = await client.post("/api/v1/summaries", headers=headers, json=body)
            assert response.status_code == 502

    asyncio.run(run())
