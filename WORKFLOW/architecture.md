SOUTH LHONAK GLACIAL LAKE MONITORING AND GLOF SUSCEPTIBILITY ASSESSMENT PLATFORM
SYSTEM ARCHITECTURE
File: architecture.txt
Version: 1.0
Status: Proposed architecture for initial implementation


1. PURPOSE

This document describes the proposed software architecture for the South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform.

The platform will use satellite remote-sensing data and supporting geospatial datasets to monitor South Lhonak Lake, compare observations from different dates, calculate lake surface area, visualize historical changes and present preliminary indicators relevant to Glacial Lake Outburst Flood (GLOF) susceptibility.

The initial implementation will focus on the Sentinel-1 observations dated 28 September 2023 and 10 October 2023. These are intended to represent pre-event and post-event observations respectively, subject to verification of their acquisition metadata, coverage, geometry and data quality.

The application must be a functional scientific monitoring system. It must not display invented measurements, simulated satellite observations as real data, or unverified warnings.


2. ARCHITECTURE GOALS

The architecture must:

1. Keep the user interface simple and easy to understand.
2. Allow a user to select a glacier or study region.
3. Allow a user to select an available satellite observation date.
4. Display the actual processed radar image for the selected observation.
5. Allow VV and VH polarization layers to be viewed when available.
6. Display detected lake boundaries over the radar image.
7. Calculate and display lake area from georeferenced lake boundaries.
8. Compare two compatible observation dates.
9. Display area measurements and change graphs.
10. Store observation metadata and processing results for historical access.
11. Separate satellite processing from the web application.
12. Support future satellite observations and additional glacier regions.
13. Allow future integration of NISAR data without assuming that NISAR can provide historical 2023 imagery.
14. Clearly communicate data quality, processing status, assumptions and limitations.


3. HIGH-LEVEL SYSTEM ARCHITECTURE

The system is divided into five main layers:

A. Frontend application
B. Backend API
C. Satellite processing engine
D. Geospatial database and file storage
E. External satellite and supporting data sources

SYSTEM FLOW

User
  |
  v
React + TypeScript Web Dashboard
  |
  | HTTPS API requests
  v
FastAPI Backend
  |
  +-------------------------+
  |                         |
  v                         v
PostgreSQL + PostGIS     Processing Job Manager
  |                         |
  |                         v
  |                    Python Processing Engine
  |                         |
  |                         +--> Sentinel-1 input products
  |                         +--> ESA SNAP
  |                         +--> GDAL / Rasterio
  |                         +--> Lake boundary extraction
  |                         +--> Area and change calculations
  |                         |
  +<------------------------+
  |
  v
Geospatial outputs and metadata
  |
  v
Frontend map, radar viewer, statistics and graphs

Satellite source files and processed raster products are stored in file storage. The database stores metadata, processing records, observation references and geospatial vector results. Large raster files should not be stored directly as database blobs.


4. FRONTEND ARCHITECTURE

Recommended technologies:
- React
- TypeScript
- Vite
- Leaflet or MapLibre GL JS for maps
- Recharts or Plotly for charts
- A lightweight component library or custom CSS

The frontend is responsible for presenting information and collecting user selections. It must not perform heavy SAR processing in the browser.

4.1 Main Dashboard

The dashboard should be intentionally simple. The main workflow should be:

1. Select a glacier region.
2. Select an observation date.
3. View the corresponding radar image.
4. Inspect the lake boundary and available measurements.
5. Select a second date when comparison is required.
6. View the comparison and graphs.

Suggested dashboard layout:

---------------------------------------------------------
SOUTH LHONAK LAKE MONITORING
---------------------------------------------------------
Region:       [ South Lhonak Lake             v ]
Observation:  [ 28 September 2023              v ]
Polarization: [ VV v ] [ VH v ]

---------------------------------------------------------
                 RADAR IMAGE / MAP
       Actual processed satellite image
       Lake boundary overlay
       Zoom | Pan | Layer controls
---------------------------------------------------------

Lake Area:             [ calculated value ]
Observation Date:      [ acquisition date ]
Satellite:             [ Sentinel-1 ]
Processing Status:     [ completed / status ]

---------------------------------------------------------
LAKE AREA HISTORY / CHANGE GRAPH
       Date against calculated lake area
