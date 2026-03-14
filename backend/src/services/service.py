from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from src.models.models import Client, Invoice, InvoiceStatus
from src.schemas.schemas import ClientCreateRequest, ClientUpdateRequest, InvoiceCreateRequest, InvoiceUpdateRequest


async def create_client(db: AsyncSession, user_id: str, data: ClientCreateRequest) -> Client:
    client = Client(
        user_id=user_id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        address=data.address,
    )
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


async def get_client_by_id(db: AsyncSession, user_id: str, client_id: str) -> Client:
    client = await db.get(Client, client_id)
    if not client or client.user_id != user_id:
        raise HTTPException(404, detail="Client not found")
    return client


async def list_clients_for_user(db: AsyncSession, user_id: str, page: int = 1, per_page: int = 20, search: str = None) -> dict:
    query = select(Client).where(Client.user_id == user_id)
    if search:
        query = query.where(Client.name.ilike(f"%{search}%"))
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    clients = (await db.scalars(query.order_by(Client.created_at.desc()).offset((page - 1) * per_page).limit(per_page))).all()
    return {"items": clients, "total": total, "page": page, "per_page": per_page, "pages": -(-total // per_page)}


async def update_client(db: AsyncSession, user_id: str, client_id: str, data: ClientUpdateRequest) -> Client:
    client = await get_client_by_id(db, user_id, client_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    await db.commit()
    await db.refresh(client)
    return client


async def delete_client(db: AsyncSession, user_id: str, client_id: str) -> None:
    client = await get_client_by_id(db, user_id, client_id)
    await db.delete(client)
    await db.commit()


async def create_invoice(db: AsyncSession, user_id: str, data: InvoiceCreateRequest) -> Invoice:
    invoice = Invoice(
        user_id=user_id,
        client_id=data.client_id,
        amount=data.amount,
        due_date=data.due_date,
        status=InvoiceStatus.PENDING.value,
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    return invoice


async def get_invoice_by_id(db: AsyncSession, user_id: str, invoice_id: str) -> Invoice:
    invoice = await db.get(Invoice, invoice_id)
    if not invoice or invoice.user_id != user_id:
        raise HTTPException(404, detail="Invoice not found")
    return invoice


async def list_invoices_for_user(db: AsyncSession, user_id: str, page: int = 1, per_page: int = 20, status: str = None) -> dict:
    query = select(Invoice).where(Invoice.user_id == user_id)
    if status:
        query = query.where(Invoice.status == status)
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    invoices = (await db.scalars(query.order_by(Invoice.created_at.desc()).offset((page - 1) * per_page).limit(per_page))).all()
    return {"items": invoices, "total": total, "page": page, "per_page": per_page, "pages": -(-total // per_page)}


async def update_invoice(db: AsyncSession, user_id: str, invoice_id: str, data: InvoiceUpdateRequest) -> Invoice:
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(invoice, field, value)
    await db.commit()
    await db.refresh(invoice)
    return invoice


async def delete_invoice(db: AsyncSession, user_id: str, invoice_id: str) -> None:
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    await db.delete(invoice)
    await db.commit()


async def get_dashboard_stats(db: AsyncSession, user_id: str) -> dict:
    total_clients = await db.scalar(select(func.count()).select_from(select(Client).where(Client.user_id == user_id).subquery()))
    total_invoices = await db.scalar(select(func.count()).select_from(select(Invoice).where(Invoice.user_id == user_id).subquery()))
    pending_invoices = await db.scalar(select(func.count()).select_from(select(Invoice).where(Invoice.user_id == user_id, Invoice.status == InvoiceStatus.PENDING.value).subquery()))
    paid_invoices = await db.scalar(select(func.count()).select_from(select(Invoice).where(Invoice.user_id == user_id, Invoice.status == InvoiceStatus.PAID.value).subquery()))
    overdue_invoices = await db.scalar(select(func.count()).select_from(select(Invoice).where(Invoice.user_id == user_id, Invoice.status == InvoiceStatus.OVERDUE.value).subquery()))
    return {
        "total_clients": total_clients or 0,
        "total_invoices": total_invoices or 0,
        "pending_invoices": pending_invoices or 0,
        "paid_invoices": paid_invoices or 0,
        "overdue_invoices": overdue_invoices or 0,
    }