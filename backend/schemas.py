from pydantic import BaseModel
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
    email: str
    full_name: str
    role: UserRoleSchema

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    domain: str
    tech_stack: str
    tier1_price: float
    tier2_price: float

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner: UserResponse
    class Config:
        from_attributes = True

# Custom Request Schemas
class CustomRequestBase(BaseModel):
    title: str
    description: str
    budget_range: str
    deadline: str

class CustomRequestCreate(CustomRequestBase):
    pass

class CustomRequestResponse(CustomRequestBase):
    id: int
    status: CustomRequestStatusSchema
    student: UserResponse
    # bids: List[...] would go here if needed
    class Config:
        from_attributes = True
