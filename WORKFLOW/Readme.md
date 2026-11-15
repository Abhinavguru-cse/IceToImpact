SOUTH LHONAK GLACIAL LAKE MONITORING AND GLOF SUSCEPTIBILITY ASSESSMENT PLATFORM
PROJECT README AND DEVELOPMENT GUIDE
File: README.txt
Version: 1.0
Status: Initial project guide


1. PROJECT OVERVIEW

The South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform is a satellite-based geospatial monitoring application focused initially on South Lhonak Lake in North Sikkim, India.

The platform is designed to transform satellite observations into understandable geospatial information. Users should be able to select a glacier region, select an available satellite observation date, view the actual processed radar image, inspect the lake boundary, review calculated lake area, compare observations and explore relevant GLOF susceptibility factors.

The initial historical analysis focuses on two Sentinel-1 observations:
- 28 September 2023: intended pre-GLOF observation.
- 10 October 2023: intended post-GLOF observation.

These dates and their intended roles must be confirmed against the actual product metadata and event timeline. The products must be checked for coverage, acquisition geometry, orbit, polarization, processing level and data quality before quantitative comparison.

The platform is a research and monitoring tool. It is not an official early-warning system, a certified flood forecast system or a replacement for instructions from disaster-management authorities.


2. PROJECT VISION

Build a simple, reliable, map-first application that makes satellite-based glacial lake monitoring accessible.

The main user workflow is:

SELECT A GLACIER / REGION
        |
        v
SELECT AN AVAILABLE OBSERVATION DATE
        |
        v
VIEW THE ACTUAL PROCESSED RADAR IMAGE
        |
        v
INSPECT THE LAKE BOUNDARY AND AREA
        |
        v
VIEW LAKE AREA GRAPHS
        |
        v
SELECT TWO DATES FOR COMPARISON
        |
        v
VIEW RADAR DIFFERENCES AND AREA CHANGE
        |
        v
REVIEW GLOF SUSCEPTIBILITY FACTORS
        |
        v
VIEW AVAILABLE HAZARD / EXPOSURE INFORMATION
        |
        v
READ GENERAL SAFETY PRECAUTIONS

The dashboard should remain simple. The most important controls are region selection and observation-date selection. The radar map should be the primary visual element. Graphs, risk factors, hazard information and safety guidance should be organized below the main monitoring view or in clearly separated sections.


3. MAIN FEATURES

3.1 Region Selection
- Allow users to select a configured glacier or study region.
- Initial region: South Lhonak Lake, North Sikkim, India.
- Design the data model so more glacier regions can be added later.
- Only show regions that have been configured in the system.

3.2 Observation Date Selection
- Populate the date selector from registered satellite observations.
- Display the actual acquisition date from product metadata.
- Show satellite mission, sensor and processing status where useful.
- Never invent dates or use upload dates as acquisition dates.

3.3 Radar Image Viewer
- Display actual processed and georeferenced satellite radar imagery.
- Support VV and VH polarization when available in the selected product.
- Allow the user to show or hide the lake boundary.
- Provide zoom, pan, scale and layer controls.
- Show acquisition date and data status.
- Display a clear message if an image has not been processed or is unavailable.

3.4 Lake Boundary and Area
- Detect candidate lake water pixels using a documented method.
- Generate a georeferenced lake boundary polygon.
- Allow visual validation or correction where required.
- Calculate area using an appropriate geospatial method.
- Store area in square metres, hectares and square kilometres.
- Preserve the source observation, method, parameters and validation status.

3.5 Date Comparison
- Allow users to select an earlier and a later observation.
- Display radar images side by side or with a swipe comparison.
- Display both lake boundaries.
- Calculate absolute and percentage area change only when observations are compatible.
- Provide a difference map when supported by the processing workflow.
- Explain when comparison is unreliable or unavailable.

3.6 Historical Graphs
- Plot measured lake area against actual acquisition dates.
- Show data points and units.
- Display exact values when a user selects a point.
- Preserve gaps where observations are unavailable.
- Do not fabricate or interpolate measurements to make the graph look continuous.

3.7 GLOF Susceptibility Factors
Potential factors include:
- Lake area and area-change history.
- Lake position and glacier proximity.
- Surrounding slope and elevation.
- Potential avalanche, landslide or rockfall source areas.
- Moraine-dam characteristics, where reliable data exists.
- Drainage and outlet characteristics.
- Downstream settlements and infrastructure exposure.

