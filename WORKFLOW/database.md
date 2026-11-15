# Database Structure
## South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform

## 1. Purpose

This document defines the proposed database structure for the application. It describes entities, fields, relationships, keys, and constraints only.

**No satellite imagery, InSAR files, training datasets, measured lake areas, coordinates, observation records, model outputs, or other project data are included in this document.** Actual datasets and files will be stored separately. The database will store their metadata and references where required.

The schema is designed to support the initial South Lhonak study area and future expansion to additional glacial lakes or study regions.

## 2. Database Technology

- Database: PostgreSQL
- Spatial extension: PostGIS
- Primary use: Store application metadata, observation metadata, spatial vector geometries, processing history, model metadata, and references to files stored outside the database.

Large raster files and model artefacts should remain in file or object storage. The database should store their paths or storage keys, not the file contents.

## 3. Main Database Entities

The proposed database contains the following entity groups:

1. Region management
2. Satellite observation catalogue
3. Raster and other file references
4. Lake boundary and area measurement records
5. InSAR metadata
6. Processing jobs and processing outputs
7. Training dataset and model registry
8. Risk assessment records
9. Date comparison records
10. Data provenance and validation records

## 4. Table Definitions

The field names and data types below are proposed logical definitions. They can be adjusted during implementation after the actual data formats and processing workflow are confirmed.

### 4.1 `regions`

Stores the metadata for each monitored glacier or study region.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `region_id` | BIGSERIAL | Primary key | Unique region identifier |
| `region_name` | VARCHAR(150) | NOT NULL | Display name of the region |
| `region_code` | VARCHAR(50) | UNIQUE | Short internal region code |
| `description` | TEXT | NULL allowed | General region description |
| `boundary_geom` | GEOMETRY(MULTIPOLYGON, 4326) | NULL allowed | Optional study-region boundary |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update time |

### 4.2 `satellite_missions`

Stores the catalogue of satellite missions and sensors used by the platform.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `mission_id` | BIGSERIAL | Primary key | Unique mission identifier |
| `mission_name` | VARCHAR(100) | NOT NULL | Mission name |
| `sensor_name` | VARCHAR(100) | NULL allowed | Sensor name |
| `provider` | VARCHAR(150) | NULL allowed | Mission or data provider |
| `description` | TEXT | NULL allowed | Mission and sensor notes |

### 4.3 `observations`

Stores metadata for each satellite observation associated with a region.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `observation_id` | BIGSERIAL | Primary key | Unique observation identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Associated study region |
| `mission_id` | BIGINT | Foreign key → `satellite_missions.mission_id` | Satellite mission |
| `acquisition_datetime` | TIMESTAMPTZ | NOT NULL | Observation acquisition time |
| `product_identifier` | VARCHAR(200) | NULL allowed | Original product identifier |
| `product_type` | VARCHAR(100) | NULL allowed | Product type |
| `orbit_direction` | VARCHAR(30) | NULL allowed | Orbit direction, if applicable |
| `relative_orbit` | INTEGER | NULL allowed | Relative orbit number, if applicable |
| `polarizations` | JSONB | NULL allowed | Available polarization metadata |
| `processing_status` | VARCHAR(40) | NOT NULL | Current processing state |
| `metadata_reference` | TEXT | NULL allowed | Reference to a metadata file, if stored externally |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |

Suggested constraint: `processing_status` should use a controlled set of values such as `registered`, `queued`, `processing`, `completed`, `failed`, or `not_processed`.

### 4.4 `data_assets`

Stores references and descriptive metadata for files held outside the database. This table does not store the actual files.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `asset_id` | BIGSERIAL | Primary key | Unique asset identifier |
| `observation_id` | BIGINT | Foreign key → `observations.observation_id`, nullable | Related observation, if applicable |
| `region_id` | BIGINT | Foreign key → `regions.region_id`, nullable | Related region, if applicable |
| `asset_category` | VARCHAR(60) | NOT NULL | Category of referenced file |
| `file_name` | VARCHAR(255) | NULL allowed | Original or display file name |
| `storage_uri` | TEXT | NOT NULL | File path or object-storage key |
| `file_format` | VARCHAR(40) | NULL allowed | File format |
| `file_size_bytes` | BIGINT | NULL allowed | File size |
| `checksum` | VARCHAR(128) | NULL allowed | Optional integrity checksum |
| `crs` | VARCHAR(100) | NULL allowed | Coordinate reference system |
| `band_metadata` | JSONB | NULL allowed | Band descriptions and metadata |
| `nodata_value` | DOUBLE PRECISION | NULL allowed | NoData value, if applicable |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |

Possible `asset_category` values include `raw_satellite`, `processed_raster`, `insar`, `dem`, `training_feature`, `training_label`, `model_artifact`, `vector_output`, and `supporting_document`. These are category labels only, not actual data.

### 4.5 `lake_boundaries`

Stores vector boundary records produced or imported by the processing workflow.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `boundary_id` | BIGSERIAL | Primary key | Unique boundary identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Associated region |
| `observation_id` | BIGINT | Foreign key → `observations.observation_id` | Observation used |
| `boundary_geom` | GEOMETRY(MULTIPOLYGON, 4326) | NOT NULL | Georeferenced lake boundary |
| `method_name` | VARCHAR(120) | NULL allowed | Boundary extraction method |
| `method_version` | VARCHAR(60) | NULL allowed | Algorithm or workflow version |
| `quality_status` | VARCHAR(40) | NULL allowed | Boundary validation status |
| `source_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Referenced source or output asset |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |

A boundary record should retain its observation and processing provenance. Multiple boundary versions may be stored for the same observation when needed.

### 4.6 `lake_area_measurements`

Stores area measurements associated with a lake boundary and observation.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `measurement_id` | BIGSERIAL | Primary key | Unique measurement identifier |
| `boundary_id` | BIGINT | Foreign key → `lake_boundaries.boundary_id` | Boundary used for measurement |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Associated region |
| `observation_id` | BIGINT | Foreign key → `observations.observation_id` | Associated observation |
| `area_value` | DOUBLE PRECISION | NOT NULL | Calculated area value |
| `area_unit` | VARCHAR(20) | NOT NULL | Unit used for area |
| `calculation_method` | VARCHAR(120) | NULL allowed | Area calculation method |
| `uncertainty_value` | DOUBLE PRECISION | NULL allowed | Optional measurement uncertainty |
| `quality_status` | VARCHAR(40) | NULL allowed | Measurement validation status |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |

The database stores the result and its method metadata. It does not contain pre-filled measurements.

### 4.7 `insar_observations`

Stores metadata for InSAR-related inputs and derived products. The exact fields required may be refined after the available InSAR files and formats are inspected.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `insar_id` | BIGSERIAL | Primary key | Unique InSAR record identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Associated region |
| `asset_id` | BIGINT | Foreign key → `data_assets.asset_id` | Reference to the externally stored InSAR file |
| `product_category` | VARCHAR(80) | NULL allowed | Raw input or derived product category |
| `acquisition_start` | TIMESTAMPTZ | NULL allowed | Start acquisition time, if applicable |
| `acquisition_end` | TIMESTAMPTZ | NULL allowed | End acquisition time, if applicable |
| `processing_method` | VARCHAR(120) | NULL allowed | Processing method |
| `processing_version` | VARCHAR(60) | NULL allowed | Processing workflow version |
| `metadata` | JSONB | NULL allowed | Additional product-specific metadata |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation time |

This table is intentionally flexible. Do not finalize product-specific fields until the actual InSAR product types are known.

### 4.8 `processing_jobs`

Tracks processing tasks performed by the backend or geospatial processing engine.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `job_id` | BIGSERIAL | Primary key | Unique processing job identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Related region |
| `observation_id` | BIGINT | Foreign key → `observations.observation_id`, nullable | Related observation |
| `job_type` | VARCHAR(100) | NOT NULL | Processing operation |
| `status` | VARCHAR(40) | NOT NULL | Job state |
| `parameters` | JSONB | NULL allowed | Processing configuration |
| `software_name` | VARCHAR(100) | NULL allowed | Software or tool used |
| `software_version` | VARCHAR(60) | NULL allowed | Software version |
| `started_at` | TIMESTAMPTZ | NULL allowed | Job start time |
| `completed_at` | TIMESTAMPTZ | NULL allowed | Job completion time |
| `error_message` | TEXT | NULL allowed | Failure details, if any |
| `created_at` | TIMESTAMPTZ | NOT NULL | Job creation time |

Suggested job states: `queued`, `running`, `completed`, `failed`, and `cancelled`.

### 4.9 `training_datasets`

Stores metadata and file references for datasets used in model development. Training files remain outside the database.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `dataset_id` | BIGSERIAL | Primary key | Unique dataset identifier |
| `dataset_name` | VARCHAR(150) | NOT NULL | Dataset name |
| `dataset_version` | VARCHAR(60) | NOT NULL | Dataset version |
| `description` | TEXT | NULL allowed | Dataset purpose and notes |
| `feature_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Reference to feature files |
| `label_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Reference to label files |
| `manifest_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Reference to dataset manifest |
| `preparation_method` | VARCHAR(150) | NULL allowed | Dataset preparation workflow |
| `split_definition` | JSONB | NULL allowed | Train, validation, and test split metadata |
| `created_at` | TIMESTAMPTZ | NOT NULL | Dataset registration time |

