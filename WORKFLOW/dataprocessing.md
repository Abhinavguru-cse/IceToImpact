# Data Processing Workflow
## South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform

## 1. Purpose

This document defines the proposed data-processing workflow for the South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform.

It describes the processing stages, inputs, outputs, validation requirements, and how processing results are made available to the application.

**This document contains workflow and structure only. It does not contain actual satellite imagery, InSAR files, training data, labels, lake boundaries, area measurements, model outputs, or risk scores.** The project's actual datasets will be maintained separately and referenced by metadata and file paths.

The workflow must be finalized against the actual downloaded datasets. In particular, the available InSAR files must be inspected before deciding which InSAR-specific processing steps and features are applicable.

## 2. Processing Principles

1. Preserve original source files without modifying them.
2. Keep raw, intermediate, and final processed outputs in separate locations.
3. Record the source files, processing parameters, software versions, and processing time for every output.
4. Verify product metadata before combining observations from different dates.
5. Do not assume that two satellite observations are directly comparable until their acquisition and processing characteristics have been checked.
6. Keep measured results separate from estimates, model predictions, and preliminary indicators.
7. Validate lake boundaries and area calculations before displaying them as scientific results.
8. Do not generate or display fabricated imagery, measurements, labels, risk scores, or hazard zones.
9. Make processing failures and data-quality limitations visible to the application.
10. Treat the platform as a research and monitoring tool, not an official early-warning system.

## 3. High-Level Processing Pipeline

```text
External Data Sources
        |
        v
Data Ingestion
        |
        v
File Inventory and Metadata Inspection
        |
        v
Data Quality Checks
        |
        +------------------------------+
        |                              |
        v                              v
Sentinel-1 SAR Workflow          InSAR Data Workflow
        |                              |
        v                              v
SAR Preprocessing                InSAR Product Inspection
        |                              |
        v                              v
Radar Layer Preparation          Applicable InSAR Processing
        |                              |
        +---------------+--------------+
                        |
                        v
              Lake Boundary Extraction
                        |
                        v
               Boundary Validation
                        |
                        v
                Lake Area Calculation
                        |
                        v
             Multi-Date Change Analysis
                        |
                        v
              Training Data Preparation
                        |
                        v
                 Model Development
                        |
                        v
            Susceptibility Assessment
                        |
                        v
             Output Validation and Review
                        |
                        v
              Database Registration
                        |
                        v
              Dashboard Visualization
```

Not every dataset must pass through every branch. The actual workflow depends on the product type, quality, coverage, and intended analysis.

## 4. Data Organization

Keep project files separate from application source code.

Suggested folder structure:

```text
South-Lhonak-Monitoring/
|
+-- docs/
|   +-- PRD.txt
|   +-- architecture.txt
|   +-- design.txt
|   +-- README.txt
|   +-- TECH_STACK.txt
|   +-- database.txt
|   +-- DATA_PROCESSING.txt
|
+-- data/
|   +-- raw/
|   |   +-- sentinel1/
|   |   +-- insar/
|   |   +-- dem/
|   |   +-- supporting_data/
|   |
|   +-- intermediate/
|   |
|   +-- processed/
|   |   +-- radar_layers/
|   |   +-- lake_boundaries/
|   |   +-- area_measurements/
|   |   +-- change_analysis/
|   |   +-- insar_outputs/
|   |   +-- susceptibility_outputs/
|   |
|   +-- training/
|   |   +-- features/
|   |   +-- labels/
|   |   +-- datasets/
|   |
|   +-- models/
|   |
|   +-- manifests/
|
+-- frontend/
+-- backend/
+-- processing/
+-- database/
+-- README.txt
```

Folder names are proposed organization only. Adjust them to match the actual files and storage arrangement. Large source files should not be committed to the application source-code repository unless the project explicitly chooses an appropriate data-versioning approach.

## 5. Data Ingestion

### 5.1 Purpose

Register external data files so that the processing system can locate, inspect, and track them.

### 5.2 Input Categories

The system may receive:

- Sentinel-1 SAR products.
- InSAR source files or derived products.
- Digital Elevation Model (DEM) files.
- Supporting geospatial datasets.
- Training features and labels, if available.
- Model files created during model development.

These are supported input categories, not a claim that every category is currently available.

### 5.3 Ingestion Steps