Each factor must show its source, date, availability and confidence or validation status. Lake expansion alone is not proof of an imminent GLOF.

3.8 Hazard / Danger-Zone Information
The application may display:
- Official or published hazard zones from authoritative sources.
- Modeled flood-inundation zones from documented and validated modeling.
- Preliminary terrain-screening corridors.
- Downstream settlements and infrastructure.

These categories must be visually and textually distinct. Do not draw arbitrary buffers around the lake and label them danger zones. If no authoritative hazard map or validated inundation model is available, state that no validated danger-zone boundary is available.

3.9 Safety Information
Provide general preparedness information, including:
- Follow official instructions and advisories.
- Know locally designated safe areas and evacuation routes.
- Avoid restricted areas, unstable moraine dams, steep slopes and river channels during an alert.
- Keep emergency contacts and basic supplies available.
- Follow evacuation directions from local authorities.
- Do not use this platform as an emergency alert service.

The application must not invent evacuation routes, safe zones or emergency orders.


4. DATASETS AND DATA SOURCES

4.1 Initial Satellite Data

The first analysis uses the two downloaded Sentinel-1 ZIP products:
- 28 September 2023.
- 10 October 2023.

The project requirements describe these as Sentinel-1 GRD-HD dual-polarization products with VV and VH. Verify this against the actual downloaded metadata. Do not assume product details without inspection.

4.2 Supporting Data

Potential supporting datasets include:
- Digital Elevation Models (DEM).
- Sentinel-2 optical imagery.
- Landsat imagery.
- Glacier and ice information.
- Moraine and natural-dam information.
- Drainage and hydrological datasets.
- Precipitation and temperature datasets, where appropriate.
- Downstream settlement and infrastructure data.
- Other elevation observations where suitable.

Only integrate supporting data when its source, spatial coverage, date, resolution and limitations are understood.

4.3 Potential Data Providers
- Alaska Satellite Facility (ASF).
- NASA Earthdata.
- Copernicus Data Space.
- ISRO and other authoritative geospatial data providers.
- Other recognized scientific or government sources.

4.4 NISAR Limitation

NISAR launched in 2025 and cannot provide observations from September or October 2023. Use suitable historical missions such as Sentinel-1 for the 2023 event comparison. NISAR may be integrated for observations during its operational data period, subject to data availability and suitability.


5. RECOMMENDED TECHNOLOGY STACK

The following is the proposed technology direction. Confirm exact versions and dependencies during implementation and record them in the project.

Frontend:
- React
- TypeScript
- Vite
- Leaflet or MapLibre GL JS
- Recharts or Plotly
- CSS or a lightweight component library

Backend:
- Python
- FastAPI
- Pydantic
- SQLAlchemy

Satellite and geospatial processing:
- Python
- ESA SNAP / Sentinel Application Platform
- GDAL
- Rasterio
- GeoPandas
- Shapely
- NumPy
- SciPy where required

Database:
- PostgreSQL
- PostGIS extension

Raster and file delivery:
- GeoTIFF or Cloud Optimized GeoTIFF where appropriate.
- A raster tile service such as TiTiler or another suitable GDAL-based service.
- GeoJSON or vector tiles for lake boundaries.

Development and deployment:
- Git and GitHub.
- Python virtual environment.
- Node.js and npm.
- Docker may be introduced when deployment or environment consistency requires it.

Do not add technologies merely because they are listed here. Keep the first implementation as small as possible while meeting the requirements.


6. SYSTEM ARCHITECTURE AT A GLANCE

The platform is divided into these components:

1. Frontend
   Displays region/date selectors, radar imagery, boundaries, graphs, comparison, risk factors and safety information.

2. Backend API
   Provides data to the frontend, validates requests, manages observation metadata and coordinates processing jobs.

3. Processing engine
   Inspects satellite products, preprocesses SAR imagery, extracts lake boundaries, calculates area and creates comparison outputs.

4. Geospatial database
   Stores regions, observation metadata, processing records, vector geometries, measurements and comparison metadata.

5. File storage
   Stores original satellite archives, processed raster files, derived outputs and logs.

SYSTEM FLOW

Browser
  |
  v
