from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    per_page: int
    pages: int


class DashboardStats(BaseModel):
    total_invoices: int
    total_overdue: int
    total_paid: int
    average_payment_time: Optional[float] = None


class ClientCreateRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None


class ClientUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class InvoiceCreateRequest(BaseModel):
    client_id: str
    amount: float
    due_date: datetime


class InvoiceUpdateRequest(BaseModel):
    amount: Optional[float] = None
    due_date: Optional[datetime] = None


class InvoiceResponse(BaseModel):
    id: str
    client_id: str
    amount: float
    due_date: datetime
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ClientResponse(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}