---------------------------------------------------------

[ Compare observations ]
Earlier date: [ date selector ]
Later date:   [ date selector ]

---------------------------------------------------------

The dashboard must remain usable on desktop and smaller screens. On smaller screens, the radar map should remain the primary visual element, with statistics and graphs arranged below it.

4.2 Region Selector

The region selector should list only regions configured in the database.

Initial region:
- South Lhonak Lake, North Sikkim, India.

The architecture should allow more glacier regions to be added later. Each region should have a name, geographic boundary or area of interest, location details and active status.

Do not show a region as available for analysis until its region configuration and relevant data are registered.

4.3 Observation Date Selector

The date selector should be populated from successfully registered satellite observations for the selected region.

Each observation entry should show:
- Actual acquisition date and time, when available.
- Satellite mission and sensor.
- Available polarization channels.
- Processing status.
- Data quality or compatibility status.

Do not generate dates to fill gaps in the timeline. Do not use upload date as a substitute for satellite acquisition date.

4.4 Radar Image Viewer

The map viewer should display the processed, georeferenced radar image for the selected observation.

Required capabilities:
- Zoom and pan.
- Display the lake boundary overlay.
- Switch between VV and VH layers when available.
- Display a map scale and coordinate information.
- Show the selected observation date.
- Show a clear message when an image or layer is unavailable.

The radar image should be served as map tiles or another browser-compatible raster format. Large source GeoTIFF files should not be repeatedly downloaded in full by the browser.

4.5 Comparison View

The comparison view should allow the user to choose an earlier and a later observation.

It should provide:
- Earlier radar image.
- Later radar image.
- Earlier lake boundary.
- Later lake boundary.
- Side-by-side or swipe comparison.
- Earlier lake area.
- Later lake area.
- Absolute area difference.
- Percentage area change.
- A clear indication if the selected observations are not suitable for direct quantitative comparison.

A comparison must only be calculated when the observations pass the required compatibility and quality checks.

4.6 Graphs and Statistics

The dashboard should include:
- Lake area versus observation date.
- Date-wise area values.
- Absolute area change between selected observations.
- Percentage change between selected observations.

Graphs must be generated from stored, validated processing results. Missing observations must remain missing rather than being represented by fabricated values.

4.7 GLOF Susceptibility View

A separate, simple section may display available susceptibility indicators, such as:
- Lake area and expansion history.
- Surrounding slope and elevation.
- Glacier proximity.
- Potential avalanche or landslide source areas.
- Moraine-dam information, if suitable data exists.
- Drainage routes and downstream exposure, if supporting data exists.

The interface must distinguish measured data, derived indicators and model outputs. It must not present a preliminary susceptibility assessment as a certified warning or a prediction of the date of a GLOF.


5. BACKEND ARCHITECTURE

Recommended technology:
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL driver such as psycopg

The backend provides APIs to the frontend, validates requests, retrieves metadata, manages processing jobs and returns references to geospatial outputs.

5.1 Backend Responsibilities

- Provide the list of configured glacier regions.
- Provide available observations for a selected region.
- Provide observation metadata and processing status.
- Return raster layer information and map service URLs.
- Return lake boundary features.
- Return lake area measurements.
- Return historical time-series data.
- Validate date-comparison requests.
- Start or schedule processing jobs.
- Expose processing progress and errors.
- Record processing results and provenance.

5.2 API Design

Use a versioned API prefix such as /api/v1.

Suggested endpoints:

REGIONS
GET    /api/v1/regions
GET    /api/v1/regions/{region_id}

OBSERVATIONS
GET    /api/v1/regions/{region_id}/observations
GET    /api/v1/observations/{observation_id}
GET    /api/v1/observations/{observation_id}/layers
GET    /api/v1/observations/{observation_id}/boundary
GET    /api/v1/observations/{observation_id}/statistics

COMPARISON
POST   /api/v1/comparisons
GET    /api/v1/comparisons/{comparison_id}

HISTORICAL ANALYSIS
GET    /api/v1/regions/{region_id}/area-history

PROCESSING
POST   /api/v1/processing-jobs
GET    /api/v1/processing-jobs/{job_id}
GET    /api/v1/processing-jobs/{job_id}/logs

HEALTH
GET    /api/v1/health