1. Place or upload the source file into the designated raw-data storage location.
2. Preserve the original filename and directory structure where practical.
3. Identify the file format and product type.
4. Extract available metadata.
5. Check whether the file can be opened and read.
6. Calculate a checksum when practical to help identify file changes or duplicates.
7. Register the file in the database using its storage reference and metadata.
8. Record the ingestion status.

### 5.4 Expected Output

- Registered file reference.
- File metadata.
- File-integrity status.
- Ingestion status and timestamp.

The ingestion process must not silently overwrite an existing source file.

## 6. Metadata Inspection and Data Quality Checks

Before processing, inspect the metadata of every observation and relevant file.

### 6.1 Sentinel-1 Metadata to Inspect

Where available, inspect:

- Mission and sensor.
- Product identifier.
- Product type.
- Acquisition date and time.
- Orbit direction.
- Relative orbit.
- Acquisition mode.
- Polarization channels.
- Spatial coverage.
- Pixel spacing and resolution information.
- Coordinate reference information.
- Processing baseline or product-generation information.
- Calibration and noise-related metadata.

The exact fields depend on the downloaded product.

### 6.2 InSAR Metadata to Inspect

The exact inspection checklist depends on whether the supplied files are raw SAR scenes, single-look complex products, interferograms, coherence products, displacement products, or another format.

Where applicable, inspect:

- Input scene identifiers.
- Acquisition dates and temporal separation.
- Orbit information.
- Polarization.
- Processing software and version.
- Reference and secondary scene information.
- Coordinate reference system.
- Pixel spacing.
- Phase or coherence product information.
- Unwrapping or geocoding information, if applicable.
- NoData areas and spatial coverage.

Do not assume that every item applies to every InSAR file.

### 6.3 General Quality Checks

- Confirm that files are readable.
- Confirm that metadata is available and internally consistent.
- Check spatial coverage against the study region.
- Check for missing or invalid raster values.
- Check coordinate reference systems.
- Check for duplicate files or duplicate observations.
- Check whether required polarization or product components are present.
- Record any quality limitations.

### 6.4 Output

A metadata and quality report for each registered input. Files that fail required checks should be marked as unsuitable for the affected processing task rather than processed as if they were valid.

## 7. Sentinel-1 SAR Processing Workflow

This section describes a general workflow for preparing Sentinel-1 SAR imagery. The exact processing sequence and parameters must be selected after inspecting the downloaded product type and metadata.

### 7.1 Product Verification

1. Confirm the product type and sensor.
2. Confirm the acquisition date and coverage.
3. Confirm available polarization channels.
4. Confirm orbit and acquisition characteristics.
5. Confirm that the product is suitable for the intended analysis.

Do not assume that a product contains VV and VH until the metadata confirms it.

### 7.2 SAR Preprocessing

A possible preprocessing sequence for suitable Sentinel-1 products may include:

1. Apply precise orbit information where required and available.
2. Remove thermal noise where applicable.
3. Perform radiometric calibration.
4. Apply border-noise handling where applicable.
5. Apply speckle filtering only when justified by the analysis.
6. Perform terrain correction or geocoding using a suitable DEM.
7. Convert or represent backscatter in the required scale, such as linear power or decibels, while recording the chosen representation.
8. Clip or mask the result to the study area when appropriate.
9. Export the processed layers in a geospatial raster format.

Not every step is appropriate for every product. Processing parameters must be documented and kept consistent when comparing observations.

### 7.3 Radar Layer Preparation

Prepare separate layers for each confirmed polarization channel.

The application may provide:

- VV layer, when available.
- VH layer, when available.
- A derived visualization or composite, if scientifically justified.

For each output, record:

- Source observation.
- Polarization.
- Processing workflow and version.
- Output file reference.
- Coordinate reference system.
- Pixel spacing.
- NoData handling.
- Display stretch or visualization settings.

Display settings should not be confused with calibrated measurement values.

### 7.4 SAR Processing Outputs

- Georeferenced radar raster layers.
- Processing metadata.
- Quality-control information.
- File references for dashboard visualization.

## 8. InSAR Data Processing Workflow

### 8.1 Important Requirement

The project's InSAR files are maintained separately from the documentation and application database. This document does not assume their exact format or contents.

Before implementing this workflow, inspect the files and classify them as one or more of the following:

- Raw SAR data.
- Single-look complex (SLC) scenes.
- Interferograms.
- Coherence products.
- Unwrapped phase products.
- Displacement products.
- Geocoded raster products.
- Other derived InSAR products.

The categories above are examples for file classification. They do not describe confirmed contents of the project's dataset.

### 8.2 Workflow Selection

The processing path must depend on the identified product type.

**If raw SAR or SLC scenes are supplied:**

- Verify compatibility of the input scenes.
- Inspect acquisition dates, orbit information, polarization, and coverage.
- Determine whether the scene pair is suitable for the intended interferometric analysis.
- Select an appropriate InSAR processing workflow and software.
- Record all processing parameters and quality checks.

**If derived InSAR products are supplied:**

- Identify the product type and processing history.
- Verify coordinate reference system, spatial coverage, pixel spacing, and NoData handling.
- Confirm units and interpretation of the raster values.
- Check whether the product is geocoded and suitable for the intended analysis.
- Avoid reprocessing a derived product as if it were a raw scene.

**If both raw and derived products are supplied:**

- Preserve both categories separately.
- Record source-to-output relationships.
- Avoid mixing products with incompatible processing histories.

### 8.3 Potential InSAR Uses

Depending on the actual data and scientific suitability, InSAR products may support:

- Surface deformation analysis.
- Ground or terrain movement investigation.
- Temporal comparison of derived products.
- Feature generation for a research model.

InSAR observations alone should not be treated as proof that a glacial lake is about to fail. Any interpretation must account for data limitations, uncertainty, spatial coverage, and independent validation.

### 8.4 InSAR Outputs

Only outputs supported by the actual data and selected method should be produced. Each output must have:

- Source file references.
- Processing method and software version.
- Acquisition information.
- Units and value interpretation.
- Coordinate reference system.
- Quality information.
- Limitations and uncertainty notes where applicable.

## 9. Lake Boundary Extraction

### 9.1 Purpose

Identify the lake's spatial boundary from suitable georeferenced observations.

### 9.2 Possible Processing Steps

1. Select a quality-checked radar observation.
2. Prepare the relevant radar layer or other validated input.
3. Apply a lake-detection method appropriate to the data.
4. Generate a candidate lake mask.
5. Convert the mask into vector polygons.
6. Remove invalid geometries and apply justified geometry cleanup.
7. Review the candidate boundary against the source imagery and other suitable reference information.
8. Store the accepted boundary as a versioned output.
9. Record the source observation and extraction method.

A threshold-based method, classification method, or machine-learning method may be evaluated. The method must be selected through testing and validation, not assumed in advance.

### 9.3 Boundary Validation

Check:

- Whether the polygon corresponds to the lake in the source observation.
- Whether the boundary is complete within the available coverage.
- Whether cloud-free or radar-quality limitations are relevant.
- Whether terrain shadow, layover, speckle, or other SAR effects may affect detection.
- Whether polygon geometry is valid.
- Whether the output coordinate reference system is correct.
- Whether the boundary is consistent with available reference information.

### 9.4 Output

A georeferenced lake-boundary vector file, together with method, source, version, and quality metadata.

## 10. Lake Area Calculation

### 10.1 Purpose

Calculate the surface area represented by an accepted lake boundary.

### 10.2 Processing Steps

1. Select a validated lake boundary.
2. Verify its coordinate reference system.
3. Use an appropriate area-calculation method, preferably one that accounts for the geographic location and projection.
4. Calculate the polygon area.
5. Record the numerical result and unit.
6. Record the calculation method and source boundary.
7. Retain uncertainty or quality information when it can be supported.

### 10.3 Output

- Area measurement.
- Measurement unit.
- Observation reference.
- Boundary version reference.
- Calculation method.
- Quality or uncertainty metadata, when available.

Do not enter estimated or placeholder areas as measured values.

## 11. Multi-Date Comparison and Change Analysis

### 11.1 Purpose

Compare observations from different dates to investigate changes in radar appearance, lake boundary, and lake area.

### 11.2 Comparability Checks

Before comparing observations, verify:

- Product type compatibility.
- Acquisition mode and polarization compatibility.
- Orbit and viewing geometry.
- Spatial coverage.
- Coordinate reference system.
- Pixel spacing and alignment.
- Preprocessing method and parameter consistency.
- Data quality and missing-data regions.
- Seasonal, environmental, or acquisition differences that may affect interpretation.

