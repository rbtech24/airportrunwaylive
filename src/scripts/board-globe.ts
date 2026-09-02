// @ts-expect-error globe.gl ships without complete TypeScript types
import Globe from 'globe.gl';
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

function pinColor(status: MapPoint['status']): string {
  if (status === 'live') return '#e23d3d';
  if (status === '247') return '#e8a317';
  if (status === 'scheduled') return '#8a97ab';
  return '#5c6b80';
}

function panelHtml(point: MapPoint): string {
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
  return `<p class="map-pop-code">${escapeHtml(point.code)}</p>
    <p class="map-pop-city">${escapeHtml(point.name)} · ${escapeHtml(point.city)}</p>
    ${rows}
    ${page}`;
}

function initGlobe(root: HTMLElement) {
  const holder = root.querySelector<HTMLElement>('[data-board-map]');
  const json = root.querySelector('[data-map-points]');
  const panel = root.querySelector<HTMLElement>('[data-globe-panel]');
  if (!holder || !json || holder.dataset.ready === '1') return;
  const points = JSON.parse(json.textContent ?? '[]') as MapPoint[];
  if (!points.length) return;
  holder.dataset.ready = '1';

  const full = holder.dataset.full === '1';
  const globe = Globe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('rgba(7,20,40,0)')
    .atmosphereColor('#7eb6e8')
    .atmosphereAltitude(0.16)
    .pointsData(points)
    .pointLat('lat')
    .pointLng('lon')
    .pointAltitude(0.02)
    .pointRadius(0.42)
    .pointColor((d) => pinColor((d as MapPoint).status))
    .pointLabel((d) => {
      const p = d as MapPoint;
      return `${p.code} · ${p.city}`;
    })
    .onPointClick((d) => {
      const point = d as MapPoint;
      if (panel) {
        panel.innerHTML = panelHtml(point);
        panel.hidden = false;
      }
      globe.pointOfView({ lat: point.lat, lng: point.lon, altitude: 1.85 }, 900);
      globe.controls().autoRotate = false;
    })(holder);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.55;
  globe.controls().enableZoom = true;

  const size = () => {
    globe.width(holder.clientWidth);
    globe.height(holder.clientHeight);
  };
  size();
  window.addEventListener('resize', size);

  if (!full) {
    globe.pointOfView({ lat: 20, lng: -40, altitude: 2.4 }, 0);
  }
}

export function initBoardGlobes() {
  document.querySelectorAll<HTMLElement>('[data-map-root]').forEach(initGlobe);
}

initBoardGlobes();
