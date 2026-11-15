Product Requirements Document (PRD)

Project Name

South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment
Platform

1. Project Overview

The South Lhonak Glacial Lake Monitoring and GLOF Susceptibility
Assessment Platform is a satellite-based geospatial monitoring
application designed to observe changes in glacial lakes and assess
environmental factors associated with Glacial Lake Outburst Flood (GLOF)
susceptibility.

The project focuses on South Lhonak Lake, located in North Sikkim,
India.

Glacial lakes can change in area and water level due to glacier melting,
precipitation and other environmental processes. Some lakes are
naturally dammed by unstable moraine deposits. Failure of these natural
dams can cause Glacial Lake Outburst Floods, potentially resulting in
severe downstream damage.

South Lhonak Lake experienced a major GLOF event on 4 October 2023.

This platform aims to use satellite observations, geospatial analysis
and supporting environmental datasets to monitor lake changes, visualize
historical observations and provide preliminary GLOF susceptibility
information.

The platform should be developed as a functional scientific monitoring
system rather than merely a visualization dashboard.

2. Problem Statement

Monitoring glacial lakes in remote mountainous regions is challenging
because of difficult terrain, limited ground accessibility and changing
environmental conditions.

Traditional monitoring methods may not provide sufficiently frequent or
geographically extensive observations.

Satellite remote sensing provides an opportunity to observe these lakes
over different dates and analyze changes in their physical
characteristics.

However, satellite imagery alone is not sufficient. The imagery must be
processed, analyzed and converted into meaningful geospatial
information.

The project addresses the following problems:

-   Difficulty in monitoring glacial lake boundary changes.
-   Lack of an integrated interface for comparing satellite
    observations.
-   Difficulty in calculating and visualizing lake area changes.
-   Limited accessibility to historical lake observations in one
    platform.
-   Need to understand environmental factors associated with GLOF
    susceptibility.
-   Difficulty in visualizing potential downstream exposure.

3. Project Objectives

The primary objectives are:

1.  Develop a satellite-based glacial lake monitoring platform.
2.  Extract lake boundaries from SAR satellite imagery.
3.  Automatically or semi-automatically calculate lake surface area.
4.  Compare lake conditions across different observation dates.
5.  Identify lake expansion and reduction.
6.  Generate historical lake area change visualizations.
7.  Analyze environmental and terrain factors associated with GLOF
    susceptibility.
8.  Visualize downstream drainage pathways and exposed areas where
    supporting data is available.
9.  Develop an interactive geospatial dashboard.
10. Support the integration of future satellite observations,
    particularly NISAR.

4. Study Area

Primary Study Area: South Lhonak Lake

Location: North Sikkim, Sikkim, India.

Approximate Geographic Coordinates: - Latitude: 27.9144 degrees N -
Longitude: 88.1836 degrees E

The initial application will focus on South Lhonak Lake.

The system architecture should allow additional glacial lakes to be
incorporated in future versions.

5. Target Users

The intended users include:

-   Researchers studying glaciers and glacial lakes.
-   Environmental monitoring organizations.
-   Remote sensing and GIS students.
-   Disaster management researchers.
-   Scientific institutions and academic organizations.

The application should present complex geospatial analysis in an
understandable and interactive manner.

6. Satellite Data Requirements

6.1 Primary Satellite Mission

NASA-ISRO Synthetic Aperture Radar (NISAR)

NISAR is the primary mission of interest for the project’s satellite
monitoring component.

The application should support the integration of NISAR observations for
future lake monitoring and surface change analysis.

6.2 Historical Satellite Data

Sentinel-1 SAR

Sentinel-1 will be used for historical observations, particularly the
2023 South Lhonak GLOF event.

Initially available datasets:

  Observation date    Purpose
  ------------------- -----------------------
  28 September 2023   Pre-GLOF observation
  10 October 2023     Post-GLOF observation

