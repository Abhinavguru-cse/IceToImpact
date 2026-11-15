"""
Observations Endpoints
"""

import os
import json
from typing import List
from fastapi import APIRouter, HTTPException
from backend.app.schemas.lake import ObservationItem

router = APIRouter()
ANALYTICS_PATH = "outputs/lake_analytics.json"


def get_observations_data():
    if os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH) as f:
            data = json.load(f)
            return data.get("observations", [])
    return []


@router.get("", response_model=List[ObservationItem])
def list_observations():
    """List all registered and processed satellite observations."""
    obs = get_observations_data()
    return obs


@router.get("/{obs_id}", response_model=ObservationItem)
def get_observation_by_id(obs_id: str):
    """Retrieve metadata and measurements for a specific observation."""
    obs_list = get_observations_data()
    for o in obs_list:
        if o["id"] == obs_id:
            return o
    raise HTTPException(status_code=404, detail=f"Observation '{obs_id}' not found")
