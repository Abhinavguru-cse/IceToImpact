"""
GLOF Susceptibility & Risk Endpoints
"""

import os
import json
from fastapi import APIRouter
from backend.app.schemas.lake import RiskResponse

router = APIRouter()
ANALYTICS_PATH = "outputs/lake_analytics.json"


@router.get("/indicators", response_model=RiskResponse)
def get_risk_indicators():
    """Retrieve preliminary GLOF susceptibility factors and downstream exposure indicators."""
    if os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH) as f:
            data = json.load(f)
            return data.get("susceptibility", {})
    return {}
