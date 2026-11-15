import React from 'react';

interface HeaderProps {
  modelStatus?: string;
  totalObservations?: number;
}

export const Header: React.FC<HeaderProps> = ({ modelStatus = 'GMM-EM Trained', totalObservations = 38 }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="header-title">IceToImpact – Glacial Lake Monitoring Platform</h1>
          <p className="header-subtitle">AI-Powered SAR Observation & GLOF Susceptibility Assessment</p>
        </div>
      </div>
      <div className="header-badges">
        <span className="badge badge-satellite">NISAR L-band & S1</span>
        <span className="badge badge-active">{totalObservations} Scenes Active</span>
        <span className="badge badge-model">{modelStatus}</span>
      </div>
    </header>
  );
};
