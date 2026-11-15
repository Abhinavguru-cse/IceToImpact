import React, { useState } from 'react';
import { Observation, Comparison } from '../types';

interface ChangeDetectionProps {
  observations: Observation[];
  comparisons: Comparison[];
  onSelectPair: (earlierId: string, laterId: string) => void;
  customResult: Comparison | null;
}

export const ChangeDetection: React.FC<ChangeDetectionProps> = ({
  observations,
  comparisons,
  onSelectPair,
  customResult,
}) => {
  const [earlierId, setEarlierId] = useState<string>(observations[0]?.id || '');
  const [laterId, setLaterId] = useState<string>(observations[observations.length - 1]?.id || '');

  const earlierObs = observations.find((o) => o.id === earlierId);
  const laterObs = observations.find((o) => o.id === laterId);

  const handleCompare = () => {
    if (earlierId && laterId) {
      onSelectPair(earlierId, laterId);
    }
  };

  const currentResult =
    customResult ||
    (earlierObs && laterObs
      ? {
          comparison_title: `${earlierObs.date} vs ${laterObs.date}`,
          earlier_id: earlierObs.id,
          earlier_date: earlierObs.date,
          earlier_satellite: earlierObs.satellite,
          earlier_area_km2: earlierObs.area_km2,
          later_id: laterObs.id,
          later_date: laterObs.date,
          later_satellite: laterObs.satellite,
          later_area_km2: laterObs.area_km2,
          area_change_km2: laterObs.area_km2 - earlierObs.area_km2,
          area_change_ha: laterObs.area_ha - earlierObs.area_ha,
          percentage_change:
            earlierObs.area_km2 > 0
              ? ((laterObs.area_km2 - earlierObs.area_km2) / earlierObs.area_km2) * 100.0
              : 0.0,
          trend: (laterObs.area_km2 - earlierObs.area_km2 > 0.01
            ? 'Expansion'
            : laterObs.area_km2 - earlierObs.area_km2 < -0.01
            ? 'Reduction'
            : 'Stable') as 'Expansion' | 'Reduction' | 'Stable',
        }
      : null);

  return (
    <section className="comparison-section card">
      <div className="comparison-header">
        <div>
          <h2 className="section-title">Multi-Date Change Detection & Comparison</h2>
          <p className="section-desc">
            Evaluate surface area shifts, perimeter retreat, or post-breach refill across observation dates.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCompare}>
          Compare Selected Dates
        </button>
      </div>

      <div className="comparison-selectors">
        <div className="comp-col">
          <label htmlFor="earlierDateSelect">Earlier Observation (Baseline)</label>
          <select
            id="earlierDateSelect"
            value={earlierId}
            onChange={(e) => setEarlierId(e.target.value)}
          >
            {observations.map((obs) => (
              <option key={obs.id} value={obs.id}>
                {obs.date} ({obs.satellite} - {obs.area_km2.toFixed(3)} km²)
              </option>
            ))}
          </select>
          <div className="comp-stat-box">
            <span className="comp-stat-label">Area:</span>{' '}
            <strong>{earlierObs ? `${earlierObs.area_km2.toFixed(3)} km²` : '--'}</strong>
          </div>
        </div>

        <div className="comp-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        <div className="comp-col">
          <label htmlFor="laterDateSelect">Later Observation (Comparison)</label>
          <select
            id="laterDateSelect"
            value={laterId}
            onChange={(e) => setLaterId(e.target.value)}
          >
            {observations.map((obs) => (
              <option key={obs.id} value={obs.id}>
                {obs.date} ({obs.satellite} - {obs.area_km2.toFixed(3)} km²)
              </option>
            ))}
          </select>
          <div className="comp-stat-box">
            <span className="comp-stat-label">Area:</span>{' '}
            <strong>{laterObs ? `${laterObs.area_km2.toFixed(3)} km²` : '--'}</strong>
          </div>
        </div>

        <div className="comp-results-box">
          <div className="result-metric">
            <span className="res-label">Net Area Change:</span>
            <span
              className="res-val"
              style={{
                color:
                  currentResult && currentResult.area_change_km2 > 0.01
                    ? '#F59E0B'
                    : currentResult && currentResult.area_change_km2 < -0.01
                    ? '#34D399'
                    : '#94A3B8',
              }}
            >
              {currentResult
                ? `${currentResult.area_change_km2 > 0 ? '+' : ''}${currentResult.area_change_km2.toFixed(3)} km²`
                : '--'}
            </span>
          </div>
          <div className="result-metric">
            <span className="res-label">Percentage Shift:</span>
            <span className="res-val">
              {currentResult
                ? `${currentResult.percentage_change > 0 ? '+' : ''}${currentResult.percentage_change.toFixed(1)}%`
                : '--'}
            </span>
          </div>
          <div className="result-metric">
            <span className="res-label">Dynamic Trend:</span>
            <span
              className={`trend-badge ${
                currentResult?.trend === 'Expansion'
                  ? 'trend-expansion'
                  : currentResult?.trend === 'Reduction'
                  ? 'trend-reduction'
                  : 'trend-stable'
              }`}
            >
              {currentResult?.trend || '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="landmark-comparisons">
        <h3 className="subsection-title">Precomputed Landmark Monitoring Intervals</h3>
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Interval Description</th>
                <th>Earlier Date</th>
                <th>Later Date</th>
                <th>Earlier Area</th>
                <th>Later Area</th>
                <th>Net $\Delta$Area</th>
                <th>% Shift</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => (
                <tr
                  key={i}
                  style={{ cursor: 'pointer' }}
                  title="Click to view this comparison"
                  onClick={() => {
                    setEarlierId(c.earlier_id);
                    setLaterId(c.later_id);
                    onSelectPair(c.earlier_id, c.later_id);
                  }}
                >
                  <td>
                    <strong>{c.comparison_title}</strong>
                  </td>
                  <td>{c.earlier_date}</td>
                  <td>{c.later_date}</td>
                  <td>{c.earlier_area_km2.toFixed(3)} km²</td>
                  <td>{c.later_area_km2.toFixed(3)} km²</td>
                  <td>
                    <strong>
                      {c.area_change_km2 > 0 ? '+' : ''}
                      {c.area_change_km2.toFixed(3)} km²
                    </strong>
                  </td>
                  <td>
                    {c.percentage_change > 0 ? '+' : ''}
                    {c.percentage_change.toFixed(1)}%
                  </td>
                  <td>
                    <span
                      className={`trend-badge ${
                        c.trend === 'Expansion'
                          ? 'trend-expansion'
                          : c.trend === 'Reduction'
                          ? 'trend-reduction'
                          : 'trend-stable'
                      }`}
                    >
                      {c.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
