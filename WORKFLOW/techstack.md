SOUTH LHONAK GLACIAL LAKE MONITORING AND GLOF SUSCEPTIBILITY ASSESSMENT PLATFORM
TECHNOLOGY STACK SPECIFICATION
File: TECH_STACK.txt
Version: 1.0
Status: Proposed stack for initial implementation


1. PURPOSE

This document defines the recommended technologies, responsibilities, integration boundaries and dependency-management rules for the South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform.

The platform will process satellite observations, derive geospatial products, store observation metadata and display radar imagery, lake boundaries, area measurements, comparisons and preliminary GLOF susceptibility information.

The technology stack is selected to support:
- Large satellite raster processing.
- Scientific and reproducible geospatial analysis.
- A simple interactive web dashboard.
- Clear separation between frontend, backend and processing.
- Storage and querying of geospatial records.
- Future satellite missions and additional glacier regions.

This is a proposed implementation stack. Exact patch versions and compatible package versions must be verified together during project setup and then recorded in lock files. Do not independently upgrade major dependencies in the middle of implementation.


2. STACK SUMMARY

FRONTEND
- React
- TypeScript
- Vite
- Leaflet with React-Leaflet, or MapLibre GL JS
- Recharts for charts
- CSS Modules or a small, consistent styling system

BACKEND
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- Psycopg

DATABASE
- PostgreSQL
- PostGIS

SATELLITE AND GEOSPATIAL PROCESSING
- ESA SNAP / Sentinel Application Platform
- Python
- GDAL
- Rasterio
- GeoPandas
- Shapely
- NumPy
- SciPy when needed

RASTER AND MAP DELIVERY
- GeoTIFF / Cloud Optimized GeoTIFF where suitable
- TiTiler or a compatible raster tile service
- GeoJSON for initial vector boundary delivery

BACKGROUND PROCESSING
- Python command-line processing worker for the first prototype
- Celery with Redis only if a dedicated job queue becomes necessary

DEVELOPMENT AND VERSION CONTROL
- Git
- GitHub
- Python virtual environment
- Node.js LTS and npm
- Docker Compose for reproducible local services when useful

The first version should avoid unnecessary infrastructure. Do not add Kubernetes, microservices, message brokers or complex cloud infrastructure unless a demonstrated requirement justifies them.


3. FRONTEND TECHNOLOGIES

3.1 React

Purpose:
Build the interactive web application and reusable user-interface components.

Responsibilities:
- Render the dashboard.
- Manage region and observation-date selections.
- Display radar imagery and geospatial overlays.
- Display lake-area measurements and charts.
- Provide date-comparison controls.
- Display risk factors, hazard information and safety guidance.
- Show loading, empty, error and data-quality states.

Use reusable components and keep satellite processing out of the browser.

3.2 TypeScript

Purpose:
Provide static typing for frontend code.

Responsibilities:
- Define API response types.
- Define region and observation models.
- Define map-layer metadata types.
- Define measurement and comparison types.
- Reduce errors when integrating the frontend with FastAPI.

Avoid using untyped data throughout the application. Validate API data at the boundary where appropriate.

3.3 Vite

Purpose:
Frontend development server and build tool.

Responsibilities:
- Run the frontend locally.
- Bundle the production application.
- Manage frontend environment configuration.

3.4 Map Library: Leaflet or MapLibre

Choose one map library for the initial implementation rather than integrating both without a requirement.

Option A: Leaflet with React-Leaflet
Recommended for the first version when the application primarily needs:
- Raster tile layers.
- GeoJSON lake-boundary overlays.
- Zoom and pan.
- Layer controls.
- Basic map interaction.

Option B: MapLibre GL JS
Consider when the application needs:
- More advanced vector-map styling.
- Larger vector datasets.
- More extensive map-layer styling.
- A map experience based on vector tiles.

Initial recommendation:
Use Leaflet with React-Leaflet for the first prototype because the core requirement is a simple radar viewer with a lake-boundary overlay. Reconsider MapLibre if later requirements justify it.

