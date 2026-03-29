from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, security

router = APIRouter(
    prefix="/api/custom-requests",
    tags=["Custom Requests"]
)

@router.get("/open", response_model=List[schemas.CustomRequestResponse])
def get_open_requests(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    requests = db.query(models.CustomRequest).filter(
        models.CustomRequest.status == models.CustomRequestStatus.OPEN
    ).offset(skip).limit(limit).all()
    return requests

@router.post("/", response_model=schemas.CustomRequestResponse)
def create_custom_request(
    req_in: schemas.CustomRequestCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_obj = models.CustomRequest(
        title=req_in.title,
        description=req_in.description,
        budget_range=req_in.budget_range,
        deadline=req_in.deadline,
        student_id=current_user.id,
        status=models.CustomRequestStatus.OPEN
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
