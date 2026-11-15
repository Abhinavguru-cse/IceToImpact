import {
  Observation,
  LakeMetrics,
  Comparison,
  TimeSeriesPoint,
  RiskData,
  DatasetItem,
} from '../types';

const API_BASE = '/api/v1';

export async function fetchObservations(): Promise<Observation[]> {
  const res = await fetch(`${API_BASE}/observations`);
  if (!res.ok) throw new Error('Failed to fetch observations');
  return res.json();
}

export async function fetchLakeMetrics(): Promise<LakeMetrics> {
  const res = await fetch(`${API_BASE}/lake/metrics`);
  if (!res.ok) throw new Error('Failed to fetch lake metrics');
  return res.json();
}

export async function fetchTimeSeries(): Promise<TimeSeriesPoint[]> {
  const res = await fetch(`${API_BASE}/lake/timeseries`);
  if (!res.ok) throw new Error('Failed to fetch time series');
  return res.json();
}

export async function fetchComparisons(): Promise<Comparison[]> {
  const res = await fetch(`${API_BASE}/lake/compare`);
  if (!res.ok) throw new Error('Failed to fetch comparisons');
  return res.json();
}

export async function compareCustom(earlierId: string, laterId: string): Promise<Comparison> {
  const res = await fetch(`${API_BASE}/lake/compare?earlier_id=${earlierId}&later_id=${laterId}`);
  if (!res.ok) throw new Error('Failed to compute comparison');
  return res.json();
}

export async function fetchRiskData(): Promise<RiskData> {
  const res = await fetch(`${API_BASE}/risk/indicators`);
  if (!res.ok) throw new Error('Failed to fetch risk indicators');
  return res.json();
}

export async function fetchDatasets(): Promise<DatasetItem[]> {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error('Failed to fetch datasets');
  return res.json();
}