Both datasets are Sentinel-1 GRD-HD dual-polarization products
containing VV and VH polarization data.

Their acquisition geometry and metadata must be verified before
quantitative comparison.

6.3 Supporting Data

The application may also integrate:

-   Sentinel-2 optical imagery.
-   Landsat historical imagery.
-   Digital Elevation Models (DEM).
-   SWOT or ICESat-2 elevation observations where suitable.
-   Glacier and moraine information.
-   Hydrological and drainage datasets.
-   Downstream population and infrastructure datasets.

6.4 Data Sources

Potential data providers include:

-   Alaska Satellite Facility (ASF).
-   NASA Earthdata.
-   Copernicus Data Space.
-   ISRO and other authoritative geospatial data providers.

Important Mission Limitation

NISAR launched in 2025 and cannot provide imagery from September or
October 2023.

Therefore, historical event analysis must use suitable historical
satellite missions such as Sentinel-1, while NISAR observations can
support monitoring during its operational period.

7. Core Functional Requirements

7.1 Satellite Data Ingestion

The application must support:

-   Importing satellite datasets.
-   Reading satellite product metadata.
-   Identifying acquisition dates.
-   Identifying polarization bands.
-   Validating dataset compatibility.
-   Managing multiple observation dates.
-   Preserving original satellite datasets.

The system should be designed to support additional observations in the
future.

7.2 Satellite Image Processing

The processing engine must support suitable SAR preprocessing
operations, including:

-   Radiometric calibration.
-   Speckle filtering.
-   Terrain correction.
-   Georeferencing.
-   Spatial alignment.
-   Study area extraction.
-   Water-body identification.

Processing methods must account for terrain shadows, snow, radar
geometry and other possible classification errors.

7.3 Lake Boundary Extraction

The application should identify the water body in satellite imagery and
generate a georeferenced lake boundary polygon.

Requirements:

-   Detect the lake boundary.
-   Generate a polygon representation.
-   Display the boundary on an interactive map.
-   Allow comparison between different observation dates.
-   Store the generated boundary for historical analysis.

The system should support automatic or semi-automatic detection with
visual validation.

7.4 Lake Area Calculation

Calculate lake surface area for each processed observation.

Required outputs:

-   Area in square metres.
-   Area in hectares.
-   Area in square kilometres.
-   Previous observation area.
-   Latest observation area.
-   Absolute area difference.
-   Percentage change.

Calculations must use the actual processed geospatial boundaries and an
appropriate area calculation method.

7.5 Lake Change Detection

The application should compare lake observations across different dates.

It must identify:

-   Lake expansion.
-   Lake reduction.
-   Boundary displacement.
-   Changes in surface area.

Required comparison outputs:

1.  Before-and-after satellite imagery.
2.  Lake boundary overlays.
3.  Difference maps.
4.  Expansion and reduction visualization.
5.  Area comparison statistics.

Users should be able to select two dates for comparison.

7.6 Historical Monitoring

Maintain a historical record of processed observations.

For each observation, store:

-   Satellite mission.
-   Sensor.
-   Acquisition date.
-   Polarization.
-   Lake boundary.
-   Calculated lake area.
-   Processing information.
-   Data quality information.

Display historical lake area changes using time-series charts.

7.7 GLOF Susceptibility Assessment

The platform should provide preliminary GLOF susceptibility assessment
using available environmental and geospatial information.

Potential assessment factors:

Lake characteristics: - Lake surface area. - Lake expansion rate. -
Water surface elevation changes, where reliable measurements exist.

Surrounding terrain: - Slope. - Elevation. - Glacier proximity. -
Potential avalanche and landslide source areas.

Natural dam characteristics: - Moraine dam structure. - Dam height. -
Freeboard, where measurable. - Available evidence of dam instability.

Downstream exposure: - Drainage pathways. - Potential flood flow
paths. - Downstream settlements. - Infrastructure and other exposed
assets.

