"""
SQLAlchemy Database Models for IceToImpact Platform
Compatible with PostgreSQL/PostGIS and SQLite (with fallback for vector geometries)
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    Float,
    DateTime,
    Text,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Region(Base):
    __tablename__ = "regions"

    region_id = Column(Integer, primary_key=True, autoincrement=True)
    region_name = Column(String(150), nullable=False)
    region_code = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    observations = relationship("Observation", back_populates="region")


class SatelliteMission(Base):
    __tablename__ = "satellite_missions"

    mission_id = Column(Integer, primary_key=True, autoincrement=True)
    mission_name = Column(String(100), nullable=False)
    sensor_name = Column(String(100), nullable=True)
    provider = Column(String(150), nullable=True)
    description = Column(Text, nullable=True)

    observations = relationship("Observation", back_populates="mission")


class Observation(Base):
    __tablename__ = "observations"

    observation_id = Column(Integer, primary_key=True, autoincrement=True)
    obs_key = Column(String(100), unique=True, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.region_id"), nullable=True)
    mission_id = Column(Integer, ForeignKey("satellite_missions.mission_id"), nullable=True)
    acquisition_date = Column(String(20), nullable=False)
    raw_date = Column(String(20), nullable=False)
    satellite = Column(String(100), nullable=False)
    sensor = Column(String(100), nullable=True)
    product_type = Column(String(100), nullable=True)
    polarization = Column(String(50), nullable=True)
    status = Column(String(50), nullable=False)
    area_km2 = Column(Float, nullable=False)
    area_ha = Column(Float, nullable=False)
    area_m2 = Column(Float, nullable=False)
    pixel_count = Column(Integer, nullable=False)
    radar_layer_url = Column(String(255), nullable=True)
    boundary_geojson_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    region = relationship("Region", back_populates="observations")
    mission = relationship("SatelliteMission", back_populates="observations")
    boundary = relationship("LakeBoundary", back_populates="observation", uselist=False)


class LakeBoundary(Base):
    __tablename__ = "lake_boundaries"

    boundary_id = Column(Integer, primary_key=True, autoincrement=True)
    observation_id = Column(Integer, ForeignKey("observations.observation_id"))
    method_name = Column(String(120), default="GMM-EM_Thresholding")
    geojson_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    observation = relationship("Observation", back_populates="boundary")


class ObservationComparison(Base):
    __tablename__ = "observation_comparisons"

    comparison_id = Column(Integer, primary_key=True, autoincrement=True)
    comparison_title = Column(String(200), nullable=False)
    earlier_id = Column(String(100), nullable=False)
    earlier_date = Column(String(20), nullable=False)
    earlier_satellite = Column(String(100), nullable=False)
    earlier_area_km2 = Column(Float, nullable=False)
    later_id = Column(String(100), nullable=False)
    later_date = Column(String(20), nullable=False)
    later_satellite = Column(String(100), nullable=False)
    later_area_km2 = Column(Float, nullable=False)
    area_change_km2 = Column(Float, nullable=False)
    area_change_ha = Column(Float, nullable=False)
    percentage_change = Column(Float, nullable=False)
    trend = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