React + TypeScript
  |
  | HTTPS / JSON API
  v
FastAPI backend
  |
  +----------------------------+
  |                            |
  v                            v
PostgreSQL + PostGIS       Processing job manager
  |                            |
  |                            v
  |                       Python processing engine
  |                            |
  |                       Sentinel-1 products
  |                       ESA SNAP / GDAL
  |                       Rasterio / GeoPandas
  |                       Lake detection and area
  |                       Change analysis
  |                            |
  +<---------------------------+
  |
  v
Metadata and geospatial outputs
  |
  v
Map layers, statistics and graphs in frontend

Large raster files should be stored in file or object storage, not as database blobs. The database should store metadata and references to those files.


7. RECOMMENDED PROJECT STRUCTURE

Suggested structure:

south-lhonak-monitoring/
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- maps/
|   |   |-- charts/
|   |   |-- types/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |-- package.json
|   |-- vite.config.ts
|
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- services/
|   |   |-- database/
|   |   |-- config/
|   |   |-- main.py
|   |-- requirements.txt
|
|-- processing/
|   |-- ingestion/
|   |-- metadata/
|   |-- preprocessing/
|   |-- water_detection/
|   |-- area_calculation/
|   |-- change_detection/
|   |-- quality_control/
|   |-- scripts/
|
|-- data/
|   |-- raw/
|   |-- processed/
|   |-- comparisons/
|   |-- supporting/
|   |-- logs/
|
|-- database/
|   |-- migrations/
|   |-- schema/
|
|-- docs/
|   |-- PRD.md
|   |-- architecture.md
|   |-- design.md
|   |-- README.md
|
|-- .env.example
|-- .gitignore
|-- README.md

The structure may be adjusted if implementation needs require it. Keep frontend, backend, processing, database and data storage responsibilities separate.

Do not commit large satellite ZIP files, raw rasters or generated processing outputs to Git. Add data directories and secret files to .gitignore. Keep documentation, source code and safe configuration examples under version control.


8. DATA ORGANIZATION

Keep the original source products unchanged.

Suggested data directory:

data/
    raw/
        sentinel1/
            2023-09-28/
            2023-10-10/

    processed/
        sentinel1/
            2023-09-28/
                vv/
                vh/
                boundary/
                metadata/
            2023-10-10/
                vv/
                vh/
                boundary/
                metadata/

    comparisons/
        2023-09-28_to_2023-10-10/
            difference/
            maps/
            statistics/

    supporting/
        dem/
        glacier/
        drainage/
        exposure/

    logs/

Use configurable storage paths. Do not hard-code a developer's personal computer path into application code. Preserve checksums and source metadata so original input files can be verified.


9. DATABASE OVERVIEW

Use PostgreSQL with PostGIS for geospatial records.

Suggested logical entities:

REGIONS
- id
- name
- description
- country
- region_geometry
- is_active
- created_at

OBSERVATIONS
- id
- region_id
- satellite
- sensor
- product_identifier
- acquisition_datetime
- orbit_direction
- relative_orbit
- acquisition_mode
- polarization
- product_type
- source_provider
- source_file_path
- processing_status
- quality_status
- created_at

PROCESSING_JOBS
- id
- observation_id
- job_type
- status
- started_at
- completed_at
- software_version
- parameters
- log_path
- error_message

LAKE_BOUNDARIES
- id
- observation_id
- geometry
- extraction_method
- extraction_parameters
- validation_status
- quality_notes
- created_at

LAKE_AREA_MEASUREMENTS
- id
- observation_id
- area_square_metres
- area_hectares
- area_square_kilometres
- calculation_method
- created_at

COMPARISONS
- id
- region_id
- earlier_observation_id
- later_observation_id
- compatibility_status
- earlier_area
- later_area
- area_difference
- percentage_change
- output_path
- created_at

These are logical entities. Implement appropriate types, foreign keys, constraints, indexes and migrations. Actual identifiers should be generated by the application, not copied from examples.


10. SATELLITE PROCESSING WORKFLOW

The initial processing workflow should be developed and validated before building advanced dashboard features.

STEP 1: Register and inspect products
- Identify the product and measurement files.
- Read metadata.
- Verify acquisition date and time.
- Verify product type and processing level.
- Verify VV and VH availability.
- Record acquisition mode, orbit direction and relative orbit.
- Check spatial coverage of South Lhonak Lake.

