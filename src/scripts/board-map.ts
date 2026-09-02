import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapPoint } from '../data/locations';

function label(status: MapPoint['status']): string {
  if (status === 'live') return 'LIVE';
  if (status === '247') return '24/7';
  if (status === 'scheduled') return 'SCHEDULED';
  return 'OFF';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function popupHtml(point: MapPoint): string {
  const rows = point.streams
    .map((s) => {
      const thumb = s.thumb
        ? `<img class="map-pop-thumb" src="${escapeHtml(s.thumb)}" alt="" width="160" height="90" loading="lazy">`
        : '';
      return `<div class="map-pop-stream${s.thumb ? '' : ' map-pop-stream-text'}">
        ${thumb}
        <div>
          <div class="map-pop-name">${escapeHtml(s.name)}</div>
          <div class="map-pop-meta">${escapeHtml(s.handle)} · ${label(s.status)}</div>
          <div class="map-pop-actions">
            <a href="${escapeHtml(s.watchUrl)}" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="/watch?id=${encodeURIComponent(s.id)}">Play here</a>
          </div>
        </div>
      </div>`;
    })
    .join('');
  const page = point.hasPage
    ? `<a class="map-pop-page" href="/airports/${point.code.toLowerCase()}">${escapeHtml(point.code)} airport page</a>`
    : '';
  return `<div class="map-pop">
    <p class="map-pop-code">${escapeHtml(point.code)}</p>
    <p class="map-pop-city">${escapeHtml(point.name)} · ${escapeHtml(point.city)}</p>
    ${rows}
    ${page}
  </div>`;
}

function initMap(root: HTMLElement) {
  const holder = root.querySelector<HTMLElement>('[data-board-map]');
  const json = root.querySelector('[data-map-points]');
  if (!holder || !json || holder.dataset.ready === '1') return;
  const points = JSON.parse(json.textContent ?? '[]') as MapPoint[];
  if (!points.length) return;
  holder.dataset.ready = '1';

  const full = holder.dataset.full === '1';
  const map = L.map(holder, {
    scrollWheelZoom: full,
    zoomControl: true,
    attributionControl: true,
  });

  // Carto dark_all now watermarks "API key required". Esri imagery needs no key
  // and you can actually see the runways.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  }).addTo(map);

  const bounds = L.latLngBounds([]);
  for (const point of points) {
    const icon = L.divIcon({
      className: `arl-marker arl-marker-${point.status}`,
      html: `<span class="arl-pin"><b>${point.code}</b></span>`,
      iconSize: [52, 28],
      iconAnchor: [26, 28],
      popupAnchor: [0, -24],
    });
    const marker = L.marker([point.lat, point.lon], { icon, title: `${point.code} ${point.city}` });
    marker.bindPopup(popupHtml(point), { maxWidth: 320, className: 'arl-popup' });
    marker.addTo(map);
    bounds.extend([point.lat, point.lon]);
  }

  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.18));
  } else {
    map.setView([20, -40], 2);
  }

  if (!full) {
    holder.addEventListener('click', () => map.scrollWheelZoom.enable());
  }

  requestAnimationFrame(() => map.invalidateSize());
}

export function initBoardMaps() {
  document.querySelectorAll<HTMLElement>('[data-map-root]').forEach(initMap);
}

initBoardMaps();
