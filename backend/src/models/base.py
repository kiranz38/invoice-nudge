from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, func
from uuid import uuid4
from typing import Optional

Base = declarative_base()

class TimestampMixin:
    created_at: Mapped[Optional[DateTime]] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[Optional[DateTime]] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

def generate_uuid() -> str:
    return str(uuid4())