The schema does not assume that labels, features, or train/test splits already exist.

### 4.10 `ml_models`

Stores model registry information, not model weights.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `model_id` | BIGSERIAL | Primary key | Unique model identifier |
| `model_name` | VARCHAR(150) | NOT NULL | Model name |
| `model_version` | VARCHAR(60) | NOT NULL | Model version |
| `model_type` | VARCHAR(100) | NULL allowed | Model or algorithm category |
| `dataset_id` | BIGINT | Foreign key → `training_datasets.dataset_id`, nullable | Dataset used |
| `artifact_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | External model artifact reference |
| `configuration` | JSONB | NULL allowed | Model configuration metadata |
| `evaluation_metrics` | JSONB | NULL allowed | Evaluation metric metadata |
| `training_status` | VARCHAR(40) | NULL allowed | Training lifecycle state |
| `created_at` | TIMESTAMPTZ | NOT NULL | Model registration time |

### 4.11 `risk_assessments`

Stores outputs of a documented susceptibility or risk-assessment workflow. It must distinguish preliminary indicators from validated model outputs and official hazard information.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `assessment_id` | BIGSERIAL | Primary key | Unique assessment identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Assessed region |
| `observation_id` | BIGINT | Foreign key → `observations.observation_id`, nullable | Related observation |
| `model_id` | BIGINT | Foreign key → `ml_models.model_id`, nullable | Model used, if applicable |
| `assessment_type` | VARCHAR(100) | NOT NULL | Assessment category |
| `assessment_status` | VARCHAR(50) | NOT NULL | Preliminary, validated, or other status |
| `result_reference_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Reference to external result layer or report |
| `indicators` | JSONB | NULL allowed | Indicator names and associated metadata |
| `methodology_reference` | TEXT | NULL allowed | Method or documentation reference |
| `limitations` | TEXT | NULL allowed | Known limitations |
| `created_at` | TIMESTAMPTZ | NOT NULL | Assessment creation time |

Do not use this table to imply that a preliminary susceptibility indicator is an official warning, a validated inundation forecast, or an evacuation instruction.

### 4.12 `observation_comparisons`

Stores metadata for comparisons between two observations.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `comparison_id` | BIGSERIAL | Primary key | Unique comparison identifier |
| `region_id` | BIGINT | Foreign key → `regions.region_id` | Compared region |
| `observation_a_id` | BIGINT | Foreign key → `observations.observation_id` | First observation |
| `observation_b_id` | BIGINT | Foreign key → `observations.observation_id` | Second observation |
| `comparison_method` | VARCHAR(120) | NULL allowed | Comparison method |
| `result_asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Reference to comparison output |
| `summary_metadata` | JSONB | NULL allowed | Summary statistics metadata |
| `created_at` | TIMESTAMPTZ | NOT NULL | Comparison creation time |

Constraint: `observation_a_id` and `observation_b_id` must not refer to the same observation.

### 4.13 `validation_records`

Stores quality checks and review information for data products and derived outputs.

| Field | Suggested type | Key / constraint | Description |
|---|---|---|---|
| `validation_id` | BIGSERIAL | Primary key | Unique validation identifier |
| `asset_id` | BIGINT | Foreign key → `data_assets.asset_id`, nullable | Related asset |
| `boundary_id` | BIGINT | Foreign key → `lake_boundaries.boundary_id`, nullable | Related boundary |
| `measurement_id` | BIGINT | Foreign key → `lake_area_measurements.measurement_id`, nullable | Related measurement |
| `validation_type` | VARCHAR(100) | NOT NULL | Type of validation |
| `validation_status` | VARCHAR(40) | NOT NULL | Validation outcome |
| `method_description` | TEXT | NULL allowed | Validation method |
| `review_notes` | TEXT | NULL allowed | Review notes |
| `validated_at` | TIMESTAMPTZ | NULL allowed | Validation time |

A validation record should identify the exact item being checked. The implementation should enforce that at least one target reference is supplied.

## 5. Entity Relationships

The main relationships are:

- One region can have many observations.
- One satellite mission can be associated with many observations.
- One observation can reference many data assets.
- One region can have many data assets.
- One observation can have multiple lake boundary versions.
- One lake boundary can have one or more area measurement records.
- One region can have many InSAR metadata records.
- One data asset can be referenced by an InSAR metadata record.
- One observation or region can have many processing jobs.
- One training dataset can be associated with multiple model versions over time.
- One model can be referenced by multiple risk assessments.
- One comparison links two distinct observations.
- Validation records can refer to assets, boundaries, or measurements.

## 6. Relationship Overview

```text
regions
  ├── observations
  │     ├── data_assets
  │     ├── lake_boundaries
  │     │      └── lake_area_measurements
  │     ├── processing_jobs
  │     └── observation_comparisons
  ├── data_assets
  ├── insar_observations
  ├── training_datasets
  │     └── ml_models
  │             └── risk_assessments
  └── risk_assessments

