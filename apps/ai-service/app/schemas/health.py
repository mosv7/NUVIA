from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: Literal["live"] = "live"
    service: Literal["nuvia-ai-service"] = "nuvia-ai-service"
    analysis_available: None = None  # Liveness never computes model readiness.
    baseline_enabled: bool = False
    capabilities_url: Literal["/api/v1/capabilities"] = "/api/v1/capabilities"
