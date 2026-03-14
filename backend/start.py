"""Create tables and start the application."""
import asyncio
from src.database import engine
from src.models.base import Base
from src.models.user import User  # noqa: F401
from src.models.models import Client, Invoice, Reminder  # noqa: F401


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(create_tables())
