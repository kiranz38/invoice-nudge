import enum
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.base import Base, TimestampMixin, generate_uuid
from datetime import datetime


class InvoiceStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"


class Client(Base, TimestampMixin):
    __tablename__ = 'clients'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey('users.id'), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(String, nullable=True)

    def __repr__(self):
        return f"<Client(name={self.name}, email={self.email})>"


class Invoice(Base, TimestampMixin):
    __tablename__ = 'invoices'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey('users.id'), nullable=False)
    client_id: Mapped[str] = mapped_column(String, ForeignKey('clients.id'), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String, default=InvoiceStatus.PENDING.value)
    payment_method: Mapped[str] = mapped_column(String, nullable=True)

    def __repr__(self):
        return f"<Invoice(amount={self.amount}, due_date={self.due_date}, status={self.status})>"


class Reminder(Base, TimestampMixin):
    __tablename__ = 'reminders'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    invoice_id: Mapped[str] = mapped_column(String, ForeignKey('invoices.id'), nullable=False)
    reminder_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    user_id: Mapped[str] = mapped_column(String, ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f"<Reminder(reminder_date={self.reminder_date})>"