The base map and satellite radar layer must be visually distinguishable. The radar viewer must display actual processed satellite data, not a decorative or fabricated image.

3.5 Recharts

Purpose:
Display lake-area history and comparison statistics.

Use for:
- Lake area versus acquisition date.
- Date-wise measurement values.
- Comparison of earlier and later lake area.
- Simple explanatory charts.

Charts must use values returned by the backend. Do not hardcode demonstration measurements in production.

3.6 Styling

Use CSS Modules or a small consistent styling approach.

Requirements:
- Keep the dashboard minimal and map-first.
- Use consistent spacing, typography and colour tokens.
- Support desktop, tablet and mobile.
- Keep risk colours and map legends consistent.
- Provide accessible labels and sufficient contrast.

Avoid adding multiple component libraries or styling frameworks without a clear need.


4. BACKEND TECHNOLOGIES

4.1 Python

Purpose:
Primary backend and geospatial processing language.

Use Python for:
- API implementation.
- Satellite-product metadata inspection.
- Processing workflow orchestration.
- Lake-boundary extraction.
- Area calculations.
- Change-detection operations.
- Data validation and processing utilities.

Keep API request handling separate from long-running raster-processing tasks.

4.2 FastAPI

Purpose:
Provide the REST API between the frontend and backend services.

Responsibilities:
- Serve region information.
- Serve available satellite observations.
- Return observation metadata.
- Provide radar-layer references.
- Return lake-boundary geometry.
- Return area measurements and historical data.
- Validate comparison requests.
- Create and report processing jobs.
- Provide health-check endpoints.

Use a versioned API prefix such as /api/v1.

4.3 Pydantic

Purpose:
Validate API input and output data.

Use for:
- Region request and response schemas.
- Observation metadata.
- Processing-job status.
- Area measurement responses.
- Date-comparison requests and responses.
- Error response structures.

4.4 SQLAlchemy

Purpose:
Database access and object-relational mapping.

Use it to:
- Define database models.
- Query region and observation records.
- Store processing metadata.
- Store area measurements.
- Retrieve historical observations.
- Manage database transactions.

4.5 Alembic

Purpose:
Database schema migration management.

Use migrations to track changes to:
- Tables.
- Columns.
- Indexes.
- Constraints.
- Relationships.
- PostGIS geometry definitions.

Do not manually modify production database schemas without recording the corresponding migration.

4.6 Psycopg

Purpose:
PostgreSQL database driver for Python.

Use a compatible Psycopg version with the selected SQLAlchemy and PostgreSQL versions.


5. DATABASE TECHNOLOGIES

5.1 PostgreSQL

Purpose:
Store structured application data and observation metadata.

Expected data:
- Glacier regions.
- Satellite observations.
- Product metadata.
- Processing jobs.
- Lake-area measurements.
- Comparison records.
- Data-source information.
- Quality-control status.

5.2 PostGIS

Purpose:
Add spatial data types, indexing and spatial operations to PostgreSQL.

Use for:
- Region boundaries.
- Lake-boundary polygons.
- Study-area geometry.
- Drainage and exposure vector layers where suitable.
- Spatial queries and intersections.

Use spatial indexes for geometry columns that are queried geographically.

Important:
Large satellite raster files should normally remain in file or object storage. The database should store their paths or object references and associated metadata. Do not store multi-gigabyte source products as ordinary database blobs.


6. SATELLITE AND GEOSPATIAL PROCESSING TECHNOLOGIES

6.1 ESA SNAP / Sentinel Application Platform

Purpose:
Perform Sentinel-1 SAR preprocessing using appropriate mission-specific operators.

Potential operations, depending on product type and metadata:
- Orbit-file application.
- Border-noise correction.
- Thermal-noise correction.
- Radiometric calibration.
- Speckle filtering when justified.
- Terrain correction.
- Output preparation.

The exact processing graph must be determined after inspecting the actual Sentinel-1 products. Do not blindly apply every operator or repeat processing that has already been performed.

