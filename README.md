# IceToImpact: AI-Powered Glacial Lake Monitoring & GLOF Susceptibility Analysis Platform

An end-to-end geospatial monitoring and machine-learning analysis platform for **South Lhonak Glacial Lake (North Sikkim, Eastern Himalayas)**, tracking post-GLOF basin dynamics, multi-temporal surface area evolution, and downstream vulnerability along the Teesta River corridor.

---

## 🛰️ 1. Project Overview & Motivation

On **4 October 2023**, South Lhonak Lake suffered a catastrophic Glacial Lake Outburst Flood (GLOF) triggered by a massive lateral moraine and ice-rock avalanche, causing a moraine breach that drained ~1.13 km² of water into the Teesta River. The flood surge caused widespread destruction downstream, washing away the Chungthang Hydroelectric Dam and inundating civilian settlements.

**IceToImpact** combines multi-mission Synthetic Aperture Radar (SAR) remote sensing, unsupervised Gaussian Mixture Model (GMM) segmentation, digital elevation modelling, and downstream exposure analytics to provide a scientific observation dashboard.

---

## 🏛️ 2. System Architecture

```
IceToImpact/
├── frontend/                     # React + TypeScript + Vite Dashboard Architecture
│   ├── src/
│   │   ├── components/           # Header, RadarMap, MetricsOverview, ChangeDetection,
│   │   │                         # TimeSeriesChart, RiskAnalysis, DatasetExplorer
│   │   ├── services/api.ts       # REST client for FastAPI endpoints
│   │   ├── types/index.ts        # Typed TypeScript data schemas
│   │   ├── App.tsx               # Primary application view
│   │   └── main.tsx              # Application bootstrap
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Python + FastAPI RESTful Microservice
│   └── app/
│       ├── api/v1/endpoints/     # Modular route endpoints
│       │   ├── health.py         # System health & database status
│       │   ├── observations.py   # Observation metadata catalog
│       │   ├── lake.py           # Metrics, boundaries, timeseries, comparisons
│       │   ├── layers.py         # GIS raster & vector layer definitions
│       │   ├── risk.py           # GLOF susceptibility & exposure indicators
│       │   ├── datasets.py       # Integrated dataset catalog
│       │   └── processing.py     # ML processing engine status & parameters
│       ├── core/config.py        # Application configuration & CORS settings
│       ├── db/session.py         # SQLAlchemy ORM session engine
│       ├── schemas/lake.py       # Pydantic data validation schemas
│       ├── static/               # Unified web application assets (Leaflet, JS, CSS)
│       └── main.py               # Application factory & static mounter
├── processing/                   # Geospatial & ML Scientific Pipeline
│   ├── ml_model.py               # SARWaterGMM (EM algorithm) & Otsu thresholding
│   └── lake_processor.py         # Pipeline executing segmentation on 38 scenes
├── database/                     # Spatial Database Engine
│   ├── schema.sql                # PostgreSQL + PostGIS production schema
│   ├── models.py                 # SQLAlchemy database models (PostGIS/SQLite)
│   ├── init_db.py                # Database population and verification script
│   └── icetoimpact.db            # Embedded SQLite development database
├── DATASETS/                     # Preserved Satellite & Geospatial Data
│   └── dataset/
│       ├── rasters_GCOV/         # 37 NISAR Level 2 GCOV products (2025–2026)
│       ├── rasters_S1A/          # Sentinel-1A pre-GLOF baseline (28 Sept 2023)
│       ├── rasters_COP30/        # Copernicus 30m Global DEM
│       └── vectors_OSM/          # 18,760 OpenStreetMap infrastructure elements
├── outputs/                      # Scientific Deliverables & Spatial Outputs
│   ├── boundaries/               # 38 GeoJSON lake boundary polygons
│   ├── layers/                   # 37 Georeferenced radar PNG overlays
│   └── lake_analytics.json       # Calibrated timeseries & landmark comparisons
├── models/                       # Trained ML Parameters
│   └── gmm_water_segmenter.json  # Learned backscatter distributions (EM fit)
├── .env.example                  # Environment configuration template
├── README.md                     # Comprehensive system documentation
├── run_dashboard.py              # Server bootstrap runner
└── run_dashboard.bat             # 1-Click Windows execution launcher
```

---

## 🔬 3. Machine Learning & Scientific Pipeline