satellite_missions
  └── observations

data_assets
  ├── insar_observations
  ├── training_datasets
  ├── ml_models
  ├── risk_assessments
  ├── observation_comparisons
  └── validation_records
```

## 7. Data Storage Rules

1. Store large satellite rasters, InSAR products, DEM files, training files, and model weights outside PostgreSQL.
2. Store only metadata and a stable file reference in `data_assets`.
3. Use PostGIS geometry columns for vector boundaries and study-region geometries where spatial database operations are required.
4. Use GeoTIFF or Cloud Optimized GeoTIFF files for raster products where appropriate; the database stores their references and metadata.
5. Keep original source files unchanged. Store processed outputs as separate assets.
6. Record processing method, software version, parameters, and source references for reproducibility.
7. Do not store credentials, access tokens, or private storage secrets in database records.
8. Use database migrations to manage schema changes.
9. Add indexes to foreign keys and frequently queried fields.
10. Add spatial indexes to PostGIS geometry columns.

## 8. Recommended Indexes

- `observations(region_id, acquisition_datetime)`
- `observations(mission_id)`
- `data_assets(observation_id)`
- `data_assets(region_id)`
- `data_assets(asset_category)`
- `lake_boundaries(region_id, observation_id)`
- `lake_area_measurements(region_id, observation_id)`
- `insar_observations(region_id)`
- `processing_jobs(status, created_at)`
- `risk_assessments(region_id, created_at)`
- `observation_comparisons(region_id)`
- GiST index on `regions.boundary_geom`
- GiST index on `lake_boundaries.boundary_geom`

## 9. Data Integrity and Design Rules

- Use primary keys for all main tables.
- Use foreign keys to maintain relationships between records.
- Use `NOT NULL` only for fields required for a valid record.
- Use controlled values or lookup tables for statuses and categories.
- Store timestamps with time-zone awareness.
- Store spatial geometries with an explicitly defined coordinate reference system.
- Keep source observation identifiers and file references for traceability.
- Avoid overwriting historical processing outputs. Create new versions or records.
- Record units for all numeric measurements.
- Do not mix preliminary susceptibility outputs with official hazard or warning information.
- Do not treat missing values as zero.
- Apply uniqueness constraints to version identifiers where appropriate, such as `(model_name, model_version)` and `(dataset_name, dataset_version)`.

## 10. Items to Confirm Before Final Database Implementation

The following decisions depend on inspection of the actual files and final processing design:

- Exact metadata fields available in the Sentinel-1 products.
- Exact InSAR product types and metadata fields.
- Whether InSAR inputs are raw scenes, processed products, or a mixture.
- Raster storage location and storage URI format.
- Required spatial reference systems.
- Lake-boundary versioning requirements.
- Area measurement units and uncertainty approach.
- Training dataset structure, feature definitions, labels, and split strategy.
- Model registry and evaluation metrics required by the selected ML approach.
- Whether downstream hazard layers will be preliminary terrain screening, validated model outputs, official hazard maps, or a combination.

These items should be finalized only after the source files and intended analysis workflow are reviewed.

## 11. Scope Reminder

This document defines the **database structure only**. It does not contain or generate the project's actual satellite data, InSAR imagery, training data, labels, lake measurements, model weights, risk scores, or hazard maps. Those remain separate project assets and will be registered in the database through metadata and file references.
