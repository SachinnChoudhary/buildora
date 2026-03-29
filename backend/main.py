import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import marketplace, custom_requests, auth, orders

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Buildora Backend",
    description="API for the Buildora Marketplace and Custom Build Platform",
    version="1.0.0"
)

# Dynamic CORS: production Netlify URL + local dev origins
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

allowed_origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:4173",
    "null",
    "file://",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Buildora API is running"}

app.include_router(marketplace.router)
app.include_router(custom_requests.router)
app.include_router(auth.router)
app.include_router(orders.router)
