import React, { useState, useEffect } from 'react';
import {
  Observation,
  LakeMetrics,
  Comparison,
  TimeSeriesPoint,
  RiskData,
  DatasetItem,
} from './types';
import {
  fetchObservations,
  fetchLakeMetrics,
  fetchTimeSeries,
  fetchComparisons,
  fetchRiskData,
  fetchDatasets,
} from './services/api';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { ControlPanel } from './components/ControlPanel';
import { RadarMap } from './components/RadarMap';
import { ChangeDetection } from './components/ChangeDetection';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { RiskAnalysis } from './components/RiskAnalysis';
import { DatasetExplorer } from './components/DatasetExplorer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'compare' | 'timeseries' | 'risk' | 'catalog'>('monitor');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedObservationId, setSelectedObservationId] = useState<string>('sentinel1_20230928');
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [metrics, setMetrics] = useState<LakeMetrics | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [obsData, metricsData, tsData, compData, rData, dsData] = await Promise.all([
          fetchObservations(),
          fetchLakeMetrics(),
          fetchTimeSeries(),
          fetchComparisons(),
          fetchRiskData(),
          fetchDatasets(),
        ]);

        setObservations(obsData);
        setMetrics(metricsData);
        setTimeSeries(tsData);
        setComparisons(compData);
        setRiskData(rData);
        setDatasets(dsData);

        if (obsData.length > 0) {
          const defaultObs = obsData.find((o) => o.id === 'sentinel1_20230928') || obsData[0];
          setSelectedObservationId(defaultObs.id);
          setSelectedObservation(defaultObs);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize IceToImpact platform');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSelectObservation = (id: string) => {
    setSelectedObservationId(id);
    const found = observations.find((o) => o.id === id);
    if (found) {
      setSelectedObservation(found);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-bold tracking-wider text-cyan-400">IceToImpact</div>
        <div className="text-xs text-slate-400 mt-1">Connecting to FastAPI monitoring pipeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-6">
        <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-6 max-w-lg text-center">
          <div className="text-red-400 font-bold text-lg mb-2">Service Initialization Error</div>
          <div className="text-xs text-slate-300 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded font-semibold text-slate-200 border border-slate-600"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col">
      {/* Platform Header */}
      <Header />

      {/* Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { id: 'monitor', label: 'Interactive Satellite Map' },
              { id: 'compare', label: 'Multi-Date Change Detection' },
              { id: 'timeseries', label: 'Historical Time-Series' },
              { id: 'risk', label: 'GLOF Susceptibility' },
              { id: 'catalog', label: 'Dataset Explorer' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              FastAPI Pipeline: Active
            </span>
            <span>•</span>
            <span>Observations: <strong className="text-slate-200">{observations.length}</strong></span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Section A: Overview Metrics */}
        {metrics && <MetricsOverview metrics={metrics} />}

        {/* Section B: Interactive Satellite Map */}
        {activeTab === 'monitor' && (
          <div className="space-y-4">
            <ControlPanel
              observations={observations}
              selectedId={selectedObservationId}
              onSelect={handleSelectObservation}
            />
            <RadarMap
              observation={selectedObservation}
              key={selectedObservationId}
            />
          </div>
        )}

        {/* Section C: Lake Change Detection */}
        {activeTab === 'compare' && (
          <ChangeDetection
            comparisons={comparisons}
            observations={observations}
          />
        )}

        {/* Section D: Historical Time Series */}
        {activeTab === 'timeseries' && (
          <div className="space-y-6">
            <TimeSeriesChart
              data={timeSeries}
              selectedId={selectedObservationId}
              onSelectObservation={(id) => {
                handleSelectObservation(id);
                setActiveTab('monitor');
              }}
            />
          </div>
        )}

        {/* Section E: GLOF Susceptibility Analysis */}
        {activeTab === 'risk' && <RiskAnalysis data={riskData} />}

        {/* Section F: Dataset Explorer */}
        {activeTab === 'catalog' && <DatasetExplorer datasets={datasets} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        IceToImpact Glacial Monitoring Platform • Research &amp; Observation Prototype • Powered by Sentinel-1, NISAR &amp; Copernicus DEM
      </footer>
    </div>
  );
};
export default App;
