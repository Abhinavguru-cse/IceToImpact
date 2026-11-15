import React from 'react';
import { Observation, LakeMetrics } from '../types';

interface MetricsOverviewProps {
  currentObs?: Observation;
  metrics?: LakeMetrics | null;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ currentObs, metrics }) => {
  if (!currentObs) return null;

  const preGlafArea = metrics?.historical_pre_glof_area_km2 || 1.624;
  const deltaFromPre = ((currentObs.area_km2 - preGlafArea) / preGlafArea) * 100.0;
  const isPreGLOF = currentObs.satellite === 'Sentinel-1A';

  return (
    <aside className="metrics-sidebar">
      <div className="metric-card card primary-metric">
        <div className="metric-label">Detected Lake Surface Area</div>
        <div className="metric-value-row">
          <span className="metric-value">{currentObs.area_km2.toFixed(3)}</span>
          <span className="metric-unit">km²</span>
        </div>
        <div className="metric-secondary-row">
          <span>{currentObs.area_ha.toFixed(1)} hectares</span> •{' '}
          <span>{Number(currentObs.area_m2).toLocaleString()} m²</span>
        </div>
        <div
          className="metric-delta"
          style={{
            background: isPreGLOF ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isPreGLOF ? '#38BDF8' : '#F87171',
          }}
        >
          {isPreGLOF ? 'Historical Pre-GLOF Baseline' : `${deltaFromPre.toFixed(1)}% vs Oct 2023 Pre-GLOF`}
        </div>
      </div>

      <div className="metric-card card">
        <div className="metric-label">Observation Metadata</div>
        <table className="meta-table">
          <tbody>
            <tr>
              <td>Acquisition Date:</td>
              <td className="table-val">{currentObs.date}</td>
            </tr>
            <tr>
              <td>Satellite Mission:</td>
              <td className="table-val">{currentObs.satellite}</td>
            </tr>
            <tr>
              <td>Sensor & Band:</td>
              <td className="table-val">{currentObs.sensor || 'SAR'}</td>
            </tr>
            <tr>
              <td>Polarization:</td>
              <td className="table-val">{currentObs.polarization || 'HH'}</td>
            </tr>
            <tr>
              <td>Spatial Resolution:</td>
              <td className="table-val">10m UTM Zone 45N</td>
            </tr>
            <tr>
              <td>Delineation Engine:</td>
              <td className="table-val">GMM-EM (Statistical EM)</td>
            </tr>
            <tr>
              <td>Verification Status:</td>
              <td className="table-val">
                <span className="status-pill status-verified">{currentObs.status}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="metric-card card quick-stats-card">
        <div className="metric-label">GLOF Context (Oct 4, 2023)</div>
        <p className="stat-desc">
          South Lhonak pre-GLOF area was <strong>{preGlafArea} km²</strong>. Moraine failure breached
          terminal dam, draining <strong>~1.13 km² (70%)</strong> down the Teesta Valley. Current
          observations show post-breach stabilized basin refill at <strong>5,200m</strong> altitude.
        </p>
      </div>
    </aside>
  );
};
