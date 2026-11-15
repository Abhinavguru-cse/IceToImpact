"""
Health Check Endpoint
"""

from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter()


@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "api_version": "v1",
        "database": settings.DATABASE_URL.split(":///")[0] if ":///" in settings.DATABASE_URL else "postgresql",
    }
