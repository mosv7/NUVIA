import asyncio

from httpx import ASGITransport, AsyncClient

from app.core.settings import Settings
from app.main import create_app


def test_openapi_exposes_the_required_private_header_for_generated_clients():
    app = create_app(Settings())
    schemes = app.openapi().get("components", {}).get("securitySchemes", {})
    assert any(value.get("name") == "X-AI-Service-Token" for value in schemes.values())


def test_first_model_hashing_does_not_block_other_requests(tmp_path, monkeypatch):
    import time

    from app.services.ai import AiService

    service = AiService(Settings(model_root=str(tmp_path)))

    def slow_readiness():
        time.sleep(0.2)
        return {"capabilities": {"analyze": {"ready": False}}}

    monkeypatch.setattr(service, "capabilities", slow_readiness)

    async def run():
        task = asyncio.create_task(service.execute("analyze", None))
        await asyncio.sleep(0.01)
        responsive = not task.done()
        await asyncio.gather(task, return_exceptions=True)
        assert responsive

    asyncio.run(run())


def test_internal_auth_body_limit_and_safe_unavailable(tmp_path):
    async def run():
        app = create_app(Settings(token="s" * 32, model_root=str(tmp_path)))
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
            assert (await c.get("/api/v1/capabilities")).status_code == 401
            headers = {"X-AI-Service-Token": "s" * 32}
            response = await c.get("/api/v1/capabilities", headers=headers)
            assert response.status_code == 200
            assert response.json()["capabilities"]["analyze"]["ready"] is False
            response = await c.post(
                "/api/v1/analyze",
                headers=headers,
                json={"texts": [{"id": "a", "text": "Good food"}]},
            )
            assert response.status_code == 503
            assert response.json()["error"]["code"] == "capability_unavailable"
            response = await c.post("/api/v1/analyze", headers=headers, content=b" " * 65537)
            assert response.status_code == 413
            response = await c.post(
                "/api/v1/analyze",
                headers=headers,
                json={"texts": [{"id": "a", "text": "ok"}], "ownerId": "x"},
            )
            assert response.status_code == 400
            assert "ownerId" not in response.text  # no echo of request content

    asyncio.run(run())
