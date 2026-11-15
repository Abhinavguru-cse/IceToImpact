"""
API v1 Router Registration
"""

from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    health,
    observations,
    lake,
    layers,
    risk,
    datasets,
    processing,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.add_api_route("/analytics", lake.get_analytics, methods=["GET"], tags=["Lake Analytics"])
api_router.include_router(observations.router, prefix="/observations", tags=["Observations"])
api_router.include_router(lake.router, prefix="/lake", tags=["Lake Analytics"])
api_router.include_router(layers.router, prefix="/layers", tags=["Map Layers"])
api_router.include_router(risk.router, prefix="/risk", tags=["GLOF Susceptibility"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
api_router.include_router(processing.router, prefix="/processing", tags=["Processing Engine"])