A difference between two images may be caused by acquisition or processing differences, not necessarily by a physical change.

### 11.3 Comparison Steps

1. Select two observations for the same study region.
2. Verify that they are suitable for comparison.
3. Prepare consistently processed radar layers.
4. Align layers spatially where required.
5. Compare the radar layers using a documented method.
6. Compare the validated lake boundaries.
7. Calculate area differences from the corresponding area measurements.
8. Generate a change layer or chart only when the inputs and method support it.
9. Record limitations and quality information.

### 11.4 Output

- Before-and-after radar layer references.
- Boundary comparison.
- Area comparison.
- Optional difference raster or vector layer.
- Comparison metadata and quality notes.

The dashboard must identify the observation dates and must not present an unvalidated image difference as a confirmed physical event.

## 12. Training Dataset Preparation

### 12.1 Purpose

Prepare a traceable dataset for machine-learning experiments, if the available data supports a clearly defined learning task.

### 12.2 Dataset Inventory

Before creating a training dataset, identify:

- Available input files.
- Data formats and spatial resolution.
- Observation dates and temporal coverage.
- Available feature layers.
- Whether labels or reference targets exist.
- Label source and reliability.
- Missing data and coverage gaps.
- Whether multiple files represent the same acquisition or location.

Do not assume that labels are available. Do not create ground-truth labels from model predictions and then use those predictions as independent truth.

### 12.3 Feature Preparation

Potential feature groups may include:

- SAR backscatter-derived features.
- Confirmed InSAR-derived features.
- Terrain-derived features from suitable DEM data.
- Lake geometry or area-related features.
- Other supporting geospatial variables, if available and justified.

The actual feature list must be based on the supplied datasets and the defined model objective.

For every feature, document:

- Feature name.
- Source asset.
- Processing method.
- Units.
- Spatial and temporal resolution.
- Missing-value handling.
- Any normalization or transformation.

### 12.4 Label Preparation

If labels are available:

1. Identify the label source.
2. Document how labels were created.
3. Check spatial and temporal alignment with input features.
4. Review label quality and uncertainty.
5. Store label files separately from feature files.
6. Record the label version and provenance.

If reliable labels are not available, do not claim that a supervised model can be trained and validated. Consider whether another research approach is appropriate only after the task and available data are reviewed.

### 12.5 Dataset Splitting

When a suitable dataset exists:

- Define training, validation, and test partitions.
- Avoid leakage between related observations.
- Consider spatial and temporal separation where appropriate.
- Record the split method and random seed when applicable.
- Keep the test set separate from model development and tuning.
- Store split definitions in dataset metadata.

A random split alone may be unsuitable for spatial or time-series data if nearby or related samples occur in both training and test sets.

### 12.6 Output

- Feature dataset references.
- Label dataset references, if available.
- Dataset manifest.
- Dataset version.
- Split definition.
- Data-quality and provenance information.

## 13. Model Development and Evaluation

### 13.1 Model Objective

Define the exact prediction or classification task before choosing a model. The objective must state what the model predicts, the spatial and temporal scale, and how its output will be interpreted.

A GLOF-related susceptibility model must not be described as a real-time breach prediction or operational warning system unless a suitable validated methodology and authority-supported operational framework exist.

### 13.2 Model Development Steps

1. Confirm that the dataset is suitable for the stated task.
2. Establish a baseline method.
3. Select candidate algorithms appropriate to the data and task.
4. Train using the training partition.
5. Tune using the validation partition.
6. Evaluate once against the held-out test partition.
7. Compare against the baseline.
8. Record metrics, limitations, and uncertainty.
9. Register the model version and associated dataset version.
10. Store model files outside the database and register their file references.

### 13.3 Evaluation

Choose metrics appropriate to the task and label structure. Possible metric families include:

- Classification metrics.
- Regression metrics.
- Spatial overlap metrics for segmentation.
- Calibration or uncertainty measures, where appropriate.

The selected metrics and evaluation protocol must be documented. Do not report performance values until the model has actually been evaluated.

### 13.4 Reproducibility

Record:

- Model name and version.
- Dataset name and version.
- Feature definitions.
- Training configuration.
- Software and library versions.
- Evaluation method.
- Evaluation results.
- Known limitations.
- Model artifact reference.

