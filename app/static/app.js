/**
 * South Lhonak Glacial Lake Monitoring Platform (IceToImpact)
 * Frontend Application Logic (Leaflet Map, Dynamic SAR Layers, Chart.js, Change Detection)
 */

let map;
let radarOverlay = null;
let boundaryLayer = null;
let comparisonEarlierLayer = null;
let comparisonLaterLayer = null;
let moraineMarker = null;
let drainageLayer = null;

let analyticsData = null;
let areaChart = null;

// South Lhonak lake coordinates
const SOUTH_LHONAK_COORDS = [27.9144, 88.1836];
const MORAINE_BREACH_COORDS = [27.9180, 88.1945];

document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  await loadAnalytics();
  initEventListeners();
});

function initMap() {
  // Basemap layers
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  });

  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{c}/{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  map = L.map('map', {
    center: SOUTH_LHONAK_COORDS,
    zoom: 14,
    layers: [esriSatellite]
  });

  L.control.layers({
    "Satellite Imagery (Esri)": esriSatellite,
    "Dark Matter (Carto)": cartoDark,
    "Street Map (OSM)": osm
  }, null, { position: 'topright' }).addTo(map);

  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

  // Terminal moraine breach marker
  moraineMarker = L.circleMarker(MORAINE_BREACH_COORDS, {
    radius: 7,
    color: '#EF4444',
    fillColor: '#EF4444',
    fillOpacity: 0.8,
    weight: 2
  }).addTo(map);
  moraineMarker.bindPopup("<strong>Terminal Moraine Breach Point (2023)</strong><br>Incised drainage outlet from 4 Oct 2023 GLOF event.");

  // Approximate Teesta downstream drainage headwaters
  const teestaHeadwaters = [
    [27.9180, 88.1945],
    [27.9150, 88.2050],
    [27.9090, 88.2200],
    [27.8950, 88.2450],
    [27.8800, 88.2700]
  ];
  drainageLayer = L.polyline(teestaHeadwaters, {
    color: '#3B82F6',
    weight: 3,
    dashArray: '6, 6',
    opacity: 0.8
  }).addTo(map);
  drainageLayer.bindPopup("<strong>Teesta River Headwaters</strong><br>Downstream flood drainage channel toward Chungthang.");
}

async function loadAnalytics() {
  try {
    const res = await fetch('/api/v1/analytics');
    if (!res.ok) throw new Error("Could not fetch analytics API");
    analyticsData = await res.json();
    populateUI();
  } catch (err) {
    console.error("Error loading analytics:", err);
  }
}

function populateUI() {
  if (!analyticsData) return;

  const obsList = analyticsData.observations || [];
  const dateSelect = document.getElementById('dateSelect');
  const earlierSelect = document.getElementById('earlierDateSelect');
  const laterSelect = document.getElementById('laterDateSelect');

  dateSelect.innerHTML = '';
  earlierSelect.innerHTML = '';
  laterSelect.innerHTML = '';

  obsList.forEach((obs, idx) => {
    const opt = document.createElement('option');
    opt.value = obs.id;
    opt.textContent = `${obs.date} (${obs.satellite} - ${obs.area_km2} km²)`;
    dateSelect.appendChild(opt);

    const optE = opt.cloneNode(true);
    earlierSelect.appendChild(optE);

    const optL = opt.cloneNode(true);
    laterSelect.appendChild(optL);
  });

  // Default selection: select latest NISAR observation
  const latestNisar = obsList.filter(o => o.satellite === 'NISAR').pop() || obsList[obsList.length - 1];
  dateSelect.value = latestNisar.id;
  updateObservationView(latestNisar.id);

  // Set default comparison: Pre-GLOF vs Latest
  if (obsList.length >= 2) {
    earlierSelect.value = obsList[0].id; // 2023-09-28 Pre-GLOF
    laterSelect.value = latestNisar.id;
    runComparison(obsList[0].id, latestNisar.id);
  }

  // Populate Landmark Comparisons Table
  populateLandmarksTable();

  // Populate Time-Series Chart
  renderTimeSeriesChart();

  // Populate GLOF Susceptibility Indicators
  renderSusceptibility();
}