Record:
- SNAP version.
- Processing operators.
- Operator parameters.
- Input product identifiers.
- DEM source.
- Output coordinate reference system.
- Processing date and logs.

6.2 GDAL

Purpose:
Core geospatial raster and vector utilities.

Use for:
- Raster metadata inspection.
- Raster reprojection.
- Raster clipping and warping.
- Raster format conversion.
- Raster overviews.
- Coordinate-system inspection.
- Geospatial file validation.

GDAL version compatibility must be checked against Rasterio and the Python environment.

6.3 Rasterio

Purpose:
Python interface for raster data operations.

Use for:
- Reading and writing GeoTIFF files.
- Reading raster metadata.
- Windowed raster processing.
- Raster masking and clipping.
- Transform and coordinate-reference-system handling.
- Preparing raster outputs for analysis.

Prefer windowed processing where appropriate. Avoid loading an entire large satellite scene into memory unnecessarily.

6.4 GeoPandas

Purpose:
Work with vector geospatial data in Python.

Use for:
- Reading and writing vector data.
- Managing lake-boundary polygons.
- Spatial filtering.
- Joining geospatial attributes.
- Exporting GeoJSON or other suitable vector formats.

6.5 Shapely

Purpose:
Geometry operations.

Use for:
- Polygon validation.
- Geometry repair where appropriate.
- Area-related geometry operations.
- Intersections and differences.
- Boundary comparisons.

Do not silently repair invalid geometries without recording the operation and reviewing the result.

6.6 NumPy

Purpose:
Numerical array operations used in raster analysis.

Use for:
- Raster calculations.
- Threshold-based candidate water detection.
- Mask operations.
- Statistical calculations.

6.7 SciPy

Purpose:
Optional scientific computing support.

Use only when required for a justified operation such as filtering, connected-component analysis or numerical processing. Do not add it if the initial workflow does not need it.

6.8 Coordinate Reference Systems and Area

Use a suitable projected coordinate reference system for the study area or a geodesic area calculation method.

Do not calculate square kilometres by simply counting pixels unless pixel dimensions, projection and area implications have been correctly accounted for.

Store the coordinate reference system and area-calculation method with the result.


7. RASTER AND VECTOR DELIVERY

7.1 GeoTIFF

Use GeoTIFF for analysis-ready raster products when appropriate.

Potential products:
- Calibrated VV raster.
- Calibrated VH raster.
- Terrain-corrected VV raster.
- Terrain-corrected VH raster.
- Derived water-classification raster.
- Difference raster.

7.2 Cloud Optimized GeoTIFF

Use Cloud Optimized GeoTIFF where suitable for efficient remote access and range-based reading.

Do not assume every processing output is automatically a valid COG. Validate outputs before publishing them as such.

7.3 TiTiler or Compatible Raster Tile Service

Purpose:
Serve raster data as map tiles or dynamic raster visualizations.

Use when the frontend needs to display large georeferenced rasters without downloading the complete source image.

Responsibilities:
- Read supported raster files.
- Provide map-compatible raster tiles.
- Support appropriate visualization parameters.
- Serve the selected observation layer.

TiTiler is a recommended option, not a mandatory dependency. Confirm deployment and format compatibility before selecting it.

7.4 GeoJSON

Use GeoJSON initially for:
- Lake-boundary polygons.
- Study-area outlines.
- Small vector overlays.

For larger vector datasets, consider vector tiles or another suitable delivery format.


8. BACKGROUND PROCESSING AND JOB MANAGEMENT

Satellite processing can take minutes or longer. It must not block normal API requests.

Initial implementation:
- Use a separate Python processing script or worker process.
- Let FastAPI create a processing-job record.
- Run processing outside the request-response cycle.
- Update job status and logs.
- Store outputs and register them after validation.

Suggested processing states:
- queued
- validating
- processing
- quality_check
- completed
- failed

Optional future technology:
- Celery for distributed background jobs.
- Redis as a broker or result backend where appropriate.

Do not introduce Celery and Redis in the first prototype unless the simpler worker approach proves insufficient.


