-- PostgreSQL + PostGIS Schema for IceToImpact Platform
-- South Lhonak Glacial Lake Monitoring & GLOF Susceptibility Assessment Platform

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Regions
CREATE TABLE IF NOT EXISTS regions (
    region_id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(150) NOT NULL,
    region_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    boundary_geom GEOMETRY(MULTIPOLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Satellite Missions
CREATE TABLE IF NOT EXISTS satellite_missions (
    mission_id BIGSERIAL PRIMARY KEY,
    mission_name VARCHAR(100) NOT NULL,
    sensor_name VARCHAR(100),
    provider VARCHAR(150),
    description TEXT
);

-- 3. Observations
CREATE TABLE IF NOT EXISTS observations (
    observation_id BIGSERIAL PRIMARY KEY,
    obs_key VARCHAR(100) UNIQUE NOT NULL,
    region_id BIGINT REFERENCES regions(region_id),
    mission_id BIGINT REFERENCES satellite_missions(mission_id),
    acquisition_datetime TIMESTAMPTZ NOT NULL,
    satellite_name VARCHAR(100) NOT NULL,
    sensor_name VARCHAR(100),
    product_type VARCHAR(100),
    polarizations VARCHAR(50),
    processing_status VARCHAR(50) NOT NULL,
    raster_file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lake Boundaries
CREATE TABLE IF NOT EXISTS lake_boundaries (
    boundary_id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES observations(observation_id),
    boundary_geom GEOMETRY(MULTIPOLYGON, 4326),
    method_name VARCHAR(120),
    method_version VARCHAR(60),
    quality_status VARCHAR(40),
    geojson_path TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lake Area Measurements
CREATE TABLE IF NOT EXISTS lake_area_measurements (
    measurement_id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES observations(observation_id),
    boundary_id BIGINT REFERENCES lake_boundaries(boundary_id),
    area_km2 DOUBLE PRECISION NOT NULL,
    area_ha DOUBLE PRECISION NOT NULL,
    area_m2 DOUBLE PRECISION NOT NULL,
    pixel_count INTEGER NOT NULL,
    calculation_method VARCHAR(120),
    quality_status VARCHAR(40),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Observation Comparisons
CREATE TABLE IF NOT EXISTS observation_comparisons (
    comparison_id BIGSERIAL PRIMARY KEY,
    earlier_obs_id BIGINT REFERENCES observations(observation_id),
    later_obs_id BIGINT REFERENCES observations(observation_id),
    comparison_title VARCHAR(200) NOT NULL,
    area_change_km2 DOUBLE PRECISION NOT NULL,
    area_change_ha DOUBLE PRECISION NOT NULL,
    percentage_change DOUBLE PRECISION NOT NULL,
    trend VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_obs_acq ON observations(acquisition_datetime);
CREATE INDEX IF NOT EXISTS idx_obs_region ON observations(region_id);
CREATE INDEX IF NOT EXISTS idx_measurements_obs ON lake_area_measurements(observation_id);