STEP 2: Check comparison compatibility
- Compare acquisition geometry.
- Compare orbit direction and relative orbit.
- Check product mode and polarization.
- Check coverage and data quality.
- Determine whether quantitative comparison is scientifically reasonable.

STEP 3: Preprocess SAR data
A proposed workflow, to be confirmed for the actual product:
- Apply orbit information where appropriate.
- Apply relevant border-noise and thermal-noise corrections where appropriate.
- Perform radiometric calibration.
- Apply speckle filtering only when justified.
- Perform terrain correction using a suitable DEM.
- Reproject to a consistent coordinate reference system.
- Clip or mask the study area.
- Produce analysis-ready VV and VH outputs.

Use ESA SNAP and suitable GDAL/Rasterio tools. Confirm the correct operator sequence for the actual Sentinel-1 product. Avoid applying processing steps twice if already performed.

STEP 4: Extract lake boundary
- Identify candidate water pixels using documented VV/VH methods.
- Apply suitable spatial and terrain constraints.
- Remove obvious isolated classification noise only where justified.
- Generate a georeferenced polygon.
- Visually validate the boundary.
- Store method, parameters and validation status.

STEP 5: Calculate lake area
- Use the georeferenced polygon.
- Use a suitable projected coordinate reference system or geodesic area method.
- Store area in square metres, hectares and square kilometres.
- Preserve the calculation method and source boundary.

STEP 6: Compare observations
- Align compatible rasters to a common grid.
- Use consistent projection and study-area mask.
- Compare validated lake boundaries.
- Calculate area difference.
- Generate a difference layer if supported.
- Record compatibility and quality status.

Area calculations:

Absolute area difference = Later area - Earlier area

Percentage area change =
((Later area - Earlier area) / Earlier area) * 100

If the earlier area is zero or invalid, percentage change must be unavailable. Do not report a misleading value.

STEP 7: Publish outputs
- Save processed rasters.
- Save boundary polygons.
- Save area statistics.
- Save processing metadata and logs.
- Register outputs in the database.
- Make only successfully processed and appropriately validated results available to the dashboard.


11. DATA QUALITY AND SCIENTIFIC VALIDATION

South Lhonak is a high-mountain environment. SAR interpretation can be affected by radar shadow, layover, foreshortening, snow, ice, terrain slope, incidence angle, speckle and geometric misalignment.

Before publishing results:
- Verify product metadata.
- Verify spatial coverage.
- Check raster projection and georeferencing.
- Inspect radar geometry and terrain effects.
- Check boundary plausibility.
- Review classification errors.
- Verify area calculation.
- Record limitations and confidence.

Two observations must not be treated as directly comparable simply because their acquisition dates are close. If compatibility checks fail, allow users to view the individual images but flag or prevent quantitative comparison.

Every measurement must be traceable to its source product, processing workflow, parameters and boundary geometry.


12. BACKEND API OVERVIEW

Use a versioned API prefix such as /api/v1.

Suggested endpoints:

REGIONS
GET /api/v1/regions
GET /api/v1/regions/{region_id}

OBSERVATIONS
GET /api/v1/regions/{region_id}/observations
GET /api/v1/observations/{observation_id}
GET /api/v1/observations/{observation_id}/layers
GET /api/v1/observations/{observation_id}/boundary
GET /api/v1/observations/{observation_id}/statistics

COMPARISON
POST /api/v1/comparisons
GET /api/v1/comparisons/{comparison_id}

HISTORICAL ANALYSIS
GET /api/v1/regions/{region_id}/area-history

PROCESSING
POST /api/v1/processing-jobs
GET /api/v1/processing-jobs/{job_id}
GET /api/v1/processing-jobs/{job_id}/logs

HEALTH
GET /api/v1/health

The backend must validate all requested region and observation identifiers. Do not accept arbitrary server file paths from frontend requests. Return clear error messages and data-status information.


13. PROCESSING JOB MANAGEMENT

SAR processing may take a long time. Do not run heavy raster processing inside a normal API request.

Initial job flow:
1. Register the product.
2. Validate metadata.
3. Create a processing job.
4. Run the processing workflow in a background process.
5. Record progress and logs.
6. Save outputs.
7. Validate outputs.
8. Update database records.
9. Make the observation available when complete.