## 14. GLOF Susceptibility and Hazard-Related Outputs

### 14.1 Separate Different Types of Outputs

The application must clearly distinguish:

1. **Observed measurements:** values calculated from actual observations, such as a validated lake boundary or area.
2. **Derived indicators:** values calculated from documented input data and a defined method.
3. **Model-based susceptibility outputs:** predictions from a trained and evaluated model, with limitations stated.
4. **Terrain-based preliminary screening:** exploratory analysis based on terrain or drainage information.
5. **Validated inundation modelling:** outputs from an appropriate flood/inundation model with documented inputs and validation.
6. **Official hazard information:** information published by the relevant responsible authority.

These categories must not be presented as interchangeable.

### 14.2 Processing Requirements

Before creating susceptibility or hazard-related outputs:

- Define the assessment objective.
- Identify the input datasets.
- Verify their spatial and temporal suitability.
- Document the scientific method.
- Record assumptions and limitations.
- Validate outputs using appropriate independent information where available.
- Store outputs as separate, versioned assets.
- Label preliminary outputs clearly in the user interface.

### 14.3 Danger-Zone Display

A map layer must only be described as an official hazard zone or validated inundation zone when its source and validation support that description.

If the available work supports only preliminary terrain screening or downstream exposure analysis, label it accordingly. Do not invent evacuation routes, danger boundaries, flood depths, arrival times, or warning levels.

## 15. Output Storage and Database Registration

After processing, save output files outside the database and register their metadata.

For each output, record as applicable:

- Output identifier.
- Region and observation references.
- Source asset references.
- Output category.
- File path or storage URI.
- File format and size.
- Coordinate reference system.
- Processing method and version.
- Processing parameters.
- Creation time.
- Quality status.
- Validation status.

The database stores metadata and references. Large raster files, training files, and model artifacts remain in file or object storage.

## 16. Backend Processing Integration

The backend should coordinate processing tasks without performing every geospatial operation inside an API request.

Suggested flow:

1. The frontend submits a processing request.
2. The backend validates the request and referenced inputs.
3. The backend creates a processing-job record.
4. A processing worker executes the task.
5. The worker records progress and errors.
6. Outputs are written to the designated storage location.
7. Output metadata is registered in the database.
8. The job status is updated.
9. The frontend retrieves the status and displays completed outputs.

Long-running processing should use a background worker or job queue when required.

## 17. Dashboard Data Delivery

The dashboard should receive processed outputs through backend APIs or a suitable geospatial tile service.

Possible application outputs include:

- Observation catalogue and available dates.
- Radar layer references and display metadata.
- VV and VH layer options when present.
- Lake boundary layers.
- Lake area measurements and historical trends.
- Before-and-after comparison outputs.
- InSAR-derived layers when available and validated for display.
- Susceptibility or hazard-related layers with clear status labels.
- Processing and data-quality status.

For large raster layers, consider serving Cloud Optimized GeoTIFFs or using a tile service. The choice should be based on the hosting and performance requirements.

## 18. Error Handling

The processing system should handle:

- Missing files.
- Corrupt or unreadable files.
- Unsupported formats.
- Missing metadata.
- Incompatible observations.
- Invalid coordinate reference systems.
- Insufficient spatial coverage.
- Processing timeouts.
- Invalid geometries.
- Empty or unusable outputs.
- Worker failures.
- Storage failures.

For each failed job:

1. Set the job status to failed.
2. Record a useful error message.
3. Preserve the original source files.
4. Avoid registering incomplete outputs as successful results.
5. Allow a corrected job to be submitted without losing the previous job history.

## 19. Validation and Testing Checklist

### Input Validation
- [ ] Source files can be opened.
- [ ] File metadata has been inspected.
- [ ] Acquisition dates and identifiers are recorded.
- [ ] Coordinate reference systems are known where relevant.
- [ ] Spatial coverage is suitable for the intended task.
- [ ] Missing and invalid values are identified.

### SAR Processing
- [ ] Product type and polarization are confirmed.
- [ ] Processing sequence is appropriate for the product.
- [ ] Processing parameters are recorded.
- [ ] Output layers are georeferenced.
- [ ] Output values and visualization settings are not confused.

