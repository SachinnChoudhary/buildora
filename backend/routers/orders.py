import os
import razorpay
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, security
from pydantic import BaseModel
from ..main import limiter

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

# Initialize Razorpay Client
RAZORPAY_KEY_ID = os.environ.get("VITE_RAZORPAY_KEY_ID", "rzp_test_mock")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "mock_secret")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class RazorpayOrderRequest(BaseModel):
    project_id: int

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-razorpay-order")
@limiter.limit("5/minute")
async def create_razorpay_order(
    request: Request,
    order_req: RazorpayOrderRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == order_req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Razorpay amount is in paise (100 paise = 1 INR)
    # Defaulting to INR for Razorpay integration
    amount_in_paise = int(project.tier1_price * 100)
    
    try:
        data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_{current_user.id}_{project.id}",
            "notes": {
                "project_id": project.id,
                "buyer_id": current_user.id
            }
        }
        razorpay_order = client.order.create(data=data)
        
        # Save a pending order in our DB
        db_order = models.Order(
            project_id=project.id,
            buyer_id=current_user.id,
            amount=project.tier1_price,
            status="pending",
            razorpay_order_id=razorpay_order['id']
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        return {
            "order_id": razorpay_order['id'],
            "amount": amount_in_paise,
            "currency": "INR",
            "key_id": RAZORPAY_KEY_ID
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Razorpay order creation failed. Please try again later.")

@router.post("/verify-payment")
@limiter.limit("5/minute")
async def verify_payment(
    request: Request,
    verify_req: RazorpayVerifyRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': verify_req.razorpay_order_id,
            'razorpay_payment_id': verify_req.razorpay_payment_id,
            'razorpay_signature': verify_req.razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)
        
        # Update order status in DB
        order = db.query(models.Order).filter(models.Order.razorpay_order_id == verify_req.razorpay_order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.buyer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized payment verification")

        order.status = "completed"
        order.razorpay_payment_id = verify_req.razorpay_payment_id
        order.razorpay_signature = verify_req.razorpay_signature
        db.commit()
        
        return {"status": "success", "message": "Payment verified and order completed"}
    except razorpay.errors.SignatureVerificationError:
        # Specific handling for signature mismatch
        order = db.query(models.Order).filter(models.Order.razorpay_order_id == verify_req.razorpay_order_id).first()
        if order:
            order.status = "failed"
            db.commit()
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Payment verification failed due to an internal error")

@router.get("/my-orders")
def get_my_orders(db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    orders = db.query(models.Order).filter(models.Order.buyer_id == current_user.id, models.Order.status == "completed").all()
    result = []
    for order in orders:
        project = db.query(models.Project).filter(models.Project.id == order.project_id).first()
        if project:
            result.append({
                "order_id": order.id,
                "project_id": project.id,
                "project_title": project.title,
                "amount": order.amount,
                "date": "Today",
                "status": order.status
            })
    return result

@router.get("/{order_id}")
def get_order_details(order_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this order")
    
    project = db.query(models.Project).filter(models.Project.id == order.project_id).first()
    return {
        "order_id": order.id,
        "amount": order.amount,
        "status": order.status,
        "project": project
    }