Example comparison request:

{
  "region_id": "south-lhonak",
  "earlier_observation_id": "observation-sep-28-2023",
  "later_observation_id": "observation-oct-10-2023"
}

The identifiers above are examples only. Actual identifiers must be generated and stored by the application.

The comparison response should include the two observation references, compatibility status, area values, absolute difference, percentage difference and references to the comparison layers. If compatibility checks fail, the API should return an explanatory status instead of presenting an unreliable numerical comparison.


6. SATELLITE PROCESSING ENGINE

Recommended technology:
- Python
- ESA SNAP / Sentinel Application Platform
- GDAL
- Rasterio
- GeoPandas
- Shapely
- NumPy
- SciPy, where required

The processing engine should be a separate module from the FastAPI request-handling code. Heavy raster operations should run as background jobs rather than blocking API requests.

6.1 Input Data

Initial datasets:
- Sentinel-1 observation dated 28 September 2023.
- Sentinel-1 observation dated 10 October 2023.

The supplied products are described in the project requirements as Sentinel-1 GRD-HD dual-polarization products containing VV and VH.

Before processing, inspect the actual downloaded products and verify:
- Product identifier.
- Satellite platform.
- Acquisition start and stop time.
- Product type and processing level.
- Acquisition mode.
- Relative orbit number.
- Orbit direction: ascending or descending.
- Polarization channels.
- Spatial coverage.
- Pixel spacing and projection information.
- Product metadata and quality information.

Do not assume that two products are directly comparable merely because their dates are close.

6.2 SAR Preprocessing Workflow

The processing workflow should be selected according to the actual product metadata and the requirements of the chosen Sentinel-1 product.

A proposed workflow is:

1. Read and validate the satellite product.
2. Extract or access the measurement and annotation data.
3. Apply orbit information when appropriate.
4. Apply relevant border-noise and thermal-noise corrections where appropriate for the product.
5. Perform radiometric calibration to obtain a consistent backscatter representation.
6. Apply speckle filtering only when justified by the analysis. Preserve an unfiltered calibrated result for reference.
7. Perform terrain correction using a suitable DEM.
8. Reproject outputs into a consistent coordinate reference system.
9. Clip or mask the study area.
10. Generate analysis-ready VV and VH raster layers.
11. Record processing parameters and software versions.

The exact SNAP operators and their order must be confirmed against the product type and current SNAP documentation. Avoid applying an operation twice if the product has already undergone that processing.

6.3 Terrain and Image Quality Considerations

South Lhonak is a high-mountain environment. SAR interpretation may be affected by:
- Radar shadow.
- Layover.
- Foreshortening.
- Snow and ice.
- Terrain slope and aspect.
- Incidence angle.
- Speckle.
- Geometric misalignment.
- Seasonal and weather-related surface changes.

These effects must be considered when extracting water boundaries and comparing observations. Areas obscured by radar geometry must not automatically be classified as land or water.

6.4 Lake Boundary Extraction

The processing engine should identify candidate water pixels from the calibrated and terrain-corrected radar data.

A configurable method may use:
- VV backscatter thresholding.
- VH backscatter thresholding.
- Combined VV and VH rules.
- Spatial masks and terrain constraints.
- Connected-component filtering.
- Morphological cleanup where appropriate.
- Manual review or correction for uncertain boundaries.

The initial implementation may use a semi-automatic workflow. The threshold and classification method must be documented and validated against visual evidence or suitable reference data.

The result should be a georeferenced lake boundary polygon. Store the classification method, parameters, source observation and quality notes with the result.

6.5 Lake Area Calculation

Calculate lake area from the georeferenced polygon using an appropriate projected coordinate reference system or geodesic area calculation.

Store:
- Area in square metres.
- Area in hectares.
- Area in square kilometres.
- Geometry used for the calculation.
- Calculation method.
- Observation identifier.
- Processing version.

Do not calculate area from unreferenced pixel counts alone unless pixel area and projection are correctly accounted for.

6.6 Change Detection

For two compatible observations:
- Align the processed rasters to a common grid.
- Use a consistent coordinate reference system.
- Apply a consistent study-area mask.
- Compare the validated lake boundary polygons.
- Calculate the earlier and later lake areas.
- Calculate absolute area difference.
- Calculate percentage change.
- Generate a spatial difference layer showing expansion and reduction where supported by the data.

