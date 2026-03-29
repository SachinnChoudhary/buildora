from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, Enum
from sqlalchemy.orm import relationship
import enum
from .database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    DEVELOPER = "developer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    
    projects = relationship("Project", back_populates="owner")
    orders = relationship("Order", back_populates="buyer")
    custom_requests = relationship("CustomRequest", back_populates="student")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    domain = Column(String)
    tech_stack = Column(String)
    tier1_price = Column(Float)
    tier2_price = Column(Float)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="projects")
    orders = relationship("Order", back_populates="project")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending") # pending, completed, failed
    provider = Column(String, default="razorpay") # razorpay, phonepe
    merchant_order_id = Column(String, nullable=True) # generic field for both
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    phonepe_transaction_id = Column(String, nullable=True)
    
    project = relationship("Project", back_populates="orders")
    buyer = relationship("User", back_populates="orders")

class CustomRequestStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class CustomRequest(Base):
    __tablename__ = "custom_requests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    budget_range = Column(String)
    deadline = Column(String)
    status = Column(Enum(CustomRequestStatus), default=CustomRequestStatus.OPEN)
    student_id = Column(Integer, ForeignKey("users.id"))
    
    student = relationship("User", back_populates="custom_requests")
    bids = relationship("Bid", back_populates="custom_request")

class Bid(Base):
    __tablename__ = "bids"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("custom_requests.id"))
    developer_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    proposal_text = Column(Text)
    status = Column(String, default="pending") # pending, accepted, rejected
    
    custom_request = relationship("CustomRequest", back_populates="bids")
    developer = relationship("User")
