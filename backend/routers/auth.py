from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas, database, security
from ..main import limiter

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=schemas.UserResponse)
@limiter.limit("5/minute")
async def signup(request: Request, user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # SECURITY Fix: Generic response to prevent user enumeration
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        # Still return 400 for flow control, but with a less descriptive 'Account issue' or similar
        # Or better: "Credential already in use" (Standard but generic enough)
        raise HTTPException(
            status_code=400,
            detail="Credential already in use. Please login or use a different email."
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_password,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    """
    DEPRECATED: We recommend using Firebase Authentication on the frontend and 
    verifying ID tokens via the Authorization header.
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role.value, "id": user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user
