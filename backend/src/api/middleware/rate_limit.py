from fastapi import Request, HTTPException, status
from fastapi.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class RateLimiter:
    def __init__(self, auth_limit: int = 5, api_limit: int = 60):
        self.auth_limit = auth_limit
        self.api_limit = api_limit
        self.auth_cache: Dict[str, List[float]] = {}
        self.api_cache: Dict[str, List[float]] = {}

    async def __call__(self, request: Request, call_next):
        client_host = request.client.host
        current_time = datetime.now().timestamp()

        if request.url.path.startswith("/auth"):
            if client_host not in self.auth_cache:
                self.auth_cache[client_host] = []
            self.auth_cache[client_host].append(current_time)
            self.auth_cache[client_host] = [t for t in self.auth_cache[client_host] if current_time - t < 60]
            if len(self.auth_cache[client_host]) > self.auth_limit:
                retry_after = int(60 - (current_time - self.auth_cache[client_host][-1]))
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too Many Requests", headers={"Retry-After": str(retry_after)})

        else:
            if client_host not in self.api_cache:
                self.api_cache[client_host] = []
            self.api_cache[client_host].append(current_time)
            self.api_cache[client_host] = [t for t in self.api_cache[client_host] if current_time - t < 60]
            if len(self.api_cache[client_host]) > self.api_limit:
                retry_after = int(60 - (current_time - self.api_cache[client_host][-1]))
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too Many Requests", headers={"Retry-After": str(retry_after)})

        response = await call_next(request)
        return response

rate_limiter = RateLimiter()