9. DEVELOPMENT TOOLS

9.1 Git

Use Git for source-code version control.

Track:
- Frontend source.
- Backend source.
- Processing scripts.
- Database migrations.
- Documentation.
- Safe configuration examples.

Do not commit:
- Large original satellite ZIP products.
- Large processed raster outputs.
- Local virtual environments.
- Node dependency directories.
- Secret files.
- API keys or database passwords.

9.2 GitHub

Use GitHub for repository hosting, collaboration and version history.

Use branches or pull requests for substantial changes where appropriate. Keep commits focused and understandable.

9.3 Python Virtual Environment

Use a project-specific Python virtual environment to isolate dependencies.

Do not install all project packages globally into the system Python.

9.4 Node.js and npm

Use a supported Node.js LTS release and npm for frontend dependency management.

Commit the frontend lock file so that installations can be reproduced.

9.5 Docker and Docker Compose

Docker may be used for reproducible local services such as:
- PostgreSQL with PostGIS.
- Backend API.
- Raster tile service.

The SNAP processing environment may require additional system libraries and configuration. Do not assume that the complete satellite-processing environment will work in a basic container without testing.

Docker is optional for the first local prototype. Add it when it improves repeatability or deployment.


10. PROPOSED VERSION AND COMPATIBILITY POLICY

Use conservative, mutually compatible versions rather than blindly selecting the newest release of every package.

Initial compatibility direction:

- Python: 3.11 series for the first reproducible environment.
- Node.js: supported LTS release, preferably Node.js 22 LTS if compatible with the selected frontend packages.
- React: current stable React release compatible with the chosen React-Leaflet or MapLibre integration.
- TypeScript: stable release compatible with the selected Vite and React tooling.
- FastAPI: stable release compatible with the selected Pydantic version.
- Pydantic: version supported by the chosen FastAPI release.
- SQLAlchemy: stable 2.x series.
- PostgreSQL: supported stable major release with a matching PostGIS release.
- GDAL and Rasterio: versions must be selected as a compatible pair.
- GeoPandas and Shapely: versions compatible with the selected Python, GDAL and GEOS environment.
- ESA SNAP: a stable release that supports the selected Sentinel-1 product and required operators.
- TiTiler: compatible release if selected for raster delivery.

Before implementation:
1. Check official compatibility information.
2. Install the selected dependencies in a clean environment.
3. Verify imports and basic operations.
4. Run a small sample raster through the required tools.
5. Record the exact installed versions.
6. Commit lock files or environment specifications.

Do not treat the suggested version direction as proof that every package combination is compatible. Validate the complete environment.

For Python, use a pinned requirements file or a reproducible environment manager. For the frontend, commit package-lock.json or the lock file belonging to the selected package manager.


11. ENVIRONMENT CONFIGURATION

Use environment variables for configuration.

Suggested .env.example keys:

APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=8000

DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE_NAME

DATA_ROOT=./data

SNAP_EXECUTABLE_PATH=
RASTER_TILE_SERVICE_URL=

VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

These are examples only. Configure actual values for the local environment.

Rules:
- Never commit the real .env file.
- Commit only .env.example with placeholders.
- Do not expose database credentials in frontend variables.
- Do not expose private storage paths or secrets through API responses.
- Validate configured paths and restrict file access to approved data directories.


12. TECHNOLOGY RESPONSIBILITY MATRIX

FRONTEND
React:
UI components and application pages.

TypeScript:
Frontend type safety.

Vite:
Frontend development and production builds.

Leaflet / React-Leaflet:
Interactive map and raster/vector layer display.

Recharts:
Area-history and comparison charts.

BACKEND
Python:
Backend logic and processing orchestration.

FastAPI:
REST API.

Pydantic:
Request and response validation.

SQLAlchemy:
Database access.

Alembic:
Database migrations.

Psycopg:
PostgreSQL driver.

DATABASE
PostgreSQL:
Structured application data.

PostGIS:
Geospatial vector data and spatial queries.