Formula:

Absolute area difference = Later area - Earlier area

Percentage change =
((Later area - Earlier area) / Earlier area) * 100

If the earlier area is zero or invalid, percentage change must be reported as unavailable rather than calculated.

A positive result indicates an increase in measured area; a negative result indicates a decrease. The application must describe the observation dates and processing method used.

6.7 Processing Outputs

For each successfully processed observation, produce as applicable:
- Calibrated VV raster.
- Calibrated VH raster.
- Terrain-corrected VV raster.
- Terrain-corrected VH raster.
- Display-ready raster layer or tiles.
- Lake boundary polygon.
- Lake area statistics.
- Processing metadata.
- Quality-control information.

For a compatible two-date comparison, produce:
- Earlier and later boundary overlays.
- Difference layer.
- Comparison statistics.
- Comparison metadata.


7. DATA STORAGE ARCHITECTURE

Use two storage categories:

A. Geospatial database
B. Raster and file storage

7.1 Database

Recommended database:
- PostgreSQL
- PostGIS extension

PostGIS should store geographic boundaries and other vector information. PostgreSQL should store metadata, observation records, job status and measurement results.

Suggested logical tables:

REGIONS
- id
- name
- description
- country
- region_geometry
- created_at
- is_active

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

These are logical table designs. Final field types, constraints, indexes and relationships should be implemented in database migrations.

7.2 File Storage

Store large files outside the relational database.

Suggested directory structure:

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

Keep original satellite archives unchanged. Store checksums and source metadata so that inputs can be verified. Use a configurable storage path rather than hard-coding a machine-specific directory.

For development, local storage may be used. Object storage can be introduced later if deployment scale requires it.


8. RASTER DELIVERY AND MAP DISPLAY

Large satellite rasters should not be sent to the browser as full-resolution files for ordinary map viewing.

Recommended approach:
- Preserve analysis rasters as GeoTIFF or Cloud Optimized GeoTIFF where suitable.
- Generate display tiles or use a raster tile service.
- Serve vector lake boundaries as GeoJSON or vector tiles.
- Return layer metadata and URLs through the backend.
- Load map layers on demand for the selected region and observation.

Possible serving options include TiTiler or a suitable GDAL-based tile service. The final choice should be made during implementation based on deployment complexity and file formats.

The map must display the actual processed raster. A basemap may be used for geographic context, but it must not be mistaken for the satellite observation.


9. PROCESSING JOB MANAGEMENT

Satellite processing can take significant time. It must be handled as a background task.

Proposed workflow:

1. User or administrator registers a satellite product.
2. Backend validates the product and creates an observation record.
3. Backend creates a processing job.
4. Processing worker reads the source product.
5. Worker performs preprocessing and quality checks.
6. Worker extracts the lake boundary and calculates area.
7. Worker writes raster and vector outputs to storage.
8. Worker updates database records.
9. Frontend retrieves the latest job status.
10. When processing is complete, the observation becomes available in the dashboard.

Suggested job states:
- queued
- validating
- processing
- quality_check
- completed
- failed

A failed job must retain an error message and logs. A partially processed observation must not be presented as a completed observation.

For the first prototype, a simple background worker or command-line processing runner may be sufficient. A dedicated queue such as Celery with Redis can be added when processing volume increases.


10. DATA QUALITY AND SCIENTIFIC VALIDATION

Scientific reliability is a core system requirement.

Before comparing observations, check:
- Same or compatible acquisition mode.
- Compatible polarization channels.
- Compatible orbit direction.
- Relative orbit and viewing geometry.
- Spatial coverage of the complete study area.
- Common coordinate reference system.
- Consistent pixel spacing and grid alignment.
- Comparable calibration and processing settings.
- Adequate visibility of the lake.
- Quality and completeness of extracted boundaries.

If observations are not sufficiently compatible, the system may display them individually but must flag or prevent quantitative comparison.

For every derived measurement, preserve:
- Source product.
- Acquisition date.
- Processing workflow.
- Software and version.
- Parameters.
- Coordinate reference system.
- Quality notes.
- Validation status.

The system should allow visual validation of extracted lake boundaries. Uncertain results must be marked as requiring review.


