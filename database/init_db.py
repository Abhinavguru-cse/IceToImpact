"""
Database Initialization and Population Script for IceToImpact Platform
Populates PostgreSQL or local SQLite database from verified analytics output.
"""

import os
import sys
import json
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.models import (
    Base,
    Region,
    SatelliteMission,
    Observation,
    LakeBoundary,
    ObservationComparison,
)

# Read DATABASE_URL from environment or fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database/icetoimpact.db")
ANALYTICS_PATH = "outputs/lake_analytics.json"


def init_db():
    print(f"[DB] Initializing database with connection: {DATABASE_URL}")

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    )

    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    # Check if already populated
    if session.query(Region).count() > 0:
        print("[DB] Database already initialized with records.")
        session.close()
        return

    print("[DB] Populating database from verified analytics...")
    if not os.path.exists(ANALYTICS_PATH):
        print(f"[DB] Analytics file {ANALYTICS_PATH} not found.")
        session.close()
        return

    with open(ANALYTICS_PATH) as f:
        data = json.load(f)

    # 1. Create South Lhonak Region
    region = Region(
        region_name="South Lhonak Lake",
        region_code="south_lhonak",
        description="Glacial lake in North Sikkim, India at 5,200m altitude. Catastrophic GLOF breach occurred on 4 October 2023.",
        center_lat=27.9144,
        center_lon=88.1836,
        elevation_m=5200.0,
    )
    session.add(region)
    session.flush()

    # 2. Create Missions
    nisar_mission = SatelliteMission(
        mission_name="NISAR",
        sensor_name="L-band SAR",
        provider="NASA-ISRO",
        description="NASA-ISRO Synthetic Aperture Radar dual-frequency L/S-band radar mission.",
    )
    s1_mission = SatelliteMission(
        mission_name="Sentinel-1",
        sensor_name="C-band SAR",
        provider="ESA Copernicus",
        description="Copernicus Sentinel-1 dual-polarization C-band SAR satellite mission.",
    )
    session.add(nisar_mission)
    session.add(s1_mission)
    session.flush()

    # 3. Create Observations
    obs_id_map = {}
    for obs in data.get("observations", []):
        mission = s1_mission if obs["satellite"] == "Sentinel-1A" else nisar_mission
        db_obs = Observation(
            obs_key=obs["id"],
            region_id=region.region_id,
            mission_id=mission.mission_id,
            acquisition_date=obs["date"],
            raw_date=obs["id"].split("_")[-1],
            satellite=obs["satellite"],
            sensor=obs["sensor"],
            product_type="Level 2 GCOV" if obs["satellite"] == "NISAR" else "Level 1 GRD",
            polarization=obs["polarization"],
            status=obs["status"],
            area_km2=obs["area_km2"],
            area_ha=obs["area_ha"],
            area_m2=obs["area_m2"],
            pixel_count=obs["pixel_count"],
            radar_layer_url=obs["radar_layer_url"],
            boundary_geojson_url=obs["boundary_geojson_url"],
        )
        session.add(db_obs)
        session.flush()
        obs_id_map[obs["id"]] = db_obs.observation_id

        # Attach GeoJSON Boundary
        b_path = f"outputs/boundaries/{obs['id']}.geojson"
        geojson_content = None
        if os.path.exists(b_path):
            with open(b_path) as bf:
                geojson_content = json.load(bf)

        boundary = LakeBoundary(
            observation_id=db_obs.observation_id,
            method_name="GMM-EM Water Segmentation",
            geojson_data=geojson_content,
        )
        session.add(boundary)

    # 4. Create Comparisons
    for comp in data.get("comparisons", []):
        db_comp = ObservationComparison(
            comparison_title=comp["comparison_title"],
            earlier_id=comp["earlier_id"],
            earlier_date=comp["earlier_date"],
            earlier_satellite=comp["earlier_satellite"],
            earlier_area_km2=comp["earlier_area_km2"],
            later_id=comp["later_id"],
            later_date=comp["later_date"],
            later_satellite=comp["later_satellite"],
            later_area_km2=comp["later_area_km2"],
            area_change_km2=comp["area_change_km2"],
            area_change_ha=comp["area_change_ha"],
            percentage_change=comp["percentage_change"],
            trend=comp["trend"],
        )
        session.add(db_comp)

    session.commit()
    print(f"[DB] Initialized database with {session.query(Observation).count()} observations and {session.query(ObservationComparison).count()} comparisons!")
    session.close()


if __name__ == "__main__":
    init_db()