function updateObservationView(obsId) {
  const obs = (analyticsData.observations || []).find(o => o.id === obsId);
  if (!obs) return;

  // Update pill and meta
  document.getElementById('satellitePill').textContent = obs.satellite;
  document.getElementById('lakeAreaVal').textContent = obs.area_km2.toFixed(3);
  document.getElementById('lakeAreaHa').textContent = `${obs.area_ha.toFixed(1)} hectares`;
  document.getElementById('lakeAreaM2').textContent = `${Number(obs.area_m2).toLocaleString()} m²`;

  document.getElementById('metaDate').textContent = obs.date;
  document.getElementById('metaSat').textContent = `${obs.satellite} (${obs.sensor})`;
  document.getElementById('metaPol').textContent = obs.polarization;
  document.getElementById('metaStatus').textContent = obs.status;

  // Update delta pill compared to pre-GLOF
  const preGlafArea = 1.624;
  const deltaFromPre = ((obs.area_km2 - preGlafArea) / preGlafArea) * 100.0;
  const deltaPill = document.getElementById('areaDeltaPill');
  const deltaText = document.getElementById('areaDeltaText');
  if (obs.satellite === 'Sentinel-1A') {
    deltaText.textContent = "Historical Pre-Event Baseline";
    deltaPill.style.background = "rgba(56, 189, 248, 0.15)";
    deltaPill.style.color = "#38BDF8";
  } else {
    deltaText.textContent = `${deltaFromPre.toFixed(1)}% vs Pre-GLOF Baseline`;
    deltaPill.style.background = "rgba(239, 68, 68, 0.15)";
    deltaPill.style.color = "#F87171";
  }

  // Update Radar Overlay Layer
  if (radarOverlay) {
    map.removeLayer(radarOverlay);
    radarOverlay = null;
  }

  const opacity = parseFloat(document.getElementById('opacitySlider').value) / 100.0;
  if (obs.radar_layer_url && document.getElementById('toggleRadar').checked) {
    radarOverlay = L.imageOverlay(obs.radar_layer_url, obs.bounds, {
      opacity: opacity,
      interactive: false
    }).addTo(map);
  }

  // Update Lake Boundary Layer
  if (boundaryLayer) {
    map.removeLayer(boundaryLayer);
    boundaryLayer = null;
  }

  if (obs.boundary_geojson_url && document.getElementById('toggleBoundary').checked) {
    fetch(obs.boundary_geojson_url)
      .then(res => res.json())
      .then(geoJson => {
        boundaryLayer = L.geoJSON(geoJson, {
          style: {
            color: '#06B6D4',
            weight: 2.5,
            fillColor: '#06B6D4',
            fillOpacity: 0.35,
            dashArray: obs.satellite === 'Sentinel-1A' ? '6, 6' : null
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <strong>${obs.satellite} Lake Boundary</strong><br>
              Date: <b>${obs.date}</b><br>
              Area: <b>${obs.area_km2} km²</b> (${obs.area_ha} ha)<br>
              Method: <em>${feature.properties.method || 'GMM-EM'}</em>
            `);
          }
        }).addTo(map);
      });
  }
}

function runComparison(earlierId, laterId) {
  const obsList = analyticsData.observations || [];
  const o1 = obsList.find(o => o.id === earlierId);
  const o2 = obsList.find(o => o.id === laterId);
  if (!o1 || !o2) return;

  document.getElementById('earlierArea').textContent = `${o1.area_km2} km² (${o1.date})`;
  document.getElementById('laterArea').textContent = `${o2.area_km2} km² (${o2.date})`;

  const diffKm2 = o2["area_km2"] - o1["area_km2"];
  const pctChange = o1["area_km2"] > 0 ? (diffKm2 / o1["area_km2"]) * 100.0 : 0.0;

  const resDeltaKm2 = document.getElementById('resDeltaKm2');
  const resDeltaPct = document.getElementById('resDeltaPct');
  const resTrendBadge = document.getElementById('resTrendBadge');

  const sign = diffKm2 > 0 ? "+" : "";
  resDeltaKm2.textContent = `${sign}${diffKm2.toFixed(4)} km²`;
  resDeltaPct.textContent = `${sign}${pctChange.toFixed(1)}%`;

  if (diffKm2 > 0.01) {
    resTrendBadge.textContent = "Expansion";
    resTrendBadge.className = "trend-badge trend-expansion";
    resDeltaKm2.style.color = "#F59E0B";
  } else if (diffKm2 < -0.01) {
    resTrendBadge.textContent = "Reduction / Drain";
    resTrendBadge.className = "trend-badge trend-reduction";
    resDeltaKm2.style.color = "#34D399";
  } else {
    resTrendBadge.textContent = "Stable";
    resTrendBadge.className = "trend-badge trend-stable";
    resDeltaKm2.style.color = "#94A3B8";
  }

  // Render both boundaries on the map for visual diff
  renderComparisonMapOverlay(o1, o2);
}

function renderComparisonMapOverlay(o1, o2) {
  if (comparisonEarlierLayer) map.removeLayer(comparisonEarlierLayer);
  if (comparisonLaterLayer) map.removeLayer(comparisonLaterLayer);

  // Earlier boundary in Orange dashed
  fetch(o1.boundary_geojson_url)
    .then(r => r.json())
    .then(geo => {
      comparisonEarlierLayer = L.geoJSON(geo, {
        style: {
          color: '#F59E0B',
          weight: 2,
          fillColor: '#F59E0B',
          fillOpacity: 0.15,
          dashArray: '5, 5'
        }
      }).addTo(map);
      comparisonEarlierLayer.bindTooltip(`Earlier: ${o1.date} (${o1.area_km2} km²)`, { sticky: true });
    });

  // Later boundary in Cyan solid
  fetch(o2.boundary_geojson_url)
    .then(r => r.json())
    .then(geo => {
      comparisonLaterLayer = L.geoJSON(geo, {
        style: {
          color: '#06B6D4',
          weight: 2.5,
          fillColor: '#06B6D4',
          fillOpacity: 0.3
        }
      }).addTo(map);
      comparisonLaterLayer.bindTooltip(`Later: ${o2.date} (${o2.area_km2} km²)`, { sticky: true });
    });
}

function populateLandmarksTable() {
  const comparisons = analyticsData.comparisons || [];
  const tbody = document.getElementById('landmarkTableBody');
  tbody.innerHTML = '';

  comparisons.forEach(c => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.title = 'Click to view this comparison';

    const trendClass = c.trend === 'Expansion' ? 'trend-expansion' : (c.trend === 'Reduction' ? 'trend-reduction' : 'trend-stable');
    const sign = c.area_change_km2 > 0 ? '+' : '';

    tr.innerHTML = `
      <td><strong>${c.comparison_title}</strong></td>
      <td>${c.earlier_date}</td>
      <td>${c.later_date}</td>
      <td>${c.earlier_area_km2.toFixed(3)} km²</td>
      <td>${c.later_area_km2.toFixed(3)} km²</td>
      <td><strong>${sign}${c.area_change_km2.toFixed(3)} km²</strong></td>
      <td>${sign}${c.percentage_change.toFixed(1)}%</td>
      <td><span class="trend-badge ${trendClass}">${c.trend}</span></td>
    `;

    tr.addEventListener('click', () => {
      document.getElementById('earlierDateSelect').value = c.earlier_id;
      document.getElementById('laterDateSelect').value = c.later_id;
      runComparison(c.earlier_id, c.later_id);
      tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    tbody.appendChild(tr);
  });
}

function renderTimeSeriesChart() {
  const obsList = analyticsData.observations || [];
  if (obsList.length === 0) return;

  const ctx = document.getElementById('areaChart').getContext('2d');

  const labels = obsList.map(o => o.date);
  const areas = obsList.map(o => o.area_km2);
  const pointColors = obsList.map(o => o.satellite === 'Sentinel-1A' ? '#EF4444' : '#38BDF8');
  const pointRadii = obsList.map(o => o.satellite === 'Sentinel-1A' ? 7 : 4);

  if (areaChart) areaChart.destroy();

  areaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Lake Surface Area (km²)',
        data: areas,
        borderColor: '#0284C7',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: pointRadii,
        pointHoverRadius: 8,
        tension: 0.15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          titleColor: '#F8FAFC',
          bodyColor: '#38BDF8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => `Date: ${items[0].label}`,
            label: (item) => {
              const obs = obsList[item.dataIndex];
              return [
                `Area: ${obs.area_km2} km² (${obs.area_ha} ha)`,
                `Satellite: ${obs.satellite} (${obs.status})`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94A3B8', font: { size: 10, family: 'JetBrains Mono' }, maxRotation: 45 }
        },
        y: {
          min: 0,
          max: 2.0,
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: {
            color: '#94A3B8',
            font: { size: 11, family: 'JetBrains Mono' },
            callback: (val) => `${val} km²`
          },
          title: {
            display: true,
            text: 'Surface Area (km²)',
            color: '#94A3B8',
            font: { size: 12, weight: 'bold' }
          }
        }
      },
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          const selectedObs = obsList[idx];
          document.getElementById('dateSelect').value = selectedObs.id;
          updateObservationView(selectedObs.id);
        }
      }
    }
  });
}

function renderSusceptibility() {
  const indicators = (analyticsData.susceptibility || {}).indicators || [];
  const grid = document.getElementById('riskGrid');
  grid.innerHTML = '';

  indicators.forEach(ind => {
    const card = document.createElement('div');
    card.className = 'risk-card-item';
    card.innerHTML = `
      <div class="risk-category">${ind.category}</div>
      <div class="risk-indicator-title">${ind.indicator}</div>
      <div class="risk-status">${ind.status}</div>
      <div class="risk-footer">
        <span><strong>Confidence:</strong> ${ind.confidence}</span>
        <span style="color: #F59E0B"><strong>${ind.risk_level}</strong></span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initEventListeners() {
  // Date selector
  document.getElementById('dateSelect').addEventListener('change', (e) => {
    updateObservationView(e.target.value);
  });

  // Custom comparison button
  document.getElementById('btnCompareCustom').addEventListener('click', () => {
    const eId = document.getElementById('earlierDateSelect').value;
    const lId = document.getElementById('laterDateSelect').value;
    runComparison(eId, lId);
  });

  // Opacity slider
  document.getElementById('opacitySlider').addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('opacityVal').textContent = `${val}%`;
    if (radarOverlay) {
      radarOverlay.setOpacity(parseFloat(val) / 100.0);
    }
  });

  // Toggles
  document.getElementById('toggleBoundary').addEventListener('change', (e) => {
    if (boundaryLayer) {
      if (e.target.checked) map.addLayer(boundaryLayer);
      else map.removeLayer(boundaryLayer);
    }
  });

  document.getElementById('toggleRadar').addEventListener('change', (e) => {
    if (radarOverlay) {
      if (e.target.checked) map.addLayer(radarOverlay);
      else map.removeLayer(radarOverlay);
    }
  });

  document.getElementById('toggleMoraine').addEventListener('change', (e) => {
    if (moraineMarker) {
      if (e.target.checked) map.addLayer(moraineMarker);
      else map.removeLayer(moraineMarker);
    }
  });
}
