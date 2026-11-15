"""
Datasets Catalog Endpoint
"""

import os
from typing import List
from fastapi import APIRouter
from backend.app.schemas.lake import DatasetItem

router = APIRouter()


@router.get("", response_model=List[DatasetItem])
def list_datasets():
    """Catalog of all physical satellite, raster, vector, and inventory datasets."""
    datasets = [
        DatasetItem(
            name="NASA-ISRO SAR (NISAR) L2 GCOV Products",
            category="Synthetic Aperture Radar",
            source="NASA / JPL / ISRO",
            coverage="South Lhonak Glacier (2025-2026 Time-Series)",
            format="GeoTIFF / HDF5",
            file_count=575,
            description="Geocoded radar backscatter products in dual/quad polarization (HH, HV, VV, VH) at 10m/20m spacing in UTM Zone 45N.",
        ),
        DatasetItem(
            name="Copernicus Sentinel-1A IW GRD-HD",
            category="Synthetic Aperture Radar",
            source="ESA / Copernicus Data Space",
            coverage="28 September 2023 (Pre-GLOF Event Observation)",
            format="SAFE / GeoTIFF",
            file_count=37,
            description="Historical C-band SAR dual-polarization observation captured 6 days prior to the 4 October 2023 disaster.",
        ),
        DatasetItem(
            name="Copernicus 30m Global DEM",
            category="Digital Elevation Model",
            source="ESA / Copernicus",
            coverage="South Lhonak & Surrounding High Himalaya",
            format="GeoTIFF",
            file_count=2,
            description="30-meter elevation and slope model providing topographic context and mountain slope trigger screening.",
        ),
        DatasetItem(
            name="OpenStreetMap Teesta Basin Infrastructure",
            category="Vector Infrastructure",
            source="OpenStreetMap",
            coverage="Teesta River Valley (North Sikkim to Mangan)",
            format="GeoJSON",
            file_count=1,
            description="18,760 mapped downstream buildings, bridges, and transport infrastructure exposed to potential outburst floods.",
        ),
        DatasetItem(
            name="Randolph Glacier Inventory (RGI v7.0)",
            category="Glacier Inventory",
            source="Global Land Ice Measurements from Space (GLIMS)",
            coverage="Region 15: South Asia East",
            format="ESRI Shapefile / CSV",
            file_count=13,
            description="Comprehensive glacier boundaries, outlines, hypsometry, and area attributes for 18,587 regional glaciers.",
        ),
        DatasetItem(
            name="HydroRIVERS & HydroBASINS Asia",
            category="Hydrological Networks",
            source="World Wildlife Fund (WWF) / HydroSHEDS",
            coverage="Pan-Asian River Basins",
            format="ESRI Shapefile",
            file_count=95,
            description="Hydrographic river stream flowlines, reach attributes, and sub-basin drainage watershed polygons.",
        ),
    ]
    return datasets
