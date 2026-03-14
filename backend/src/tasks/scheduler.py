import logging
from datetime import datetime, timezone
from sqlalchemy import select
from src.database import async_session
from src.models.models import Invoice, InvoiceStatus
from src.services.email_service import send_email

logger = logging.getLogger(__name__)

scheduler = None


async def send_reminders():
    """Check for overdue invoices and send reminder emails."""
    async with async_session() as session:
        query = select(Invoice).where(
            Invoice.due_date < datetime.now(timezone.utc),
            Invoice.status == InvoiceStatus.PENDING.value,
        )
        invoices = (await session.scalars(query)).all()
        for invoice in invoices:
            try:
                await send_email(
                    to=invoice.user_id,
                    subject=f"Invoice {invoice.id} is overdue",
                    html_body=f"<p>Your invoice of ${invoice.amount:.2f} was due on {invoice.due_date.strftime('%Y-%m-%d')}. Please follow up with your client.</p>",
                )
                logger.info("Sent reminder for invoice %s", invoice.id)
            except Exception as e:
                logger.error("Failed to send reminder for invoice %s: %s", invoice.id, e)


async def cleanup_expired():
    """Mark overdue invoices."""
    async with async_session() as session:
        query = select(Invoice).where(
            Invoice.due_date < datetime.now(timezone.utc),
            Invoice.status == InvoiceStatus.PENDING.value,
        )
        invoices = (await session.scalars(query)).all()
        for invoice in invoices:
            invoice.status = InvoiceStatus.OVERDUE.value
        await session.commit()
        logger.info("Marked %d invoices as overdue", len(invoices))


def start_scheduler():
    global scheduler
    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        scheduler = AsyncIOScheduler()
        scheduler.add_job(send_reminders, "interval", hours=1, id="send_reminders")
        scheduler.add_job(cleanup_expired, "cron", hour=0, minute=0, id="cleanup_expired")
        scheduler.start()
        logger.info("Scheduler started")
    except Exception as e:
        logger.warning("Scheduler failed to start: %s", e)


def shutdown_scheduler():
    global scheduler
    if scheduler:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler shut down")
