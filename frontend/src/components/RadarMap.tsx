import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Observation } from '../types';

interface RadarMapProps {
  currentObs?: Observation;
  opacity: number;
}

const SOUTH_LHONAK_COORDS: [number, number] = [27.9144, 88.1836];
const MORAINE_BREACH_COORDS: [number, number] = [27.9180, 88.1945];

export const RadarMap: React.FC<RadarMapProps> = ({ currentObs, opacity }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarOverlayRef = useRef<L.ImageOverlay | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const moraineMarkerRef = useRef<L.CircleMarker | null>(null);
  const drainageLayerRef = useRef<L.Polyline | null>(null);

  const [showBoundary, setShowBoundary] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showMoraine, setShowMoraine] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const esriSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, USGS, Maxar, Earthstar Geographics',
        maxZoom: 18,
      }
    );

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const map = L.map(mapContainerRef.current, {
      center: SOUTH_LHONAK_COORDS,
      zoom: 14,
      layers: [esriSatellite],
    });

    L.control
      .layers(
        {
          'Satellite Imagery (Esri)': esriSatellite,
          'Street Map (OSM)': osm,
        },
        undefined,
        { position: 'topright' }
      )
      .addTo(map);

    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Moraine breach point marker
    const moraine = L.circleMarker(MORAINE_BREACH_COORDS, {
      radius: 7,
      color: '#EF4444',
      fillColor: '#EF4444',
      fillOpacity: 0.85,
      weight: 2,
    }).addTo(map);
    moraine.bindPopup(
      '<strong>Terminal Moraine Breach Point (2023)</strong><br>Incised V-notch drainage breach origin of the 4 Oct 2023 GLOF.'
    );
    moraineMarkerRef.current = moraine;

    // Downstream flow path
    const teestaFlow = [
      [27.9180, 88.1945],
      [27.9150, 88.2050],
      [27.9090, 88.2200],
      [27.8950, 88.2450],
      [27.8800, 88.2700],
    ];
    const drainage = L.polyline(teestaFlow as [number, number][], {
      color: '#3B82F6',
      weight: 3,
      dashArray: '6, 6',
      opacity: 0.8,
    }).addTo(map);
    drainage.bindPopup(
      '<strong>Teesta River Headwaters</strong><br>Downstream high-velocity flood pathway toward Chungthang & Dikchu.'
    );
    drainageLayerRef.current = drainage;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Radar Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarOverlayRef.current) {
      map.removeLayer(radarOverlayRef.current);
      radarOverlayRef.current = null;
    }

    if (currentObs?.radar_layer_url && currentObs?.bounds && showRadar) {
      const overlay = L.imageOverlay(currentObs.radar_layer_url, currentObs.bounds, {
        opacity: opacity / 100.0,
        interactive: false,
      }).addTo(map);
      radarOverlayRef.current = overlay;
    }
  }, [currentObs, showRadar]);

  // Update Opacity
  useEffect(() => {
    if (radarOverlayRef.current) {
      radarOverlayRef.current.setOpacity(opacity / 100.0);
    }
  }, [opacity]);

  // Update Boundary GeoJSON
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (currentObs?.boundary_geojson_url && showBoundary) {
      fetch(currentObs.boundary_geojson_url)
        .then((res) => res.json())
        .then((geoJson) => {
          if (!mapInstanceRef.current) return;
          const layer = L.geoJSON(geoJson, {
            style: {
              color: '#06B6D4',
              weight: 2.5,
              fillColor: '#06B6D4',
              fillOpacity: 0.35,
              dashArray: currentObs.satellite === 'Sentinel-1A' ? '6, 6' : undefined,
            },
            onEachFeature: (_, l) => {
              l.bindPopup(`
                <strong>${currentObs.satellite} Lake Boundary</strong><br>
                Observation Date: <b>${currentObs.date}</b><br>
                Surface Area: <b>${currentObs.area_km2.toFixed(3)} km²</b> (${currentObs.area_ha.toFixed(1)} ha)<br>
                Method: <em>GMM-EM Statistical Threshold</em>
              `);
            },
          }).addTo(mapInstanceRef.current);
          boundaryLayerRef.current = layer;
        })
        .catch((err) => console.error('Error loading boundary GeoJSON:', err));
    }
  }, [currentObs, showBoundary]);

  // Toggle Moraine & Drainage
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (moraineMarkerRef.current) {
      if (showMoraine) map.addLayer(moraineMarkerRef.current);
      else map.removeLayer(moraineMarkerRef.current);
    }
    if (drainageLayerRef.current) {
      if (showDrainage) map.addLayer(drainageLayerRef.current);
      else map.removeLayer(drainageLayerRef.current);
    }
  }, [showMoraine, showDrainage]);

  return (
    <section className="map-card card">
      <div className="map-header">
        <div className="map-title-row">
          <h2 className="section-title">Satellite Radar Map Viewer</h2>
          <span className="coords-display">27.9144° N, 88.1836° E | 5,200 m a.s.l.</span>
        </div>
        <div className="map-quick-toggles">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showBoundary}
              onChange={(e) => setShowBoundary(e.target.checked)}
            />{' '}
            Lake Boundary Overlay
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showRadar}
              onChange={(e) => setShowRadar(e.target.checked)}
            />{' '}
            Processed SAR Layer
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showMoraine}
              onChange={(e) => setShowMoraine(e.target.checked)}
            />{' '}
            Moraine Breach
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showDrainage}
              onChange={(e) => setShowDrainage(e.target.checked)}
            />{' '}
            Teesta Flow
          </label>
        </div>
      </div>

      <div ref={mapContainerRef} className="radar-map-view" />

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color legend-water" /> Delineated Water Boundary
        </div>
        <div className="legend-item">
          <span className="legend-color legend-radar" /> SAR Backscatter (Calibrated dB)
        </div>
        <div className="legend-item">
          <span className="legend-color legend-moraine" /> Terminal Moraine Breach Point (2023)
        </div>
        <div className="legend-item">
          <span className="legend-color legend-river" /> Teesta Downstream Drainage
        </div>
      </div>
    </section>
  );
};