The assessment should explain the indicators used and their data
sources.

The platform must not interpret lake expansion alone as evidence of an
imminent GLOF.

It must distinguish preliminary susceptibility assessment from validated
flood forecasting and official early-warning systems.

7.8 Downstream Exposure Visualization

Where sufficient terrain and exposure data are available, the
application should:

-   Display downstream drainage pathways.
-   Analyze terrain-based potential flow routes.
-   Identify potentially exposed settlements and infrastructure.
-   Display relevant information on an interactive map.

Any modeled flood pathways must be clearly labeled as preliminary
terrain-based analysis unless validated hydraulic modeling is available.

8. Application Dashboard Requirements

The application should provide a modern, professional and interactive
geospatial dashboard.

8.1 Overview Dashboard

Display:

-   Study area location.
-   Latest available observation date.
-   Latest detected lake area.
-   Previous lake area.
-   Area difference.
-   Percentage change.
-   Latest satellite mission.
-   Processing status.

All displayed measurements must come from actual processed datasets.

8.2 Satellite Explorer

Provide:

-   Interactive satellite map.
-   Satellite image visualization.
-   Lake boundary overlay.
-   Observation date selection.
-   VV and VH layer visualization where available.
-   Zoom and pan controls.
-   Map layer selection.

8.3 Before-and-After Comparison

Allow users to:

-   Select an earlier observation.
-   Select a later observation.
-   View both satellite images.
-   Compare lake boundaries.
-   Use a swipe comparison interface.
-   Visualize expansion and reduction.
-   View calculated area differences.

8.4 Lake Change Analysis

Display:

-   Historical lake area chart.
-   Date-wise area measurements.
-   Expansion and reduction trends.
-   Percentage changes.
-   Comparison statistics.

8.5 GLOF Susceptibility Dashboard

Display:

-   Lake characteristics.
-   Terrain and slope information.
-   Moraine dam indicators.
-   Potential triggering sources.
-   Downstream drainage pathways.
-   Exposure information.

Clearly communicate data availability, confidence and limitations.

8.6 Historical Observations

Provide a date-wise list of satellite observations.

Users should be able to select an observation and view its corresponding
processed results.

8.7 Data Sources

Provide information about:

-   Satellite mission.
-   Sensor.
-   Dataset.
-   Observation date.
-   Data provider.
-   Polarization.
-   Processing status.
-   Source information.

9. Live Monitoring Requirements

The platform should be designed for ongoing satellite-based monitoring.

It should display the latest available satellite observation rather than
a continuous live video feed.

Requirements:

-   Show the latest available observation.
-   Display the actual acquisition date.
-   Support importing new satellite datasets.
-   Process newly added observations.
-   Update the dashboard after successful processing.
-   Preserve previous observations.
-   Support future integration of NISAR data.

The application may later support automated satellite data discovery and
scheduled processing.

It must never display fabricated live observations or misleading
timestamps.

10. Non-Functional Requirements

Performance

-   Handle large satellite datasets efficiently.
-   Avoid unnecessary loading of complete scenes into memory.
-   Support efficient raster processing.
-   Optimize map and image visualization.

Reliability

-   Preserve original datasets.
-   Maintain processing logs.
-   Provide meaningful error messages.
-   Validate processing results.
-   Avoid displaying unverified measurements.

Scalability

-   Support multiple observation dates.
-   Allow additional satellite missions.
-   Support future integration of additional glacial lakes.
-   Keep processing modules reusable.

Usability

-   Provide a clean interface.
-   Make maps interactive.
-   Present scientific information clearly.
-   Use understandable charts and statistics.
-   Support responsive layouts.

Maintainability

-   Use modular code.
-   Separate frontend, backend and processing logic.
-   Document important functions.
-   Maintain a consistent project structure.

11. Expected Technology Direction

The final technology stack should be established in the architecture
document.

Potential technologies include:

Satellite Processing: - Python. - ESA SNAP. - GDAL. - Rasterio. -
GeoPandas. - NumPy. - SciPy.

Backend: - Python. - FastAPI.

Frontend: - React. - TypeScript.

Geospatial Visualization: - Leaflet or MapLibre.

Charts: - Plotly or Recharts.

Database: - PostgreSQL with PostGIS, or another justified geospatial
storage solution.

The selected technologies must be suitable for large geospatial datasets
and scientific processing.

12. Expected Project Deliverables

The completed platform should provide:

1.  A functional satellite data ingestion system.
2.  A SAR satellite preprocessing pipeline.
3.  Georeferenced lake boundary polygons.
4.  Lake area calculations.
5.  Before-and-after satellite comparison.
6.  Lake expansion and reduction maps.
7.  Historical lake area charts.
8.  Preliminary GLOF susceptibility indicators.
9.  Terrain and downstream exposure visualization where data permits.
10. An interactive web application.
11. A reusable workflow for future satellite observations.
12. Technical and scientific documentation.

13. Project Development Phases

Phase 1: Planning and Architecture - Finalize project architecture. -
Define technology stack. - Design processing methodology. - Identify
data requirements.

Phase 2: Satellite Data Inspection - Inspect Sentinel-1 datasets. -
Verify metadata. - Evaluate acquisition compatibility.

Phase 3: Satellite Processing - Preprocess SAR imagery. - Extract lake
boundaries. - Calculate lake area.

Phase 4: Change Analysis - Compare observations. - Generate difference
maps. - Create historical area statistics.

Phase 5: GLOF Susceptibility Analysis - Analyze lake characteristics. -
Integrate terrain and moraine data. - Assess downstream exposure.

Phase 6: Backend Development - Develop APIs. - Manage observation
records. - Serve geospatial outputs.

Phase 7: Frontend Development - Build dashboard pages. - Integrate
interactive maps. - Develop comparison tools and charts.

Phase 8: Integration and Testing - Connect processing outputs to the
dashboard. - Validate calculations. - Test the complete application.

Phase 9: Future Monitoring Integration - Prepare NISAR data
integration. - Support new satellite observations. - Develop repeatable
monitoring workflows.

14. Project Success Criteria

The project will be considered successful when:

-   It can ingest and inspect real satellite datasets.
-   It can produce valid georeferenced lake boundaries.
-   It can calculate lake areas from actual satellite observations.
-   It can compare observations from different dates when geometrically
    compatible.
-   It can visualize actual lake changes.
-   It can present historical observations.
-   It can display scientifically grounded GLOF susceptibility
    indicators.
-   It can visualize downstream exposure where adequate supporting data
    exists.
-   Its dashboard is connected to real processing outputs.
-   Its processing workflow can be reused for future observations.

15. Scope Limitations

The initial version focuses on South Lhonak Lake.

The first historical comparison will use the available Sentinel-1
observations from September 28 and October 10, 2023, subject to
acquisition compatibility and data quality.

The platform is a research and monitoring application.

It is not initially intended to: - Replace official disaster management
systems. - Provide certified GLOF warnings. - Predict an exact GLOF
occurrence date. - Guarantee flood prediction accuracy. - Claim
real-time monitoring when no new satellite observation is available.

All measurements, models and assessments must clearly communicate their
sources, assumptions and limitations.

16. Final Product Vision

The final product should be a complete satellite-based glacial lake
monitoring platform that transforms raw satellite observations into
useful scientific information.

A user should be able to open the application, view South Lhonak Lake,
select two observation dates, compare satellite imagery, inspect lake
boundaries, understand changes in lake area, explore historical trends
and examine environmental factors associated with GLOF susceptibility.

The platform should be extensible to future NISAR observations and
additional glacial lakes.

Core principle: Real satellite data, scientifically valid processing,
transparent analysis and an interactive monitoring experience.