Suggested states:
- queued
- validating
- processing
- quality_check
- completed
- failed

A simple background runner may be enough for the first prototype. A dedicated queue such as Celery with Redis can be added if workload requires it.


14. RASTER AND MAP DELIVERY

Large raster images should not normally be downloaded in full by the browser.

Recommended approach:
- Preserve analysis rasters as GeoTIFF or Cloud Optimized GeoTIFF where suitable.
- Generate display tiles or use a raster tile service.
- Serve vector lake boundaries as GeoJSON or vector tiles.
- Return layer metadata and URLs through the backend.
- Load map layers only when needed.

Possible raster-serving technology: TiTiler or another appropriate GDAL-based tile service.

The radar map must show the actual processed satellite observation. A basemap may provide geographic context but must never be confused with the satellite image.


15. GLOF RISK, HAZARD AND SAFETY MODULES

Build these modules after the initial satellite monitoring workflow works.

Risk-factor information may include:
- Lake area and expansion history.
- Moraine-dam characteristics.
- Surrounding slope and elevation.
- Glacier proximity.
- Potential avalanche and landslide sources.
- Drainage and outlet characteristics.
- Downstream settlements and infrastructure exposure.

For every factor, show:
- Indicator.
- Result or status.
- Source and date.
- Availability.
- Validation or confidence note.

Do not create a single numerical risk score unless a documented, scientifically justified and validated method is available.

Hazard-zone information must distinguish:
1. Official or published hazard zones.
2. Validated modeled inundation zones.
3. Preliminary terrain-screening corridors.
4. Downstream exposure locations.

Never label an arbitrary buffer or unvalidated terrain route as a confirmed danger zone.

Safety information should be general preparedness guidance. It must direct users to follow local authorities and official disaster-management instructions. Do not generate evacuation routes or issue emergency alerts from preliminary analysis.


16. DEVELOPMENT ENVIRONMENT SETUP

The following is a general local development setup. Exact commands and versions may differ depending on the operating system.

Prerequisites:
- Git.
- Python 3.
- Node.js and npm.
- PostgreSQL with PostGIS.
- ESA SNAP installed and configured for the processing environment.
- Sufficient storage for the original satellite products and processed rasters.

A. Clone or open the project

Create or open the project directory:

south-lhonak-monitoring/

B. Frontend setup

From the frontend directory:

npm install
npm run dev

Use the development URL printed by Vite.

C. Backend setup

From the backend directory, create a virtual environment:

python -m venv .venv

Activate it using the command appropriate for the operating system.

Install dependencies:

pip install -r requirements.txt

Start the API during development:

uvicorn app.main:app --reload

The API documentation is normally available at:

http://127.0.0.1:8000/docs

D. Database setup

- Install PostgreSQL.
- Install and enable PostGIS.
- Create a project database.
- Configure the connection string through environment variables.
- Run database migrations.
- Confirm that the backend can connect.

E. Environment configuration

Create a local .env file based on .env.example.

Possible configuration values:
- DATABASE_URL
- DATA_ROOT
- SNAP_EXECUTABLE_PATH
- RASTER_TILE_SERVICE_URL
- API_BASE_URL

Use placeholder examples in .env.example. Never commit real passwords, access tokens or secrets.


17. GOOGLE DRIVE AND COLAB DATA WORKFLOW

The two original satellite ZIP files may be stored in Google Drive while initial processing experiments are performed in Google Colab.

Suggested Drive folder:

South_Lhonak_GLOF_Project/
    sentinel1_2023_09_28.zip
    sentinel1_2023_10_10.zip

In Colab, mount Drive:

from google.colab import drive
drive.mount('/content/drive')

List the files:

import os

folder = "/content/drive/MyDrive/South_Lhonak_GLOF_Project"

for file in os.listdir(folder):
    print(file)

Verify filenames and sizes before extraction. Do not assume the filenames shown above are the actual downloaded filenames.

Important:
- Preserve the original ZIP files.
- Do not extract both products into the same directory if their internal names may conflict.
- Check available disk space before extraction.
- Do not load entire large scenes into RAM without considering memory limits.
- Keep a record of processing steps and outputs.
- Colab sessions are temporary. Copy important outputs and notebooks to persistent storage.
- For large or repeated processing, use a suitable local or cloud environment with sufficient storage and memory.