11. GLOF SUSCEPTIBILITY AND DOWNSTREAM EXPOSURE MODULE

This module should be developed after the initial satellite monitoring and area-comparison workflow is working.

Potential input datasets:
- Digital Elevation Model.
- Glacier and ice information.
- Moraine and natural-dam information.
- Slope and aspect.
- Potential avalanche or landslide source areas.
- Drainage network.
- Downstream settlements.
- Roads, bridges and other infrastructure.

Potential outputs:
- Terrain and slope maps.
- Lake and surrounding terrain indicators.
- Potential drainage routes.
- Preliminary downstream exposure maps.
- A transparent indicator-based susceptibility summary.

Any terrain-based flow route is only a preliminary screening result unless supported by suitable hydraulic modeling and validation. The platform must not claim to forecast an actual flood path or issue an official warning without the required scientific evidence and validation.

The assessment must identify unavailable inputs and explain uncertainty. Lake area change alone must never be treated as proof of imminent GLOF risk.


12. FUTURE SATELLITE DATA INTEGRATION

The system should use a mission-independent observation model where practical. Each observation should record its satellite, sensor, product type, acquisition time, polarization or bands, geometry and processing workflow.

Initial historical analysis:
- Sentinel-1 observations from 2023.

Future monitoring:
- New Sentinel-1 observations when available.
- NISAR observations during its operational data period and subject to data availability and suitability.
- Other optical, elevation or supporting datasets where appropriate.

NISAR launched in 2025 and cannot provide observations from September or October 2023. The 2023 event comparison must therefore use suitable historical data such as Sentinel-1.

Different missions and sensors must not be compared as if their measurements were automatically equivalent. Mission-specific preprocessing and compatibility checks are required.


13. SECURITY, RELIABILITY AND PERFORMANCE

Security:
- Validate all API inputs.
- Restrict file paths to configured data directories.
- Do not accept arbitrary server-side file paths from frontend requests.
- Keep credentials and secrets in environment variables.
- Use HTTPS in deployment.
- Add authentication and role-based permissions if the platform is made public or multi-user.

Reliability:
- Preserve original satellite files.
- Record processing logs.
- Use database transactions for result registration.
- Keep failed-job details.
- Validate raster and vector outputs before publishing them.
- Avoid displaying stale or incomplete results as current.

Performance:
- Run raster processing outside API request threads.
- Avoid loading entire scenes into memory when windowed processing is possible.
- Use appropriate raster overviews and map tiles.
- Index frequently queried database fields and spatial geometries.
- Cache stable map layers and metadata where useful.
- Process only the study area when scientifically appropriate and technically safe.


14. RECOMMENDED PROJECT DIRECTORY STRUCTURE

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
|
|-- .env.example
|-- .gitignore
|-- README.md

This is a proposed structure. It may be adjusted during implementation, but frontend, backend, processing logic, database definitions and data storage should remain clearly separated.

Large satellite datasets and generated processing outputs should not be committed to Git. The data directory should be excluded through .gitignore, while documentation and small configuration examples should be version-controlled.


15. DEVELOPMENT AND INTEGRATION PHASES

PHASE 1: PROJECT FOUNDATION
- Create the project directory structure.
- Set up the frontend.
- Set up the FastAPI backend.
- Configure PostgreSQL and PostGIS.
- Configure local data storage.
- Add health-check endpoints.

PHASE 2: SATELLITE DATA INSPECTION
- Register the two Sentinel-1 ZIP products.
- Inspect product metadata.
- Verify acquisition geometry and coverage.
- Confirm VV and VH availability.
- Record compatibility findings.

PHASE 3: FIRST SATELLITE PROCESSING
- Build the preprocessing workflow.
- Generate analysis-ready radar layers.
- Inspect terrain-related effects.
- Validate the study-area coverage.

PHASE 4: LAKE DETECTION AND AREA
- Implement candidate water detection.
- Generate the lake boundary.
- Validate the boundary visually.
- Calculate lake area.
- Store results and processing provenance.

PHASE 5: TWO-DATE COMPARISON
- Check compatibility of the two observations.
- Align the analysis rasters.
- Compare lake boundaries.
- Calculate area differences.
- Generate comparison outputs.

