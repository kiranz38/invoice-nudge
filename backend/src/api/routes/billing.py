from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from src.config import settings
from src.database import get_session
from src.models.user import User
from src.services.stripe_service import StripeService
from src.api.dependencies import get_current_user

router = APIRouter(prefix="/billing")


class PlanResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str
    interval: str


@router.get("/plans", response_model=list[PlanResponse])
async def get_plans():
    plans = [
        PlanResponse(id="free", name="Free", description="Free plan for freelancers", price=0, currency="USD", interval="month"),
        PlanResponse(id="pro", name="Pro", description="Pro plan with advanced features", price=9, currency="USD", interval="month"),
        PlanResponse(id="enterprise", name="Enterprise", description="Enterprise plan for teams", price=49, currency="USD", interval="month"),
    ]
    return plans


@router.post("/checkout")
async def create_checkout(
    plan_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if not user.stripe_customer_id:
        customer = StripeService.create_customer(user.email, user.name or user.email)
        user.stripe_customer_id = customer.id
        await db.commit()

    # Map plan_id to Stripe price_id (set via env: STRIPE_PRO_PRICE_ID, STRIPE_ENTERPRISE_PRICE_ID)
    price_map = {
        "pro": getattr(settings, "stripe_pro_price_id", ""),
        "enterprise": getattr(settings, "stripe_enterprise_price_id", ""),
    }
    price_id = price_map.get(plan_id)
    if not price_id:
        raise HTTPException(400, "Invalid plan or price not configured")

    url = StripeService.create_checkout_session(
        customer_id=user.stripe_customer_id,
        price_id=price_id,
        success_url=f"{settings.frontend_url}/dashboard?payment=success",
        cancel_url=f"{settings.frontend_url}/pricing",
    )
    return {"url": url}


@router.post("/portal")
async def create_portal(user: User = Depends(get_current_user)):
    if not user.stripe_customer_id:
        raise HTTPException(400, "No billing account found")
    url = StripeService.create_portal_session(
        customer_id=user.stripe_customer_id,
        return_url=f"{settings.frontend_url}/dashboard/settings",
    )
    return {"url": url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    event = StripeService.handle_webhook(payload, sig_header)
    return {"success": True}