The actual extraction and processing commands must be selected after inspecting the downloaded product structure and metadata.


18. RECOMMENDED DEVELOPMENT ROADMAP

PHASE 1: DOCUMENTATION AND PROJECT FOUNDATION
- Keep PRD, architecture and design documents in the repository.
- Create the frontend and backend skeletons.
- Configure the database.
- Configure local data storage.
- Add a health-check endpoint.
- Confirm frontend-to-backend communication.

PHASE 2: SATELLITE PRODUCT INSPECTION
- Locate both downloaded ZIP files.
- Inspect their internal structure.
- Read product metadata.
- Verify acquisition dates and coverage.
- Verify VV and VH availability.
- Check orbit and acquisition geometry.
- Record compatibility findings.

PHASE 3: SAR PREPROCESSING
- Configure SNAP and processing dependencies.
- Build the preprocessing workflow.
- Generate georeferenced radar outputs.
- Inspect terrain-related artifacts.
- Confirm output projection and coverage.

PHASE 4: LAKE DETECTION
- Implement candidate water detection.
- Generate a lake polygon.
- Review it visually.
- Record extraction settings.
- Calculate area.
- Store results and quality information.

PHASE 5: CHANGE ANALYSIS
- Validate observation compatibility.
- Align compatible rasters.
- Compare boundaries.
- Calculate area difference and percentage change.
- Generate difference outputs.
- Record limitations.

PHASE 6: BASIC DASHBOARD
- Implement region selection.
- Implement observation-date selection.
- Display actual radar imagery.
- Add VV/VH switching.
- Add lake-boundary overlay.
- Show acquisition metadata and lake area.
- Add historical area graph.

PHASE 7: DATE COMPARISON
- Add two-date selection.
- Add side-by-side or swipe radar comparison.
- Display both boundaries.
- Show area differences.
- Display compatibility status.

PHASE 8: RISK AND HAZARD INFORMATION
- Identify suitable supporting datasets.
- Add terrain and slope information.
- Add moraine and drainage information where available.
- Add downstream exposure data where available.
- Distinguish official zones, modeled zones and preliminary screening.
- Document uncertainty.

PHASE 9: SAFETY AND DOCUMENTATION
- Add general safety-preparedness information.
- Link to appropriate official sources.
- Add methodology and data-source pages.
- Review hazard language and disclaimers.

PHASE 10: TESTING AND DEPLOYMENT
- Test API endpoints.
- Test processing failures and recovery.
- Validate measurements.
- Test map loading and responsiveness.
- Test missing-data states.
- Secure configuration and file access.
- Deploy only after scientific and functional validation.


19. TESTING CHECKLIST

Data ingestion:
[ ] Both source products can be located.
[ ] Product metadata can be read.
[ ] Acquisition dates are verified.
[ ] Product type and polarization are verified.
[ ] Study-area coverage is confirmed.

Preprocessing:
[ ] Processing workflow is recorded.
[ ] Outputs are georeferenced.
[ ] Coordinate reference system is recorded.
[ ] VV/VH layers are correct where present.
[ ] Terrain artifacts are inspected.
[ ] Processing logs are retained.

Lake extraction:
[ ] Boundary is georeferenced.
[ ] Extraction method is documented.
[ ] Boundary is visually reviewed.
[ ] Uncertain areas are identified.
[ ] Area calculation is verified.

Comparison:
[ ] Acquisition compatibility is checked.
[ ] Raster grids are aligned where appropriate.
[ ] Comparison method is recorded.
[ ] Area difference is calculated correctly.
[ ] Percentage calculation handles zero or invalid earlier area.
[ ] Incompatible observations are flagged.

Frontend:
[ ] Region selector works.
[ ] Date selector shows only registered observations.
[ ] Radar image matches the selected observation.
[ ] VV/VH switching works where available.
[ ] Boundary overlay works.
[ ] Graph uses actual stored measurements.
[ ] Comparison view works for compatible observations.
[ ] Missing-data states are clear.
[ ] Desktop and mobile layouts are usable.

Risk and safety:
[ ] Risk factors show sources and data status.
[ ] Preliminary indicators are not called official warnings.
[ ] Hazard-zone provenance is visible.
[ ] No unsupported danger-zone boundaries are displayed.
[ ] Safety guidance is clearly marked as general information.


