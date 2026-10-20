from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: Literal["live"] = "live"
    service: Literal["nuvia-ai-service"] = "nuvia-ai-service"
    analysis_available: Literal[False] = False