### InSAR Processing
- [ ] Actual InSAR file types are identified.
- [ ] Input compatibility is checked.
- [ ] Units and value interpretation are confirmed.
- [ ] Processing history is recorded.
- [ ] Quality limitations are documented.

### Lake Boundary and Area
- [ ] Boundary is checked against source imagery.
- [ ] Geometry is valid.
- [ ] Coordinate reference system is correct.
- [ ] Area method and units are recorded.
- [ ] Uncertainty and limitations are recorded where possible.

### Multi-Date Analysis
- [ ] Observations are suitable for comparison.
- [ ] Spatial alignment is checked.
- [ ] Processing methods are consistent where required.
- [ ] Differences are not automatically interpreted as physical changes.
- [ ] Comparison dates and source observations are displayed.

### Machine Learning
- [ ] Model objective is defined.
- [ ] Feature sources and processing are documented.
- [ ] Label provenance is documented, if labels exist.
- [ ] Data leakage risks are addressed.
- [ ] Test data is held out from model tuning.
- [ ] Evaluation metrics are appropriate.
- [ ] Model limitations are documented.

### Application Integration
- [ ] Outputs are registered in the database.
- [ ] File references resolve correctly.
- [ ] Processing status is accurate.
- [ ] Map layers display in the correct location.
- [ ] Unavailable or invalid outputs are not shown as successful results.

## 20. Software and Tools

The following tools may be used depending on the selected workflow:

- ESA SNAP for suitable Sentinel-1 processing workflows.
- GDAL for raster and geospatial data operations.
- Rasterio for raster reading and writing.
- GeoPandas for vector data operations.
- Shapely for geometry operations.
- NumPy for numerical array operations.
- PostgreSQL and PostGIS for metadata and spatial vector storage.
- Python for processing automation.
- FastAPI for backend integration.
- A suitable map library and raster tile service for frontend visualization.

Tool selection must be confirmed against the actual data formats, product types, operating environment, and required processing operations.

## 21. Implementation Phases

### Phase 1: Dataset Inventory
- Locate all source files.
- Identify file types and metadata.
- Separate Sentinel-1, InSAR, DEM, supporting, and training assets.
- Create an inventory and quality report.

### Phase 2: Sentinel-1 Processing
- Verify product compatibility.
- Build and test the SAR preprocessing workflow.
- Generate georeferenced radar layers.
- Register outputs.

### Phase 3: Lake Monitoring
- Develop lake-boundary extraction.
- Validate boundaries.
- Calculate area.
- Store historical observations and measurements.

### Phase 4: Multi-Date Comparison
- Check observation comparability.
- Align suitable layers.
- Generate boundary, area, and raster comparisons.
- Display historical trends.

### Phase 5: InSAR Workflow
- Inspect the actual InSAR files.
- Select the appropriate processing path.
- Generate only scientifically supported outputs.
- Validate and register the results.

### Phase 6: Model Development
- Define the model objective.
- Inspect feature and label availability.
- Prepare versioned datasets.
- Train and evaluate candidate models.
- Register model metadata and artifacts.

### Phase 7: Susceptibility and Dashboard Integration
- Produce appropriately qualified assessment outputs.
- Validate map layers and indicators.
- Integrate the outputs into the dashboard.
- Display limitations and data status clearly.

The phases may be adjusted after the source datasets and project requirements are reviewed.

## 22. Items to Confirm Before Finalizing the Workflow

The following information is needed before the detailed processing implementation can be fixed:

- Exact Sentinel-1 product types and metadata.
- Whether both Sentinel-1 observations have compatible acquisition characteristics.
- Exact formats and product types of the InSAR files.
- Whether InSAR files are raw inputs, processed products, or a mixture.
- Whether DEM data is available and which product is intended.
- Whether training labels or reference data are available.
- The exact prediction or classification task intended for the ML model.
- The desired output formats and storage location.
- The validation data available for lake boundaries and model outputs.

Do not choose product-specific processing parameters, InSAR algorithms, model features, or training methods until these items have been reviewed.

## 23. Scope Reminder

This document defines the **data-processing workflow only**. It does not include the project's actual satellite imagery, InSAR data, training datasets, labels, measured lake areas, model weights, risk scores, or hazard maps.

All processing must use the real project files. Every result shown in the application must be traceable to its source data, processing method, and validation status.
