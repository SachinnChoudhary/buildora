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

@router.get("/my-requests", response_model=List[schemas.CustomRequestResponse])
def get_my_requests(db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    return db.query(models.CustomRequest).filter(models.CustomRequest.student_id == current_user.id).all()

@router.get("/{request_id}", response_model=schemas.CustomRequestResponse)
def get_request_details(request_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    req = db.query(models.CustomRequest).filter(models.CustomRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # IDOR Check: Students can only see their own, Developers can see any OPEN ones
    if req.student_id != current_user.id and current_user.role != "developer" and current_user.role != "admin":
         raise HTTPException(status_code=403, detail="You do not have permission to access this request")
    
    return req

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
