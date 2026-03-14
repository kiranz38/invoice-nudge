from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.types import Message
from structlog import get_logger
from uuid import uuid4
from time import time
from fastapi import HTTPException

logger = get_logger()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid4())
        start_time = time()
        request.state.request_id = request_id

        try:
            response = await call_next(request)
            duration_ms = (time() - start_time) * 1000
            logger.info(
                "Request",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=duration_ms,
                request_id=request_id
            )
            return response
        except HTTPException as e:
            duration_ms = (time() - start_time) * 1000
            logger.error(
                "Request",
                method=request.method,
                path=request.url.path,
                status_code=e.status_code,
                duration_ms=duration_ms,
                request_id=request_id,
                error=str(e)
            )
            return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
        except Exception as e:
            duration_ms = (time() - start_time) * 1000
            logger.error(
                "Request",
                method=request.method,
                path=request.url.path,
                status_code=500,
                duration_ms=duration_ms,
                request_id=request_id,
                error=str(e)
            )
            return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})