20. IMPORTANT PROJECT RULES FOR DEVELOPERS AND AI CODING TOOLS

When using Antigravity or another AI coding assistant, follow these rules:

1. Read PRD.md, architecture.md, design.md and README.md before implementing features.
2. Treat these documents as the project's baseline requirements.
3. Do not silently change the project's purpose or study area.
4. Do not replace real satellite processing with mock images or random measurements.
5. Do not invent acquisition dates, lake areas, risk scores or hazard boundaries.
6. Do not treat NISAR as a source of 2023 imagery.
7. Keep frontend, backend, processing and database responsibilities separate.
8. Keep the dashboard simple and map-first.
9. Build and test one development phase at a time.
10. Do not claim a feature is complete unless it has been implemented and tested.
11. When a dataset is missing, report what is missing rather than fabricating a substitute.
12. Record important implementation decisions and update documentation when the architecture changes.
13. Keep original satellite products unchanged.
14. Do not commit large raw datasets or secrets to Git.
15. Preserve scientific traceability for all measurements and derived outputs.

Suggested instruction to give the coding assistant:

"Read README.md, PRD.md, architecture.md and design.md completely before making changes. Follow the requirements and design in these documents. First inspect the existing project files and report the current structure. Then implement only the next agreed development phase. Do not generate fake satellite imagery, fake lake-area measurements, fabricated risk scores or unsupported danger zones. Use real data and clearly report missing inputs. Keep the dashboard simple, map-first and focused on region selection, observation-date selection, radar imagery and area graphs. Do not rewrite unrelated files or change the architecture without explaining why."


21. KNOWN LIMITATIONS AND SCIENTIFIC CAUTIONS

- The two initial observations do not by themselves establish a long-term lake trend.
- Acquisition geometry and product compatibility must be checked before quantitative comparison.
- SAR water detection can be affected by terrain, snow, ice, radar shadow, layover and speckle.
- A detected boundary requires validation.
- Lake area change alone cannot predict an imminent GLOF.
- Moraine-dam stability cannot be reliably inferred from ordinary radar imagery alone.
- Downstream exposure mapping requires suitable terrain, drainage and asset datasets.
- Preliminary terrain screening is not a validated flood-inundation simulation.
- The platform does not replace official monitoring, early-warning or disaster-management systems.
- NISAR cannot supply the 2023 historical observations because it launched in 2025.

Every map, graph and assessment should show its data source, observation date and relevant limitations.


22. EXPECTED FIRST WORKING VERSION

The first useful version should do a small number of things correctly:

1. Open a simple web dashboard.
2. Allow the user to select South Lhonak Lake.
3. Allow the user to select a successfully processed Sentinel-1 observation.
4. Display the actual processed radar image.
5. Allow VV and VH selection where available.
6. Display the validated lake boundary.
7. Display the calculated lake area and acquisition date.
8. Show a graph using the available area measurements.
9. Allow a comparison of the two 2023 observations if they pass compatibility checks.
10. Clearly explain missing data and scientific limitations.

Only after this workflow works should the project expand into additional regions, automated data discovery, advanced susceptibility analysis and future satellite integration.


23. FINAL PROJECT SUMMARY

Project:
South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform.

Initial study area:
South Lhonak Lake, North Sikkim, India.

Initial historical observations:
Sentinel-1, 28 September 2023 and 10 October 2023, subject to metadata verification.

Primary purpose:
Satellite-based monitoring, lake boundary extraction, lake-area calculation, observation comparison and visualization of relevant susceptibility information.

Core user experience:
Select a region, select an observation date, view the actual radar image, inspect the lake boundary, see area graphs and compare dates.

Proposed technology:
React, TypeScript, Python, FastAPI, ESA SNAP, GDAL, Rasterio, PostgreSQL and PostGIS.

Long-term direction:
Support additional observations, future NISAR data, additional glacier regions and scientifically supported GLOF susceptibility and downstream exposure analysis.

Core principle:
REAL SATELLITE DATA. TRACEABLE PROCESSING. VALIDATED MEASUREMENTS. CLEAR VISUALIZATION. RESPONSIBLE HAZARD COMMUNICATION.

END OF README
