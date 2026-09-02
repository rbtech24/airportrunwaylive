// @ts-expect-error globe.gl ships without complete TypeScript types
import Globe from 'globe.gl';
import type { MapPoint } from '../data/locations';
import type { StatusCache } from '../data/types';
import { getPrefs, setPrefs } from './prefs.ts';

function subsolar(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const doy = (date.getTime() - start) / 86400000;
  const lat = -23.44 * Math.cos((2 * Math.PI * (doy + 10)) / 365);
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lng = -15 * (hours - 12);
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;
  return { lat, lng };
}

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
  if (status === 'scheduled') return '#c5d0de';
  return '#5c6b80';
}

function panelHtml(point: MapPoint): string {
  const playing = point.streams.find((s) => s.status === 'live' || (s.status === '247' && s.embedId));
  const now = playing?.embedId
    ? `<div class="card-media globe-now-player" data-player-slot data-embed-id="${escapeHtml(playing.embedId)}">
         <button class="facade" type="button" data-facade data-play aria-label="Play official YouTube player">
           <img src="https://i.ytimg.com/vi/${escapeHtml(playing.embedId)}/hqdefault.jpg" alt="" width="320" height="180" data-thumb>
           <span class="play-btn" aria-hidden="true"></span>
         </button>
       </div>`
    : '';
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
  return `<button class="globe-panel-close" type="button" data-globe-close aria-label="Close">×</button>
    <p class="map-pop-code">${escapeHtml(point.code)}</p>
    <p class="map-pop-city">${escapeHtml(point.name)} · ${escapeHtml(point.city)}</p>
    ${now}
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

  const applyCache = (cache: StatusCache) => {
    for (const point of points) {
      for (const stream of point.streams) {
        const hit = cache.streams[stream.id];
        if (!hit) continue;
        stream.status = hit.status;
        if (hit.videoId) {
          stream.embedId = hit.videoId;
          stream.thumb = `https://i.ytimg.com/vi/${hit.videoId}/hqdefault.jpg`;
          stream.watchUrl = `https://www.youtube.com/watch?v=${hit.videoId}`;
        }
      }
      const best = [...point.streams].sort((a, b) => {
        const rank = { live: 0, '247': 1, scheduled: 2, off: 3 };
        return rank[a.status] - rank[b.status];
      })[0];
      if (best) point.status = best.status;
    }
  };

  const rings = () => {
    const on = points.filter((p) => p.status === '247' || p.status === 'live');
    if (storm) {
      const hit = points.find((p) => p.code === storm);
      if (hit && !on.some((p) => p.code === hit.code)) on.push(hit);
    }
    return on;
  };

  let storm = '';
  const sun = subsolar();
  const sunHud = root.querySelector('[data-sun-label]');
  if (sunHud) {
    const ns = sun.lat >= 0 ? `${sun.lat.toFixed(0)}°N` : `${Math.abs(sun.lat).toFixed(0)}°S`;
    const ew = sun.lng >= 0 ? `${sun.lng.toFixed(0)}°E` : `${Math.abs(sun.lng).toFixed(0)}°W`;
    sunHud.textContent = `Sun ${ns} ${ew}`;
  }

  const globe = Globe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .backgroundColor('rgba(7,20,40,0)')
    .atmosphereColor('#9fd4ff')
    .atmosphereAltitude(0.22)
    .showGlobe(true)
    .showAtmosphere(true)
    .pointsData(points)
    .pointLat('lat')
    .pointLng('lon')
    .pointAltitude(0.02)
    .pointRadius((d) => ((d as MapPoint).status === '247' || (d as MapPoint).status === 'live' ? 0.72 : 0.48))
    .pointColor((d) => pinColor((d as MapPoint).status))
    .pointsMerge(false)
    .ringsData(rings())
    .ringLat('lat')
    .ringLng('lon')
    .ringColor((d) => ((d as MapPoint).code === storm ? '#e23d3d' : pinColor((d as MapPoint).status)))
    .ringMaxRadius(3.2)
    .ringPropagationSpeed(2.2)
    .ringRepeatPeriod(1400)
    .htmlElementsData(points)
    .htmlLat('lat')
    .htmlLng('lon')
    .htmlAltitude(0.045)
    .htmlElement((d) => {
      const point = d as MapPoint;
      const wrap = document.createElement('div');
      const hot = point.status === 'live' || point.status === '247';
      const thumb = point.streams.find((s) => s.embedId)?.embedId;
      wrap.innerHTML = `<button class="globe-pin globe-pin-${point.status}${hot ? ' globe-pin-hot' : ''}" type="button">${point.code}${hot && thumb ? `<img class="globe-pin-thumb" src="https://i.ytimg.com/vi/${thumb}/mqdefault.jpg" alt="">` : ''}</button>`;
      wrap.style.pointerEvents = 'auto';
      wrap.onclick = (event) => {
        event.stopPropagation();
        openPoint(point);
      };
      return wrap;
    })
    .onPointClick((d) => openPoint(d as MapPoint))(holder);

  function openPoint(point: MapPoint) {
    if (panel) {
      panel.innerHTML = panelHtml(point);
      panel.hidden = false;
      panel.querySelector('[data-globe-close]')?.addEventListener('click', () => {
        panel.hidden = true;
        globe.controls().autoRotate = true;
      });
    }
    globe.pointOfView({ lat: point.lat, lng: point.lon, altitude: 1.55 }, 1100);
    globe.controls().autoRotate = false;
    setPrefs({ pin: point.code, stream: point.streams[0]?.id });
  }

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.45;
  globe.controls().enableZoom = true;
  globe.controls().enableDamping = true;
  globe.pointOfView({ lat: 22, lng: -20, altitude: 1.85 }, 0);

  // Daylight map + fill light so continents stay readable (the night texture hid the land).
  const lighten = () => {
    const scene = globe.scene?.();
    if (!scene) return;
    for (const child of scene.children) {
      const anyChild = child as { isAmbientLight?: boolean; isDirectionalLight?: boolean; intensity?: number; position?: { set: (x: number, y: number, z: number) => void } };
      if (anyChild.isAmbientLight) anyChild.intensity = 0.72;
      if (anyChild.isDirectionalLight) {
        anyChild.intensity = 2.1;
        const phi = ((90 - sun.lat) * Math.PI) / 180;
        const theta = ((sun.lng + 180) * Math.PI) / 180;
        anyChild.position?.set(
          Math.sin(phi) * Math.cos(theta) * 8,
          Math.cos(phi) * 8,
          Math.sin(phi) * Math.sin(theta) * 8,
        );
      }
    }
    const mat = globe.globeMaterial?.();
    if (mat) {
      mat.emissiveIntensity = 0.28;
      if (mat.color?.set) mat.color.set('#ffffff');
    }
  };
  lighten();
  setTimeout(lighten, 400);
  setTimeout(lighten, 1200);

  holder.addEventListener('pointerenter', () => {
    globe.controls().autoRotate = false;
  });
  holder.addEventListener('pointerleave', () => {
    if (panel?.hidden !== false) globe.controls().autoRotate = true;
  });

  const size = () => {
    const w = holder.clientWidth;
    const h = holder.clientHeight;
    if (w > 0 && h > 0) {
      globe.width(w);
      globe.height(h);
    }
  };
  size();
  requestAnimationFrame(size);
  new ResizeObserver(size).observe(holder);

  const icao = new URLSearchParams(window.location.search).get('icao')?.toUpperCase();
  const last = getPrefs().pin;
  const focus = points.find((p) => p.code === icao) ?? points.find((p) => p.code === last);
  if (focus) setTimeout(() => openPoint(focus), 700);

  fetch('/data/status.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((cache: StatusCache) => {
      if (!cache?.streams) return;
      applyCache(cache);
      globe.pointsData([...points]);
      globe.ringsData(rings());
      globe.htmlElementsData([...points]);
    })
    .catch(() => undefined);

  fetch('/data/site-config.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((cfg: { stormAirport?: string }) => {
      storm = (cfg.stormAirport ?? '').toUpperCase();
      globe.ringsData(rings());
    })
    .catch(() => undefined);
}

export function initBoardGlobes() {
  document.querySelectorAll<HTMLElement>('[data-map-root]').forEach(initGlobe);
}

initBoardGlobes();
