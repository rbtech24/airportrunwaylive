import type { StatusCache, StreamStatus } from '../data/types';

const rank: Record<StreamStatus, number> = {
  live: 0,
  '247': 1,
  scheduled: 2,
  off: 3,
};

function label(status: StreamStatus): string {
  if (status === 'live') return 'LIVE';
  if (status === '247') return '24/7';
  if (status === 'scheduled') return 'SCHEDULED';
  return 'OFF';
}

function renderBadge(host: boolean, featuredSlot: boolean, status: StreamStatus): string {
  const hostHtml = host ? '<span class="badge badge-host">HOST</span>' : '';
  const pin = featuredSlot ? '<span class="badge badge-host">PIN</span>' : '';
  const dot = status === 'live' ? '<span class="dot" aria-hidden="true"></span>' : '';
  const cls = status === '247' ? '247' : status;
  return `${hostHtml}${pin}<span class="badge badge-${cls}">${dot}${label(status)}</span>`;
}

function sortCards(grid: HTMLElement) {
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-stream-card]')];
  cards.sort((a, b) => {
    const sr =
      rank[(a.dataset.status as StreamStatus) ?? 'off'] -
      rank[(b.dataset.status as StreamStatus) ?? 'off'];
    if (sr !== 0) return sr;
    if (a.dataset.slot !== b.dataset.slot) return a.dataset.slot === '1' ? -1 : 1;
    if (a.dataset.featured !== b.dataset.featured) return a.dataset.featured === '1' ? -1 : 1;
    if (a.dataset.host !== b.dataset.host) return a.dataset.host === '1' ? -1 : 1;
    return (a.dataset.airport ?? '').localeCompare(b.dataset.airport ?? '');
  });
  for (const card of cards) grid.append(card);
}

export async function applyBoardStatus() {
  try {
    const res = await fetch('/data/status.json', { cache: 'no-store' });
    if (!res.ok) return;
    const cache = (await res.json()) as StatusCache;
    if (!cache?.streams || Object.keys(cache.streams).length === 0) return;

    document.querySelectorAll<HTMLElement>('[data-stream-card]').forEach((card) => {
      const id = card.dataset.id;
      if (!id || !cache.streams[id]) return;
      const entry = cache.streams[id];
      card.dataset.status = entry.status;
      const badges = card.querySelector('.badges');
      if (badges) {
        badges.innerHTML = renderBadge(card.dataset.host === '1', card.dataset.slot === '1', entry.status);
      }
      const watch = card.querySelector<HTMLAnchorElement>('[data-watch-out]');
      if (watch && entry.videoId) watch.href = `https://www.youtube.com/watch?v=${entry.videoId}`;
      if (entry.videoId) {
        card.dataset.embedId = entry.videoId;
        const slot = card.querySelector<HTMLElement>('[data-player-slot]');
        if (slot) slot.dataset.embedId = entry.videoId;
        const img = card.querySelector<HTMLImageElement>('[data-thumb]');
        if (img) img.src = `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`;
      }
    });

    document.querySelectorAll<HTMLElement>('[data-grid]').forEach(sortCards);
    document.dispatchEvent(new Event('arl:status'));

    const stamp = document.querySelector('[data-board-stamp]');
    if (stamp && cache.updatedAt) {
      const when = new Date(cache.updatedAt);
      stamp.textContent = `Board cache ${when.toLocaleString()} · ${cache.source}`;
    }
  } catch {
    /* catalog badges stay */
  }
}

export async function applyAlert() {
  const banner = document.querySelector<HTMLElement>('[data-alert-banner]');
  const tonightBar = document.querySelector<HTMLElement>('[data-tonight-bar]');
  try {
    const res = await fetch('/data/site-config.json', { cache: 'no-store' });
    if (!res.ok) return;
    const cfg = (await res.json()) as {
      alert?: string;
      tonight?: string;
      tonightDate?: string;
      stormAirport?: string;
    };
    const storm = (cfg.stormAirport ?? '').trim().toUpperCase();
    const text =
      (cfg.alert ?? '').trim() ||
      (storm ? `Ops night at ${storm} — watch the lives on the board.` : '');
    if (banner) {
      if (!text) banner.hidden = true;
      else {
        const inner = banner.querySelector('[data-alert-text]');
        if (inner) inner.textContent = text;
        const link = banner.querySelector<HTMLAnchorElement>('[data-alert-link]');
        if (link) {
          if (storm) {
            link.href = `/airports/${storm.toLowerCase()}`;
            link.removeAttribute('aria-disabled');
          } else {
            link.removeAttribute('href');
          }
        }
        banner.hidden = false;
      }
    }
    const tonight = (cfg.tonight ?? '').trim();
    if (tonightBar) {
      if (!tonight) tonightBar.hidden = true;
      else {
        const inner = tonightBar.querySelector('[data-tonight-text]');
        const date = (cfg.tonightDate ?? '').trim();
        if (inner) inner.textContent = date ? `${date} · ${tonight}` : tonight;
        tonightBar.hidden = false;
      }
    }
  } catch {
    /* keep build-time alert */
  }
}

applyBoardStatus();
applyAlert();
