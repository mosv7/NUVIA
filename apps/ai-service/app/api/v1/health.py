from fastapi import APIRouter, Request

from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health/live", response_model=HealthResponse)
def live(request: Request) -> HealthResponse:
    return HealthResponse(baseline_enabled=request.app.state.settings.baseline)
