"""
FastAPI Backend Application for South Lhonak Glacial Lake Monitoring Platform (IceToImpact)
Provides REST API endpoints for observations, lake boundaries, change comparisons, and GLOF risk indicators.
"""

import os
import json
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

app = FastAPI(
    title="South Lhonak Glacial Lake Monitoring & GLOF Susceptibility Platform (IceToImpact)",
    version="1.0.0",
    description="Scientific geospatial monitoring system for South Lhonak Glacier, Sikkim",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load precomputed analytics
ANALYTICS_PATH = "data/lake_analytics.json"
MODEL_PATH = "models/gmm_water_segmenter.json"


def load_analytics():
    if os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH) as f:
            return json.load(f)
    return {}


# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
def read_root():
    """Serve the primary interactive dashboard."""
    index_file = "app/static/index.html"
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "IceToImpact Monitoring API is running. UI index.html not found."}


@app.get("/api/v1/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "IceToImpact South Lhonak Platform",
        "observations_loaded": len(load_analytics().get("observations", [])),
    }


@app.get("/api/v1/regions")
def get_regions():
    """Return configured glacier monitoring regions."""
    return [
        {
            "id": "south_lhonak",
            "name": "South Lhonak Lake",
            "location": "North Sikkim, Sikkim, India",
            "center": [27.9144, 88.1836],
            "elevation_m": 5200,
            "status": "Active Monitoring",
            "primary_satellites": ["NISAR", "Sentinel-1"],
            "event_history": "Catastrophic GLOF breach on 4 October 2023",
        }
    ]


@app.get("/api/v1/observations")
def list_observations():
    """Return all catalogued observation records with measured surface areas."""
    analytics = load_analytics()
    return analytics.get("observations", [])


@app.get("/api/v1/observations/{obs_id}")
def get_observation(obs_id: str):
    """Retrieve detailed metadata for a specific observation."""
    analytics = load_analytics()
    for obs in analytics.get("observations", []):
        if obs["id"] == obs_id:
            return obs
    raise HTTPException(status_code=404, detail="Observation not found")


@app.get("/api/v1/boundaries/{obs_id}")
def get_boundary_geojson(obs_id: str):
    """Return GeoJSON boundary polygon for an observation."""
    boundary_path = f"app/static/boundaries/{obs_id}.geojson"
    if os.path.exists(boundary_path):
        with open(boundary_path) as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Boundary GeoJSON not found")


@app.get("/api/v1/comparisons")
def list_comparisons():
    """Return multi-date change detection comparisons."""
    analytics = load_analytics()
    return analytics.get("comparisons", [])


class CustomCompareRequest(BaseModel):
    earlier_id: str
    later_id: str


@app.post("/api/v1/comparisons/custom")
def custom_compare(req: CustomCompareRequest):
    """Compute on-the-fly change detection between any two selected dates."""
    analytics = load_analytics()
    obs_map = {o["id"]: o for o in analytics.get("observations", [])}

    if req.earlier_id not in obs_map or req.later_id not in obs_map:
        raise HTTPException(status_code=404, detail="One or both observation IDs not found")

    o1 = obs_map[req.earlier_id]
    o2 = obs_map[req.later_id]

    diff_km2 = o2["area_km2"] - o1["area_km2"]
    diff_ha = o2["area_ha"] - o1["area_ha"]
    pct_change = (diff_km2 / o1["area_km2"]) * 100.0 if o1["area_km2"] > 0 else 0.0

    return {
        "earlier": o1,
        "later": o2,
        "area_change_km2": round(diff_km2, 4),
        "area_change_ha": round(diff_ha, 2),
        "percentage_change": round(pct_change, 2),
        "trend": "Expansion" if diff_km2 > 0.01 else ("Reduction" if diff_km2 < -0.01 else "Stable"),
    }


@app.get("/api/v1/analytics")
def get_analytics():
    """Return complete analytics dataset."""
    return load_analytics()


@app.get("/api/v1/model-info")
def get_model_info():
    """Return trained GMM model parameters and scientific validation metrics."""
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH) as f:
            return json.load(f)
    return {"status": "Model file not found"}


@app.get("/api/v1/susceptibility")
def get_susceptibility():
    """Return preliminary GLOF susceptibility and downstream exposure indicators."""
    analytics = load_analytics()
    return analytics.get("susceptibility", {})
