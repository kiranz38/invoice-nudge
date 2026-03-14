import logging
import resend
from src.config import settings

logger = logging.getLogger(__name__)

resend.api_key = settings.resend_api_key


async def send_email(to: str, subject: str, html_body: str):
    try:
        resend.Emails.send({
            "from": settings.from_email,
            "to": to,
            "subject": subject,
            "html": html_body,
        })
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        raise


async def send_welcome_email(to: str, user_name: str):
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background-color: #5c7cfa; color: #ffffff; padding: 10px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to InvoiceNudge</h1>
            </div>
            <div style="padding: 20px;">
                <p>Hi {user_name},</p>
                <p>Welcome to InvoiceNudge! We're excited to have you on board.</p>
                <p>Get started by creating your first invoice and scheduling reminders.</p>
                <p><a href="{settings.frontend_url}/dashboard">Go to Dashboard</a></p>
            </div>
            <div style="background-color: #5c7cfa; color: #ffffff; text-align: center; padding: 10px 20px; font-size: 12px;">
                <p>InvoiceNudge. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    await send_email(to, "Welcome to InvoiceNudge", html_body)


async def send_reminder_email(to: str, invoice_id: str, amount: float, days_overdue: int):
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background-color: #5c7cfa; color: #ffffff; padding: 10px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Payment Reminder</h1>
            </div>
            <div style="padding: 20px;">
                <p>This is a friendly reminder that invoice #{invoice_id} for ${amount:.2f} is {days_overdue} days overdue.</p>
                <p>Please make a payment at your earliest convenience.</p>
            </div>
        </div>
    </body>
    </html>
    """
    await send_email(to, f"Payment Reminder - Invoice #{invoice_id}", html_body)