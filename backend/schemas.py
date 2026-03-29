from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from enum import Enum

class UserRoleSchema(str, Enum):
    STUDENT = "student"
    DEVELOPER = "developer"
    ADMIN = "admin"

class CustomRequestStatusSchema(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRoleSchema

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20)
    domain: str = Field(..., min_length=2, max_length=50)
    tech_stack: str = Field(..., min_length=2, max_length=200)
    tier1_price: float = Field(..., gt=0)
    tier2_price: float = Field(..., gt=0)

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner: UserResponse
    class Config:
        from_attributes = True

# Custom Request Schemas
class CustomRequestBase(BaseModel):
    title: str = Field(..., min_length=10, max_length=200)
    description: str = Field(..., min_length=50)
    budget_range: str = Field(..., min_length=2, max_length=100)
    deadline: str = Field(..., min_length=2, max_length=100)

class CustomRequestCreate(CustomRequestBase):
    pass

class CustomRequestResponse(CustomRequestBase):
    id: int
    status: CustomRequestStatusSchema
    student: UserResponse
    class Config:
        from_attributes = True
