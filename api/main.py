from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from startup import load_modules
from src.config import app_config
from src.router import load_routers


# Setup API
app = FastAPI(
    version="0.0.1",
    docs_url="/docs" if app_config.ENV != "production" else None,
    redoc_url="/redoc" if app_config.ENV != "production" else None,
)

@app.get("/health", tags=["Health"])
def route_health_check():
    return {
        "status": "healthy",
    }


# Load all registered modules
load_modules()


# Load all routers
app = load_routers(app=app)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
