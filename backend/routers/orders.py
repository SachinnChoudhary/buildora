from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, security
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

class CheckoutRequest(BaseModel):
    project_id: int
    card_number: str # Only used to mock validation

@router.post("/checkout")
def process_checkout(checkout_req: CheckoutRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    # 1. Verify project exists
    project = db.query(models.Project).filter(models.Project.id == checkout_req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 2. Mock payment processing validation
    # Real app would use Stripe SDK here.
    if len(checkout_req.card_number) < 16:
        raise HTTPException(status_code=400, detail="Payment declined: Invalid card number.")

    # 3. Create the order
    order = models.Order(
        project_id=project.id,
        buyer_id=current_user.id,
        amount=project.tier1_price, # Keeping simple for now
        status="completed"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    return {"message": "Payment successful", "order_id": order.id, "project_title": project.title}

@router.get("/my-orders")
def get_my_orders(db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    orders = db.query(models.Order).filter(models.Order.buyer_id == current_user.id).all()
    # Return basic info to map to dashboard
    result = []
    for order in orders:
        project = db.query(models.Project).filter(models.Project.id == order.project_id).first()
        if project:
            result.append({
                "order_id": order.id,
                "project_id": project.id,
                "project_title": project.title,
                "amount": order.amount,
                "date": "Today" # Mocking date for now
            })
    return result

@router.get("/{order_id}")
def get_order_details(order_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # IDOR Check: Ensure the order belongs to the current user
    if order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this order")
    
    project = db.query(models.Project).filter(models.Project.id == order.project_id).first()
    return {
        "order_id": order.id,
        "amount": order.amount,
        "status": order.status,
        "project": project
    }
