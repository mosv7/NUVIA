import asyncio

from httpx import ASGITransport, AsyncClient

from app.main import app


async def request(method, path, **kwargs):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        return await client.request(method, path, **kwargs)


def test_health_identifies_liveness_without_claiming_analysis_readiness():
    response = asyncio.run(request("GET", "/api/v1/health/live"))
    assert response.status_code == 200
    assert response.json() == {
        "status": "live",
        "service": "nuvia-ai-service",
        "analysis_available": None,
        "baseline_enabled": app.state.settings.baseline,
        "capabilities_url": "/api/v1/capabilities",
    }


def test_analysis_is_never_exposed_without_internal_authentication():
    response = asyncio.run(request("POST", "/api/v1/analyze", json={"text": "sample"}))
    assert response.status_code in (401, 503)
