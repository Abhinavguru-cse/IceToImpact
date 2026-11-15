"""
Map Layers Endpoints
"""

import os
from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_available_layers():
    """Returns all available GIS raster and vector map layers."""
    return {
        "basemaps": [
            {"id": "esri_satellite", "name": "Esri World Imagery (Satellite)", "type": "raster_tile"},
            {"id": "carto_dark", "name": "CartoDB Dark Matter", "type": "raster_tile"},
            {"id": "osm", "name": "OpenStreetMap", "type": "raster_tile"},
        ],
        "raster_layers": [
            {
                "id": "nisar_radar_backscatter",
                "name": "NISAR SAR Backscatter (Calibrated dB)",
                "type": "image_overlay",
                "format": "PNG / GeoTIFF",
                "description": "10m/20m L-band geocoded radar backscatter intensity",
            },
            {
                "id": "copernicus_dem_30m",
                "name": "Copernicus 30m Global DEM",
                "type": "raster",
                "format": "GeoTIFF",
                "description": "High-mountain topography and slope model",
            },
        ],
        "vector_layers": [
            {
                "id": "lake_boundaries",
                "name": "Delineated Lake Boundary Polygons",
                "type": "geojson",
                "format": "GeoJSON",
                "description": "Multi-temporal lake perimeter polygons extracted via GMM-EM",
            },
            {
                "id": "moraine_dam_breach",
                "name": "Terminal Moraine Breach Point (2023)",
                "type": "point",
                "coordinates": [27.9180, 88.1945],
                "description": "V-notch breach origin of 4 October 2023 GLOF",
            },
            {
                "id": "teesta_drainage",
                "name": "Teesta River Drainage Network",
                "type": "polyline",
                "description": "Downstream flow corridor from South Lhonak into Teesta river",
            },
            {
                "id": "osm_downstream_infrastructure",
                "name": "Downstream Exposed Infrastructure",
                "type": "geojson",
                "count": 18760,
                "description": "OpenStreetMap buildings, bridges, and roads in Teesta valley",
            },
        ],
    }