PHASE 6: DASHBOARD
- Build the region selector.
- Build the observation date selector.
- Display actual radar imagery.
- Add VV and VH layer selection.
- Add lake boundary overlay.
- Add area statistics and historical graph.
- Add the two-date comparison view.

PHASE 7: SUSCEPTIBILITY AND EXPOSURE
- Identify suitable supporting datasets.
- Process terrain and slope information.
- Add moraine and drainage information where available.
- Develop transparent preliminary indicators.
- Clearly label uncertainty and limitations.

PHASE 8: FUTURE MONITORING
- Support registration of new observations.
- Add repeatable processing.
- Add additional satellite missions when suitable.
- Prepare the system for additional glacier regions.


16. INITIAL IMPLEMENTATION PRIORITIES

The first working version should be small and reliable.

Priority 1:
A user can open the application and select South Lhonak Lake.

Priority 2:
A user can select 28 September 2023 or 10 October 2023 from the observations that have been successfully processed.

Priority 3:
The application displays the actual processed radar image for the selected date.

Priority 4:
The application displays the lake boundary and calculated area, provided the result has passed validation.

Priority 5:
The application allows the two observations to be compared if their metadata and processing results establish that the comparison is valid.

Priority 6:
The application displays an area comparison and a historical graph based on stored measurements.

Do not begin with a complicated AI prediction dashboard, automated live monitoring, or a large collection of features. First establish a working end-to-end pipeline from real satellite input to validated map and graph output.


17. ACCEPTANCE CRITERIA

The initial system is acceptable when:

1. The backend can register and inspect the two actual Sentinel-1 products.
2. Product metadata and acquisition dates are correctly recorded.
3. The processing engine can produce georeferenced radar outputs.
4. VV and VH layers are available when present in the source products.
5. The system can produce a lake boundary with documented extraction settings.
6. Lake area is calculated using a valid geospatial method.
7. The frontend can select a region and an available observation date.
8. The radar viewer displays the actual processed observation.
9. The dashboard displays the corresponding validated lake boundary and area.
10. The system can compare the two observations only when compatibility checks pass.
11. Graphs use actual stored measurements.
12. Processing status, errors and quality information are visible.
13. Original input data and processing provenance are preserved.
14. No fabricated observations, measurements or warning levels are displayed.


18. IMPORTANT DESIGN PRINCIPLES

- Real satellite data must be the source of all observation imagery.
- Acquisition date must come from product metadata.
- Upload date must never be shown as acquisition date.
- Every lake-area value must be traceable to a boundary and processing record.
- Comparisons must be based on compatible observations.
- The dashboard should prioritize the radar map, date selection and area graph.
- Heavy processing must remain outside the frontend.
- Large raster files must be handled efficiently.
- Uncertainty and data limitations must be visible.
- Preliminary susceptibility analysis must not be presented as an official warning.
- The architecture must support future growth without making the first version unnecessarily complex.


19. FINAL ARCHITECTURE SUMMARY

The proposed platform uses:

Frontend:
React + TypeScript, with an interactive geospatial map and charts.

Backend:
Python + FastAPI, providing APIs, metadata management and processing-job coordination.

Satellite processing:
Python, ESA SNAP, GDAL and Rasterio for Sentinel-1 preprocessing and geospatial analysis.

Database:
PostgreSQL + PostGIS for regions, observations, boundaries, measurements and comparison metadata.

File storage:
Local or object-based storage for original satellite products, processed rasters, map outputs and logs.

Visualization:
Leaflet or MapLibre for radar imagery and geospatial layers; Recharts or Plotly for area graphs.

The central workflow is:

SELECT REGION
    ->
SELECT OBSERVATION DATE
    ->
LOAD ACTUAL RADAR IMAGE
    ->
DISPLAY LAKE BOUNDARY
    ->
SHOW CALCULATED AREA
    ->
SELECT SECOND DATE
    ->
CHECK DATA COMPATIBILITY
    ->
COMPARE LAKE BOUNDARIES AND AREA
    ->
DISPLAY CHANGE MAP AND GRAPH

The first implementation should prove this complete workflow using the two available Sentinel-1 observations. Once it works reliably, the platform can be extended with historical monitoring, supporting terrain data, preliminary GLOF susceptibility assessment, downstream exposure analysis and future NISAR observations.

END OF ARCHITECTURE DOCUMENT
