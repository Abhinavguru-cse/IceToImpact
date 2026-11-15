"""
FastAPI Main Application Entry Point for IceToImpact Platform
"""

import os
import sys
# Ensure root directory is on sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.core.config import settings
from backend.app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Scientific geospatial monitoring system for South Lhonak Glacier, Sikkim",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount outputs for layer and boundary retrieval
if os.path.exists("outputs"):
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# Mount static files (if present)
if os.path.exists("backend/app/static"):
    app.mount("/static", StaticFiles(directory="backend/app/static"), name="static")


@app.get("/")
def root():
    """Serves the dashboard index or API welcome status."""
    index_path = "backend/app/static/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "service": settings.PROJECT_NAME,
        "api_docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "status": "Operational",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
