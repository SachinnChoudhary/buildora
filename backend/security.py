import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import database, models

# Initialize Firebase Admin
# In production, set FIREBASE_CONFIG env var or provide service-account.json
if not firebase_admin._apps:
    try:
        # Check for service account file path in env
        cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to default (works on some cloud providers or with local credentials)
            firebase_admin.initialize_app()
    except Exception as e:
        # Local development fallback
        print(f"Firebase Admin initialization warning: {e}")
        firebase_admin.initialize_app()

# Security scheme for bearer tokens
security_scheme = HTTPBearer()

def get_current_user(res: HTTPAuthorizationCredentials = Depends(security_scheme), db: Session = Depends(database.get_db)):
    token = res.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify the ID token from Firebase
        decoded_token = auth.verify_id_token(token)
        email = decoded_token.get("email")
        if not email:
            raise credentials_exception
            
    except Exception as e:
        print(f"Token verification error: {e}")
        raise credentials_exception
        
    # Link Firebase user to local DB user by email
    user = db.query(models.User).filter(models.User.email == email).first()
    
    # Auto-create user in DB if they exist in Firebase but not in local DB
    if user is None:
        user = models.User(
            email=email,
            full_name=decoded_token.get("name", email.split('@')[0]),
            role=models.UserRole.STUDENT # Default role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user

# Helper for initial signup (not strictly needed with auto-create logic above)
# But kept for password hashing legacy if needed
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

