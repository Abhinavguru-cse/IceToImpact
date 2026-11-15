import React from 'react';
import { Observation } from '../types';

interface ControlPanelProps {
  observations: Observation[];
  selectedObsId: string;
  onSelectObs: (id: string) => void;
  polarization: string;
  onSelectPol: (pol: string) => void;
  opacity: number;
  onOpacityChange: (val: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  observations,
  selectedObsId,
  onSelectObs,
  polarization,
  onSelectPol,
  opacity,
  onOpacityChange,
}) => {
  const currentObs = observations.find((o) => o.id === selectedObsId);

  return (
    <section className="control-panel card">
      <div className="control-group">
        <label htmlFor="regionSelect">Glacier / Study Region</label>
        <select id="regionSelect" defaultValue="south_lhonak">
          <option value="south_lhonak">South Lhonak Lake (North Sikkim, India)</option>
        </select>
      </div>

      <div className="control-group date-control">
        <label htmlFor="dateSelect">Observation Date</label>
        <div className="date-select-wrapper">
          <select
            id="dateSelect"
            value={selectedObsId}
            onChange={(e) => onSelectObs(e.target.value)}
          >
            {observations.map((obs) => (
              <option key={obs.id} value={obs.id}>
                {obs.date} ({obs.satellite} - {obs.area_km2.toFixed(3)} km²)
              </option>
            ))}
          </select>
          <span className="satellite-pill">{currentObs?.satellite || 'SAR'}</span>
        </div>
      </div>

      <div className="control-group">
        <label>Polarization Mode</label>
        <div className="btn-toggle-group">
          <button
            className={`btn-toggle ${polarization === 'HH' ? 'active' : ''}`}
            onClick={() => onSelectPol('HH')}
          >
            HH / VV
          </button>
          <button
            className={`btn-toggle ${polarization === 'HV' ? 'active' : ''}`}
            onClick={() => onSelectPol('HV')}
          >
            HV / VH
          </button>
        </div>
      </div>

      <div className="control-group opacity-control">
        <label htmlFor="opacitySlider">
          Radar Layer Opacity: <span>{opacity}%</span>
        </label>
        <input
          type="range"
          id="opacitySlider"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
        />
      </div>
    </section>
  );
};
