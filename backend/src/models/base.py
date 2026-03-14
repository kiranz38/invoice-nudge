from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, func
from uuid import uuid4
from datetime import datetime
from typing import Optional


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

def generate_uuid() -> str:
    return str(uuid4())