PROCESSING
ESA SNAP:
Sentinel-1 SAR preprocessing.

GDAL:
Raster and geospatial utilities.

Rasterio:
Python raster operations.

GeoPandas:
Vector data handling.

Shapely:
Geometry operations.

NumPy:
Numerical raster analysis.

SciPy:
Optional scientific operations when required.

DELIVERY
GeoTIFF / COG:
Raster storage and access.

TiTiler:
Optional raster tile serving.

GeoJSON:
Initial vector boundary delivery.

DEVELOPMENT
Git / GitHub:
Version control and repository hosting.

Python virtual environment:
Python dependency isolation.

Node.js / npm:
Frontend tooling and dependency management.

Docker Compose:
Optional reproducible local services.


13. TECHNOLOGIES NOT REQUIRED FOR THE FIRST VERSION

Avoid unnecessary complexity.

Do not add these unless a clear requirement appears:
- Kubernetes.
- Multiple independent microservices.
- Kafka.
- A distributed data lake.
- Complex machine-learning infrastructure.
- A custom authentication server.
- A large enterprise UI framework.
- Multiple competing map libraries.
- Multiple databases for the same data.
- A real-time streaming platform.

The initial system can be a modular application with one frontend, one FastAPI backend, a separate processing worker, one PostgreSQL/PostGIS database and file storage.

The design should allow future growth without requiring that complexity immediately.


14. FUTURE TECHNOLOGY EXTENSIONS

The following may be considered later:

Automated satellite data discovery:
A scheduled ingestion service to discover and register new satellite observations from supported providers.

Additional satellite missions:
Mission-specific ingestion and processing modules for future NISAR observations and other suitable missions.

Advanced flood modeling:
A validated hydraulic or hydrodynamic modeling workflow if suitable input data, model expertise and validation become available.

Authentication:
User accounts and role-based permissions if the application becomes a multi-user deployed service.

Object storage:
Cloud or object storage for larger archives and processed products.

Automated testing and deployment:
Continuous integration and deployment pipelines after the application structure stabilizes.

These are future options, not requirements for the first working prototype.


15. NON-NEGOTIABLE TECHNICAL RULES

1. Use actual satellite products as the source of observation imagery.
2. Do not generate fake radar imagery or fabricated lake measurements.
3. Do not hardcode production lake-area values.
4. Do not use upload time as satellite acquisition time.
5. Do not assume two Sentinel-1 observations are quantitatively comparable without checking metadata and geometry.
6. Keep original source products unchanged.
7. Keep heavy raster processing outside the frontend and normal API request handlers.
8. Store large raster products in file or object storage, not ordinary database blobs.
9. Keep metadata, measurement provenance and processing logs.
10. Use a consistent coordinate reference system and documented area calculation.
11. Validate raster and vector outputs before publishing them.
12. Clearly label preliminary susceptibility indicators and unvalidated hazard information.
13. Do not claim NISAR provides September or October 2023 imagery.
14. Do not introduce unnecessary technologies without a technical reason.
15. Pin and record dependency versions after compatibility testing.
16. Keep secrets out of source control.
17. Update this document when a technology decision changes.


16. FINAL RECOMMENDED STACK

For the first implementation, use this stack:

Frontend:
React + TypeScript + Vite
Leaflet + React-Leaflet
Recharts
CSS Modules or a consistent lightweight CSS approach

Backend:
Python + FastAPI
Pydantic
SQLAlchemy
Alembic
Psycopg

Database:
PostgreSQL + PostGIS

Satellite processing:
ESA SNAP
GDAL
Rasterio
GeoPandas
Shapely
NumPy
SciPy only when required

Raster delivery:
GeoTIFF / Cloud Optimized GeoTIFF where suitable
TiTiler or a compatible raster tile service if needed
GeoJSON for initial lake-boundary overlays

Development:
Git + GitHub
Python virtual environment
Node.js LTS + npm
Docker Compose optionally

This stack is intended to keep the first version practical, modular and scientifically focused.

END OF TECHNOLOGY STACK DOCUMENT
