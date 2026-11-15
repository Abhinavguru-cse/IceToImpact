import React from 'react';
import { DatasetItem } from '../types';

interface DatasetExplorerProps {
  datasets: DatasetItem[];
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ datasets }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-slate-100 shadow-lg space-y-5">
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            Integrated Geospatial &amp; Satellite Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Missions, sensors, DEM elevations, glacier inventories and downstream risk layers loaded in the pipeline
          </p>
        </div>
        <div className="text-xs bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
          Total Layers: <span className="font-semibold text-white">{datasets.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {item.file_count} {item.file_count === 1 ? 'asset' : 'assets'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-200 mt-2 text-sm">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="text-slate-300 font-medium">{item.source}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="text-slate-300 font-mono">{item.format}</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span className="text-slate-300">{item.coverage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
