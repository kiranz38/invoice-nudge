from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from src.database import get_session
from src.models.user import User
from src.models.models import Client, Invoice, InvoiceStatus
from src.schemas.schemas import (
    ClientResponse, ClientCreateRequest, ClientUpdateRequest,
    InvoiceResponse, InvoiceCreateRequest, InvoiceUpdateRequest,
)
from src.api.dependencies import get_current_user
from src.services import service

router = APIRouter()


# ── Clients ───────────────────────────────────────────────────────────────

@router.post("/clients", response_model=ClientResponse)
async def create_client(
    data: ClientCreateRequest,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.create_client(db, current_user.id, data)


@router.get("/clients")
async def list_clients(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.list_clients_for_user(db, current_user.id, page, per_page, search)


@router.get("/clients/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.get_client_by_id(db, current_user.id, client_id)


@router.put("/clients/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    data: ClientUpdateRequest,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.update_client(db, current_user.id, client_id, data)


@router.delete("/clients/{client_id}", status_code=204)
async def delete_client(
    client_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await service.delete_client(db, current_user.id, client_id)
    return


# ── Invoices ──────────────────────────────────────────────────────────────

@router.post("/invoices", response_model=InvoiceResponse)
async def create_invoice(
    data: InvoiceCreateRequest,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.create_invoice(db, current_user.id, data)


@router.get("/invoices")
async def list_invoices(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.list_invoices_for_user(db, current_user.id, page, per_page, status)


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.get_invoice_by_id(db, current_user.id, invoice_id)


@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: str,
    data: InvoiceUpdateRequest,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.update_invoice(db, current_user.id, invoice_id, data)


@router.delete("/invoices/{invoice_id}", status_code=204)
async def delete_invoice(
    invoice_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    await service.delete_invoice(db, current_user.id, invoice_id)
    return


# ── Dashboard ─────────────────────────────────────────────────────────────

@router.get("/dashboard/stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await service.get_dashboard_stats(db, current_user.id)
