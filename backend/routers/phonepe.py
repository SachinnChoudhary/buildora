import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Body, Request
from sqlalchemy.orm import Session
from phonepe.sdk.pg.payments.v2.standard_checkout_client import StandardCheckoutClient
from phonepe.sdk.pg.env import Env
from phonepe.sdk.pg.payments.v2.models.request.standard_checkout_pay_request import StandardCheckoutPayRequest

from ..database import get_db
from ..models import Order, Project, User
from .auth import get_current_user
from ..main import limiter

router = APIRouter(prefix="/api/phonepe", tags=["PhonePe"])

# PhonePe Configuration
MERCHANT_ID = os.getenv("PHONEPE_MERCHANT_ID", "PGMERCULT")
CLIENT_ID = os.getenv("PHONEPE_CLIENT_ID", "client_id_123")
CLIENT_SECRET = os.getenv("PHONEPE_CLIENT_SECRET", "client_secret_123")
CLIENT_VERSION = int(os.getenv("PHONEPE_CLIENT_VERSION", "1"))
ENV_TYPE = os.getenv("PHONEPE_ENV", "SANDBOX")

# Initialize SDK Client
env = Env.SANDBOX if ENV_TYPE == "SANDBOX" else Env.PRODUCTION
phonepe_client = StandardCheckoutClient.get_instance(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_version=CLIENT_VERSION,
    env=env
)

@router.post("/create-order")
@limiter.limit("5/minute")
async def create_phonepe_order(
    request: Request,
    project_id: int = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    amount_in_paise = int(project.tier1_price * 100)
    merchant_order_id = f"PH_{uuid.uuid4().hex[:12]}"

    # 1. Create local order record
    new_order = Order(
        project_id=project_id,
        buyer_id=current_user.id,
        amount=project.tier1_price,
        status="pending",
        provider="phonepe",
        merchant_order_id=merchant_order_id
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # 2. Build PhonePe Request
    # redirect_url after payment is completed on PhonePe checkout page
    # It should ideally point to a success page or dashboard
    redirect_url = os.getenv("PHONEPE_REDIRECT_URL", "http://localhost:5173/dashboard?status=success")

    try:
        pay_request = StandardCheckoutPayRequest.build_request(
            merchant_order_id=merchant_order_id,
            amount=amount_in_paise,
            redirect_url=redirect_url
        )
        response = phonepe_client.pay(pay_request)
        return {"redirect_url": response.redirect_url, "merchant_order_id": merchant_order_id}
    except Exception:
        # Rollback local order if gateway fails
        db.delete(new_order)
        db.commit()
        raise HTTPException(status_code=500, detail="PhonePe order creation failed due to an internal error")

@router.get("/status/{merchant_order_id}")
async def check_phonepe_status(
    merchant_order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually check order status from PhonePe with ownership verification
    """
    try:
        # Find order in DB first to check ownership
        order = db.query(Order).filter(Order.merchant_order_id == merchant_order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.buyer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized access to order status")

        status_response = phonepe_client.get_order_status(merchant_order_id=merchant_order_id)
        
        # Update order status based on PhonePe state
        if status_response.state == "COMPLETED":
            order.status = "completed"
            db.commit()
        elif status_response.state == "FAILED":
            order.status = "failed"
            db.commit()

        return {"status": status_response.state, "order_id": order.id}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="An error occurred while checking payment status")
