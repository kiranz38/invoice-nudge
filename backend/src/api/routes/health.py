from fastapi import APIRouter
from sqlalchemy import text
from src.database import async_session

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check():
    try:
        async with async_session() as session:
            await session.execute(text("SELECT 1"))
            return {"status": "healthy", "database": "connected", "version": "1.0.0"}
    except Exception:
        return {"status": "unhealthy", "database": "disconnected"}
