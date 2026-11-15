"""
Pydantic Schemas for IceToImpact Backend API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ObservationItem(BaseModel):
    id: str
    date: str
    satellite: str
    sensor: Optional[str] = None
    polarization: Optional[str] = None
    status: str
    area_km2: float
    area_ha: float
    area_m2: float
    pixel_count: int
    bounds: Optional[List[List[float]]] = None
    radar_layer_url: Optional[str] = None
    boundary_geojson_url: Optional[str] = None


class LakeMetricsResponse(BaseModel):
    region_id: str
    region_name: str
    location: str
    coordinates: Dict[str, float]
    elevation_m: float
    latest_observation_date: str
    current_area_km2: float
    current_area_ha: float
    historical_pre_glof_area_km2: float
    net_area_change_km2: float
    net_percentage_change: float
    total_observations: int


class ComparisonItem(BaseModel):
    comparison_title: str
    earlier_id: str
    earlier_date: str
    earlier_satellite: str
    earlier_area_km2: float
    later_id: str
    later_date: str
    later_satellite: str
    later_area_km2: float
    area_change_km2: float
    area_change_ha: float
    percentage_change: float
    trend: str
    earlier_boundary_url: Optional[str] = None
    later_boundary_url: Optional[str] = None


class CompareRequest(BaseModel):
    earlier_id: str
    later_id: str


class CompareResponse(BaseModel):
    earlier_id: str
    earlier_date: str
    earlier_satellite: str
    earlier_area_km2: float
    later_id: str
    later_date: str
    later_satellite: str
    later_area_km2: float
    area_change_km2: float
    area_change_ha: float
    percentage_change: float
    trend: str
    earlier_boundary_url: Optional[str] = None
    later_boundary_url: Optional[str] = None


class TimeSeriesPoint(BaseModel):
    id: str
    date: str
    satellite: str
    area_km2: float
    area_ha: float
    status: str


class RiskIndicatorItem(BaseModel):
    category: str
    indicator: str
    status: str
    confidence: str
    risk_level: str


class RiskResponse(BaseModel):
    study_area: Dict[str, Any]
    latest_condition: Dict[str, Any]
    indicators: List[RiskIndicatorItem]
    scientific_disclaimer: str


class DatasetItem(BaseModel):
    name: str
    category: str
    source: str
    coverage: str
    format: str
    file_count: int
    description: str
