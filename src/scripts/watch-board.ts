import type { Stream } from '../data/types';

function badgeLabel(status: Stream['status']): string {
  if (status === 'live') return 'LIVE';
  if (status === '247') return '24/7';
  if (status === 'scheduled') return 'SCHEDULED';
  return 'OFF';
}

function watchUrl(stream: Stream): string {
  return stream.embedId ? `https://www.youtube.com/watch?v=${stream.embedId}` : stream.url;
}

function embedUrl(stream: Stream): string | null {
  return stream.embedId ? `https://www.youtube-nocookie.com/embed/${stream.embedId}?rel=0` : null;
}

export function initWatchBoard() {
  const root = document.querySelector<HTMLElement>('[data-watch]');
  const json = document.getElementById('stream-catalog');
  if (!root || !json) return;

  const catalog = JSON.parse(json.textContent ?? '[]') as Stream[];
  const byId = new Map(catalog.map((s) => [s.id, s]));
  const title = root.querySelector<HTMLElement>('[data-watch-title]');
  const meta = root.querySelector<HTMLElement>('[data-watch-meta]');
  const frame = root.querySelector<HTMLIFrameElement>('[data-watch-frame]');
  const fallback = root.querySelector<HTMLElement>('[data-watch-fallback]');
  const yt = root.querySelector<HTMLAnchorElement>('[data-watch-yt]');
  const notes = root.querySelector<HTMLElement>('[data-watch-notes]');
  const cams = root.querySelector<HTMLElement>('[data-watch-cams]');
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-watch-link]')];

  function render(id: string) {
    const stream = byId.get(id) ?? byId.get('arl-mco');
    if (!stream) return;
    const embed = embedUrl(stream);
    if (title) title.textContent = `${stream.airport} · ${stream.name}`;
    if (meta) meta.textContent = `${stream.city} · ${stream.handle} · ${badgeLabel(stream.status)}`;
    if (notes) notes.textContent = `Official YouTube player only. We do not restream. ${stream.notes}`;
    if (yt) {
      yt.href = watchUrl(stream);
      yt.hidden = false;
    }
    links.forEach((a) => a.classList.toggle('is-active', a.dataset.watchLink === stream.id));

    if (embed && frame && fallback) {
      fallback.hidden = true;
      frame.hidden = false;
      frame.title = `${stream.name} official YouTube player`;
      if (frame.src !== embed) frame.src = embed;
      if (cams) cams.hidden = true;
    } else if (frame && fallback) {
      frame.removeAttribute('src');
      frame.hidden = true;
      fallback.hidden = false;
      if (cams) cams.hidden = false;
    }
  }

  const requested = new URLSearchParams(window.location.search).get('id') ?? 'arl-mco';
  render(requested);
}

initWatchBoard();
