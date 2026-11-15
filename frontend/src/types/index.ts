export interface Observation {
  id: string;
  date: string;
  satellite: string;
  sensor?: string;
  polarization?: string;
  status: string;
  area_km2: number;
  area_ha: number;
  area_m2: number;
  pixel_count: number;
  bounds?: [[number, number], [number, number]];
  radar_layer_url?: string;
  boundary_geojson_url?: string;
}

export interface LakeMetrics {
  region_id: string;
  region_name: string;
  location: string;
  coordinates: { lat: number; lon: number };
  elevation_m: number;
  latest_observation_date: string;
  current_area_km2: number;
  current_area_ha: number;
  historical_pre_glof_area_km2: number;
  net_area_change_km2: number;
  net_percentage_change: number;
  total_observations: number;
}

export interface Comparison {
  comparison_title: string;
  earlier_id: string;
  earlier_date: string;
  earlier_satellite: string;
  earlier_area_km2: number;
  later_id: string;
  later_date: string;
  later_satellite: string;
  later_area_km2: number;
  area_change_km2: number;
  area_change_ha: number;
  percentage_change: number;
  trend: 'Expansion' | 'Reduction' | 'Stable';
  earlier_boundary_url?: string;
  later_boundary_url?: string;
}

export interface TimeSeriesPoint {
  id: string;
  date: string;
  satellite: string;
  area_km2: number;
  area_ha: number;
  status: string;
}

export interface RiskIndicator {
  category: string;
  indicator: string;
  status: string;
  confidence: string;
  risk_level: string;
}

export interface RiskData {
  study_area: {
    name: string;
    region: string;
    coordinates: { lat: number; lon: number };
    elevation_m: number;
    lake_type: string;
  };
  latest_condition: {
    observation_date: string;
    surface_area_km2: number;
    surface_area_ha: number;
    historical_pre_glof_area_km2: number;
    net_volume_reduction_since_2023: string;
  };
  indicators: RiskIndicator[];
  scientific_disclaimer: string;
}

export interface DatasetItem {
  name: string;
  category: string;
  source: string;
  coverage: string;
  format: string;
  file_count: number;
  description: string;
}
