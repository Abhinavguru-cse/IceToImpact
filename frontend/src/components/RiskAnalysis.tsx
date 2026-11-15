import React from 'react';
import { RiskData } from '../types';

interface RiskAnalysisProps {
  data: RiskData | null;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center text-slate-400">
        Loading GLOF susceptibility indicators...
      </div>
    );
  }

  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-slate-100 shadow-lg space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          GLOF Susceptibility &amp; Exposure Analysis
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Research-grade morphometric indicators, terrain context and downstream exposure along the Teesta corridor
        </p>
      </div>

      {/* Morphometric & Physical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400">Study Lake Attributes</div>
          <div className="text-lg font-bold text-cyan-300 mt-1">{data.study_area.name}</div>
          <div className="text-xs text-slate-400 mt-2 space-y-1">
            <div>Elevation: <span className="text-slate-200 font-mono">{data.study_area.elevation_m} m a.s.l.</span></div>
            <div>Dam Type: <span className="text-slate-200">Moraine-dammed proglacial lake</span></div>
            <div>Coordinates: <span className="text-slate-200 font-mono">27.915°N, 88.204°E</span></div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400">Downstream Drainage Context</div>
          <div className="text-lg font-bold text-amber-300 mt-1">Teesta River Basin</div>
          <div className="text-xs text-slate-400 mt-2 space-y-1">
            <div>HydroBASINS Pfafstetter: <span className="text-slate-200 font-mono">Level 6 (Sub-basin 45)</span></div>
            <div>Downstream Corridor: <span className="text-slate-200">Chungthang, Mangan, Singtam</span></div>
            <div>Drainage Length: <span className="text-slate-200 font-mono">&gt; 120 km into Brahmaputra</span></div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400">Infrastructure Elements at Risk</div>
          <div className="text-lg font-bold text-red-400 mt-1">18,760 Features</div>
          <div className="text-xs text-slate-400 mt-2 space-y-1">
            <div>Bridges &amp; Crossings: <span className="text-slate-200 font-mono">148 documented</span></div>
            <div>Hydro Projects: <span className="text-slate-200 font-mono">Teesta III (Chungthang Dam)</span></div>
            <div>OSM Settlement Features: <span className="text-slate-200 font-mono">18,000+ nodes/ways</span></div>
          </div>
        </div>
      </div>

      {/* Susceptibility Indicators Table */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider text-xs">
          Physical Susceptibility Indicators
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2.5 px-3">Indicator Category</th>
                <th className="py-2.5 px-3">Parameter Evaluated</th>
                <th className="py-2.5 px-3">Condition / Value</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3">Evidence Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.indicators.map((ind, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-300">{ind.category}</td>
                  <td className="py-2.5 px-3 text-slate-300">{ind.indicator}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-mono">{ind.status}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getRiskBadge(ind.risk_level)}`}>
                      {ind.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{ind.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-200/90 leading-relaxed">
        <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Scientific Validation Notice &amp; Research Limitations
        </div>
        <p>{data.scientific_disclaimer}</p>
        <p className="mt-1 text-slate-400">
          Lake boundary delineation was derived using unsupervised Otsu thresholding and Expectation-Maximization Gaussian Mixture Models on Sentinel-1 and NISAR radar backscatter data. Satellite expansion alone is not indicative of imminent dam failure without in-situ geotechnical telemetry and hydrometeorological forcing models.
        </p>
      </div>
    </div>
  );
};
