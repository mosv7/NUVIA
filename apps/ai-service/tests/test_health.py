import asyncio

from httpx import ASGITransport, AsyncClient

from app.main import app


async def request(method, path, **kwargs):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        return await client.request(method, path, **kwargs)


def test_health_identifies_the_scaffold_without_claiming_analysis():
    response = asyncio.run(request("GET", "/api/v1/health/live"))
    assert response.status_code == 200
    assert response.json() == {
        "status": "live",
        "service": "nuvia-ai-service",
        "analysis_available": False,
    }


def test_no_analysis_endpoint_is_exposed_by_the_scaffold():
    response = asyncio.run(request("POST", "/api/v1/analyze", json={"text": "sample"}))
    assert response.status_code == 404
