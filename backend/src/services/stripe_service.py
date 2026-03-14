import stripe
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import settings
from src.models.user import User

stripe.api_key = settings.stripe_secret_key
logger = logging.getLogger(__name__)


class StripeService:
    @staticmethod
    def create_customer(email: str, name: str) -> stripe.Customer:
        return stripe.Customer.create(email=email, name=name)

    @staticmethod
    def create_checkout_session(
        customer_id: str, price_id: str, success_url: str, cancel_url: str
    ) -> str:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            customer=customer_id,
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return session.url

    @staticmethod
    def create_portal_session(customer_id: str, return_url: str) -> str:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url,
        )
        return session.url

    @staticmethod
    def handle_webhook(payload: bytes, sig_header: str, db: AsyncSession | None = None):
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.stripe_webhook_secret
            )
        except ValueError:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise ValueError("Invalid signature")

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            logger.info("Checkout completed for customer %s", session.get("customer"))

        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            logger.info(
                "Subscription updated: %s, status=%s",
                subscription.get("id"),
                subscription.get("status"),
            )

        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            logger.info("Subscription cancelled: %s", subscription.get("id"))

        return event
