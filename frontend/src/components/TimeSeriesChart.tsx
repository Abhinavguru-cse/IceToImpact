import React, { useState } from 'react';
import { TimeSeriesPoint } from '../types';

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  selectedId: string | null;
  onSelectObservation: (id: string) => void;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  selectedId,
  onSelectObservation,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center text-slate-400">
        Loading historical lake observations...
      </div>
    );
  }

  // Pre-GLOF reference point (Sentinel-1: 1.6247 km²)
  const preGlofArea = 1.6247;
  const areas = data.map((d) => d.area_km2);
  const minArea = Math.min(...areas, 0.8) * 0.95;
  const maxArea = Math.max(...areas, preGlofArea) * 1.05;

  // Chart dimensions
  const svgWidth = 900;
  const svgHeight = 280;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 50;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const getY = (val: number) => {
    return padTop + plotHeight - ((val - minArea) / (maxArea - minArea)) * plotHeight;
  };

  const getX = (idx: number) => {
    return padLeft + (idx / (data.length - 1)) * plotWidth;
  };

  // Build path segments
  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.area_km2),
    data: d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const preGlofY = getY(preGlofArea);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-slate-100 shadow-lg">
      <div className="flex flex-wrap items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            South Lhonak Lake Surface Area Evolution
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified SAR observations (Sentinel-1 pre-GLOF &amp; NISAR L2 GCOV series) • No fabricated interpolation
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400 inline-block border-dashed"></span>
            <span className="text-slate-300">Pre-GLOF Baseline (1.625 km²)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
            <span className="text-slate-300">Observed SAR Delineation</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[650px] select-none"
        >
          {/* Y-Axis Gridlines & Labels */}
          {[0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((val) => {
            if (val < minArea || val > maxArea) return null;
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val.toFixed(2)} km²
                </text>
              </g>
            );
          })}

          {/* Pre-GLOF Baseline Line */}
          <line
            x1={padLeft}
            y1={preGlofY}
            x2={svgWidth - padRight}
            y2={preGlofY}
            stroke="#f87171"
            strokeDasharray="6 4"
            strokeWidth="1.5"
          />
          <text
            x={svgWidth - padRight - 5}
            y={preGlofY - 6}
            fill="#f87171"
            fontSize="10"
            textAnchor="end"
            fontWeight="bold"
          >
            Pre-GLOF (28 Sept 2023): 1.625 km²
          </text>

          {/* Observed Area Polyline */}
          <path
            d={linePath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isSelected = selectedId === p.data.id;
            const isPreGlof = p.data.id === 'sentinel1_20230928';
            return (
              <g
                key={p.data.id}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => onSelectObservation(p.data.id)}
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 6 : isPreGlof ? 5 : 3.5}
                  fill={isPreGlof ? '#f87171' : isSelected ? '#38bdf8' : '#0891b2'}
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth={isSelected ? 2 : 1}
                />
              </g>
            );
          })}

          {/* X-Axis Date Labels (sample periodically) */}
          {points
            .filter((_, idx) => idx % Math.ceil(points.length / 7) === 0 || idx === points.length - 1)
            .map((p) => (
              <text
                key={p.data.id}
                x={p.x}
                y={svgHeight - 15}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {p.data.date}
              </text>
            ))}
        </svg>
      </div>

      {/* Hover / Selection Detail Banner */}
      <div className="mt-3 bg-slate-950/70 border border-slate-800 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-4">
        {hoveredPoint ? (
          <div>
            <span className="font-semibold text-cyan-300">{hoveredPoint.date}</span>
            <span className="text-slate-400"> ({hoveredPoint.satellite})</span>: Area{' '}
            <span className="font-bold text-white">{hoveredPoint.area_km2.toFixed(4)} km²</span> (
            {hoveredPoint.area_ha.toFixed(2)} ha) • Status: <span className="text-emerald-400">{hoveredPoint.status}</span>
          </div>
        ) : (
          <div className="text-slate-400">
            Hover over or click any data point to inspect and load that satellite observation layer.
          </div>
        )}
        <div className="text-slate-500 text-[11px]">
          Total Verified Observations: {data.length}
        </div>
      </div>
    </div>
  );
};
