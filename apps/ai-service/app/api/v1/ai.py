import asyncio
import hmac
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request

from app.schemas.ai import OPERATIONS, REQUESTS, RESPONSES, Capabilities
from app.services.worker import ExecutionError


async def authenticate(request: Request):
    expected = request.app.state.settings.token
    if len(expected) < 32:
        raise HTTPException(503, detail="service_not_configured")
    supplied = request.headers.get("X-AI-Service-Token", "")
    if not hmac.compare_digest(expected.encode(), supplied.encode()):
        raise HTTPException(401, detail="unauthorized")


router = APIRouter(dependencies=[Depends(authenticate)], tags=["ai"])


@router.get("/capabilities", response_model=Capabilities)
async def capabilities(request: Request):
    return await asyncio.to_thread(request.app.state.ai.capabilities)


def operation_endpoint(operation):
    async def endpoint(body, request: Request):
        request_id = str(uuid4())
        task = asyncio.create_task(request.app.state.ai.execute(operation, body))

        async def disconnected():
            while not await request.is_disconnected():
                await asyncio.sleep(0.05)

        watcher = asyncio.create_task(disconnected())
        try:
            done, _ = await asyncio.wait((task, watcher), return_when=asyncio.FIRST_COMPLETED)
            if task not in done:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
                raise HTTPException(499, detail="request_cancelled")
            result = await task
            return {**result, "request_id": request_id}
        except ExecutionError as error:
            code = str(error)
            status = {
                "model_busy": 429,
                "model_timeout": 504,
                "invalid_model_output": 502,
                "input_too_large": 413,
            }.get(code, 503)
            raise HTTPException(status, detail=code) from None
        except ValueError:
            raise HTTPException(502, detail="invalid_model_output") from None
        finally:
            watcher.cancel()
            if not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

    endpoint.__annotations__["body"] = REQUESTS[operation]
    endpoint.__name__ = operation.replace("-", "_")
    return endpoint


for operation in OPERATIONS:
    router.add_api_route(
        "/" + operation,
        operation_endpoint(operation),
        methods=["POST"],
        response_model=RESPONSES[operation],
    )
