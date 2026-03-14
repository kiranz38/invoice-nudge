from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import settings
from src.database import get_session
from src.models.user import User
from src.services.auth_service import decode_token


async def get_db() -> AsyncSession:
    async with get_session() as session:
        yield session


async def get_current_user(authorization: str = Header(...), db: AsyncSession = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
    user = await db.get(User, payload["sub"])
    if not user or not user.is_active:
        raise HTTPException(401, "Invalid or expired token")
    return user


async def get_current_active_user(authorization: str = Header(...), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(authorization, db)
    if not user.is_active:
        raise HTTPException(403, "User is not active")
    return user


def require_plan(allowed_plans: list[str]):
    async def check_plan(user: User = Depends(get_current_user)):
        if user.plan not in allowed_plans:
            raise HTTPException(403, "Insufficient plan")
        return user
    return check_plan