### Unsupervised GMM-EM Water Segmentation Baseline
Because satellite radar images over high-mountain proglacial lakes do not possess ground-truth pixel annotations, an **unsupervised statistical learning baseline** was implemented:
- **Expectation-Maximization (EM)** fitting of a 2-component Gaussian Mixture Model across **203,947 SAR backscatter samples**:
  - Calibrated Water Mode: $\mu_{\text{water}} = -11.66\text{ dB}, \sigma^2 = 12.54$
  - Surrounding Land/Debris Mode: $\mu_{\text{land}} = -7.37\text{ dB}, \sigma^2 = 25.00$
  - Fisher Discriminant Ratio (FDR): $0.490$
  - Statistically Optimal Decision Threshold: $T^* = -9.81\text{ dB}$ (Otsu threshold: $-9.09\text{ dB}$)
- **DEM Slope Masking**: Copernicus 30m DEM slope filter eliminates radar shadow and steep mountain terrain ($>15^\circ$).
- **Connected Component Extraction**: 8-neighbor morphological filtering isolates the South Lhonak proglacial basin.
- **Geospatial Polygonal Delineation**: Contours converted to closed polygon boundaries in UTM Zone 45N and reprojected to WGS84 (`EPSG:4326`) GeoJSON.

---

## 📊 4. Key Scientific Observations

| Observation / Event | Date | Satellite & Sensor | Surface Area (km²) | Surface Area (ha) | Shift vs Pre-GLOF |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Historical Pre-GLOF** | 2023-09-28 | Sentinel-1A IW GRDH | **1.6247** | **162.47** | *Baseline* |
| **Early Post-Launch Refill**| 2025-11-20 | NISAR L2 GCOV | **0.9012** | **90.12** | -44.5% |
| **Winter Minimum** | 2026-02-06 | NISAR L2 GCOV | **0.8656** | **86.56** | -46.7% |
| **Spring Melt Rise** | 2026-05-19 | NISAR L2 GCOV | **0.9168** | **91.68** | -43.6% |
| **Summer Peak Refill** | 2026-07-28 | NISAR L2 GCOV | **0.9992** | **99.92** | -38.5% |
| **Monsoon Basin Expansion**| 2026-09-26 | NISAR L2 GCOV | **1.0028** | **100.28** | -38.3% |
| **Latest Available SAR** | 2026-11-07 | NISAR L2 GCOV | **0.9328** | **93.28** | -42.6% |

---

## ⚡ 5. FastAPI REST Endpoints

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/` | `GET` | Serves unified interactive monitoring dashboard |
| `/api/v1/health` | `GET` | Service health status and database connectivity |
| `/api/v1/analytics` | `GET` | Complete multi-temporal observations & comparison series |
| `/api/v1/observations` | `GET` | List all 38 verified observations with area measurements |
| `/api/v1/observations/{id}` | `GET` | Single observation metadata, bounds, and layer URLs |
| `/api/v1/lake/metrics` | `GET` | Current surface area, pre-GLOF baseline, net change |
| `/api/v1/lake/timeseries` | `GET` | Time-series data points for area charting |
| `/api/v1/lake/boundaries` | `GET` | Catalog of GeoJSON boundary polygons |
| `/api/v1/lake/boundaries/{id}`| `GET` | GeoJSON Polygon feature for a specific date |
| `/api/v1/lake/compare` | `GET/POST`| Dual-observation change detection (area & % shift) |
| `/api/v1/layers` | `GET` | Available basemaps, SAR overlays, DEM, and vectors |
| `/api/v1/risk/indicators` | `GET` | Morphometric and downstream vulnerability indicators |
| `/api/v1/datasets` | `GET` | Metadata on all integrated missions, rasters & vectors |
| `/api/v1/processing/status` | `GET` | ML model parameters, convergence status, and metadata |
| `/docs` | `GET` | Interactive OpenAPI Swagger UI documentation |

---

## 🚀 6. Execution Instructions

### Option A: One-Click Launcher (Recommended)
Double click `run_dashboard.bat` or run:
```cmd
run_dashboard.bat
```

### Option B: Python Direct Launch
```cmd
python run_dashboard.py
```

Open your browser at:
- **Interactive Dashboard**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **FastAPI Interactive API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## ⚠️ 7. Scientific & Safety Disclaimer

This platform is a **research, monitoring, and decision-support system** designed to evaluate multi-mission SAR remote sensing and unsupervised change detection. It is **not** an operational flood early-warning or evacuation authority. All emergency decisions must be guided by the **Sikkim State Disaster Management Authority (SSDMA)**, **Central Water Commission (CWC)**, and **National Disaster Management Authority (NDMA)**.
