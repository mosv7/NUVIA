from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.v1.ai import router as ai_router
from app.api.v1.health import router as health_router
from app.core.http import BodyLimitMiddleware
from app.core.settings import Settings
from app.services.ai import AiService


def create_app(settings=None):
    settings = settings or Settings.load()

    @asynccontextmanager
    async def lifespan(app):
        yield
        app.state.ai.close()

    app = FastAPI(title="NUVIA internal AI API", version="1.0.0", lifespan=lifespan)
    app.state.settings = settings
    app.state.ai = AiService(settings)
    app.add_middleware(BodyLimitMiddleware)
    app.include_router(health_router, prefix="/api/v1")
    app.include_router(ai_router, prefix="/api/v1")

    @app.exception_handler(RequestValidationError)
    async def validation_error(_request, _error):
        return JSONResponse({"error": {"code": "validation_failed"}}, status_code=400)

    @app.exception_handler(HTTPException)
    async def http_error(_request, error):
        return JSONResponse({"error": {"code": error.detail}}, status_code=error.status_code)

    return app


app = create_app()
