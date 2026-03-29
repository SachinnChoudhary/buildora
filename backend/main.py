import os
import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from . import models
from .database import engine
from .routers import marketplace, custom_requests, auth, orders

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)

# Sentry error tracking
SENTRY_DSN = os.environ.get("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=False,
        traces_sample_rate=1.0,
    )

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Buildora Backend",
    description="API for the Buildora Marketplace and Custom Build Platform",
    version="1.0.0"
)

# Rate limiting handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 1. TrustedHostMiddleware: Prevent Host Header Injection
# In production, specify exact domains: ["buildoralabs.netlify.app", "localhost", "127.0.0.1"]
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["buildoralabs.netlify.app", "localhost", "127.0.0.1", "*"] # "*" is temporary for dev
)

# 2. ProxyHeadersMiddleware: Fix IP detection behind Netlify/Cloudflare
app.add_middleware(ProxyHeadersMiddleware, trusted_proxies="*")

# 3. Dynamic CORS
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://buildoralabs.netlify.app")
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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@limiter.limit("60/minute")
async def read_root(request: Request):
    return {"status": "ok", "message": "Buildora API is running"}

app.include_router(marketplace.router)
app.include_router(custom_requests.router)
app.include_router(auth.router)
app.include_router(orders.router)
