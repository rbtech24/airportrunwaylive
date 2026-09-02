import { getPrefs, setPrefs } from './prefs.ts';

export function initLiveBoard() {
  const root = document.querySelector<HTMLElement>('[data-live-board]');
  if (!root) return;

  const cards = [...root.querySelectorAll<HTMLElement>('[data-stream-card]')];
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const search = root.querySelector<HTMLInputElement>('[data-search]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  let filter = 'all';

  function matches(card: HTMLElement, q: string): boolean {
    if (filter === 'live' && card.dataset.status !== 'live') return false;
    if (filter === '247' && card.dataset.type !== '247' && card.dataset.status !== '247') return false;
    if (filter === 'hosted' && card.dataset.type !== 'hosted') return false;
    if (filter === 'us' && card.dataset.region !== 'us') return false;
    if (filter === 'europe' && card.dataset.region !== 'europe') return false;
    if (filter === 'caribbean' && card.dataset.region !== 'caribbean') return false;
    if (filter === 'latam' && card.dataset.region !== 'latam') return false;
    if (filter === 'oceania' && card.dataset.region !== 'oceania') return false;
    if (filter === 'asia' && card.dataset.region !== 'asia') return false;
    if (filter === 'ours' && card.dataset.host !== '1') return false;

    if (!q) return true;
    const hay = [card.dataset.airport, card.dataset.city, card.dataset.name, card.dataset.handle]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  }

  function apply() {
    const q = (search?.value ?? '').trim().toLowerCase();
    let shown = 0;
    for (const card of cards) {
      const on = matches(card, q);
      card.hidden = !on;
      if (on) shown += 1;
    }
    empty?.classList.toggle('is-visible', shown === 0);
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter ?? 'all';
      setPrefs({ filter });
      chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      apply();
    });
  });

  const saved = getPrefs().filter;
  if (saved && chips.some((c) => c.dataset.filter === saved)) {
    filter = saved;
    chips.forEach((c) => c.setAttribute('aria-pressed', c.dataset.filter === saved ? 'true' : 'false'));
  }

  search?.addEventListener('input', apply);
  apply();

  document.addEventListener('arl:status', apply);
}

initLiveBoard();
