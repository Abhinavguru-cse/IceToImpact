"""
Lake Metrics, Boundaries, Time-Series & Change Detection Endpoints
"""

import os
import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.lake import (
    LakeMetricsResponse,
    CompareResponse,
    CompareRequest,
    ComparisonItem,
    TimeSeriesPoint,
)

router = APIRouter()
ANALYTICS_PATH = "outputs/lake_analytics.json"


def load_data():
    if os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH) as f:
            return json.load(f)
    return {}


@router.get("/analytics")
def get_analytics():
    """Retrieve full analytics JSON including all observations and landmark comparisons."""
    return load_data()


@router.get("/metrics", response_model=LakeMetricsResponse)
def get_lake_metrics():
    """Summary metrics of South Lhonak lake: latest area, pre-GLOF baseline, net change."""
    data = load_data()
    obs_list = data.get("observations", [])
    if not obs_list:
        raise HTTPException(status_code=404, detail="No observation data available")

    # Latest observation
    latest = obs_list[-1]
    pre_glof = obs_list[0] if obs_list[0]["satellite"] == "Sentinel-1A" else {"area_km2": 1.624}

    pre_area = pre_glof["area_km2"]
    cur_area = latest["area_km2"]
    diff = cur_area - pre_area
    pct = (diff / pre_area) * 100.0 if pre_area > 0 else 0.0

    return LakeMetricsResponse(
        region_id="south_lhonak",
        region_name="South Lhonak Lake",
        location="North Sikkim, Sikkim, India",
        coordinates={"lat": 27.9144, "lon": 88.1836},
        elevation_m=5200.0,
        latest_observation_date=latest["date"],
        current_area_km2=round(cur_area, 4),
        current_area_ha=round(latest["area_ha"], 2),
        historical_pre_glof_area_km2=round(pre_area, 4),
        net_area_change_km2=round(diff, 4),
        net_percentage_change=round(pct, 2),
        total_observations=len(obs_list),
    )


@router.get("/timeseries", response_model=List[TimeSeriesPoint])
def get_timeseries():
    """Time-series points for historical area charting."""
    data = load_data()
    pts = []
    for o in data.get("observations", []):
        pts.append(
            TimeSeriesPoint(
                id=o["id"],
                date=o["date"],
                satellite=o["satellite"],
                area_km2=o["area_km2"],
                area_ha=o["area_ha"],
                status=o["status"],
            )
        )
    return pts


@router.get("/boundaries")
def list_boundaries():
    """List all available lake boundary GeoJSON references."""
    data = load_data()
    boundaries = []
    for o in data.get("observations", []):
        boundaries.append({
            "observation_id": o["id"],
            "date": o["date"],
            "satellite": o["satellite"],
            "area_km2": o["area_km2"],
            "geojson_url": o["boundary_geojson_url"],
        })
    return boundaries


@router.get("/boundaries/{obs_id}")
def get_boundary_by_id(obs_id: str):
    """Retrieve GeoJSON boundary polygon for an observation."""
    path = f"outputs/boundaries/{obs_id}.geojson"
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail=f"Boundary for '{obs_id}' not found")


@router.get("/compare")
def compare_observations(earlier_id: Optional[str] = None, later_id: Optional[str] = None):
    """
    If earlier_id and later_id provided, calculate change comparison.
    Otherwise return list of precomputed landmark comparisons.
    """
    data = load_data()
    if not earlier_id or not later_id:
        return data.get("comparisons", [])

    obs_map = {o["id"]: o for o in data.get("observations", [])}
    if earlier_id not in obs_map or later_id not in obs_map:
        raise HTTPException(status_code=404, detail="Observation ID not found for comparison")

    o1 = obs_map[earlier_id]
    o2 = obs_map[later_id]

    diff_km2 = o2["area_km2"] - o1["area_km2"]
    diff_ha = o2["area_ha"] - o1["area_ha"]
    pct = (diff_km2 / o1["area_km2"]) * 100.0 if o1["area_km2"] > 0 else 0.0

    return CompareResponse(
        earlier_id=o1["id"],
        earlier_date=o1["date"],
        earlier_satellite=o1["satellite"],
        earlier_area_km2=o1["area_km2"],
        later_id=o2["id"],
        later_date=o2["date"],
        later_satellite=o2["satellite"],
        later_area_km2=o2["area_km2"],
        area_change_km2=round(diff_km2, 4),
        area_change_ha=round(diff_ha, 2),
        percentage_change=round(pct, 2),
        trend="Expansion" if diff_km2 > 0.01 else ("Reduction" if diff_km2 < -0.01 else "Stable"),
        earlier_boundary_url=o1["boundary_geojson_url"],
        later_boundary_url=o2["boundary_geojson_url"],
    )


@router.post("/compare", response_model=CompareResponse)
def compare_post(req: CompareRequest):
    """Custom comparison request via POST."""
    return compare_observations(req.earlier_id, req.later_id)
