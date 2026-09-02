function embedSrc(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}

function restore(slot: HTMLElement) {
  const iframe = slot.querySelector('iframe');
  if (iframe) {
    iframe.src = 'about:blank';
    iframe.remove();
  }
  slot.classList.remove('is-playing');
  const facade = slot.querySelector<HTMLElement>('[data-facade]');
  if (facade) facade.hidden = false;
}

function destroyAll(except?: HTMLElement) {
  document.querySelectorAll<HTMLElement>('[data-player-slot].is-playing').forEach((slot) => {
    if (slot !== except) restore(slot);
  });
}

function play(slot: HTMLElement) {
  const id = slot.dataset.embedId;
  if (!id) return;
  if (slot.classList.contains('is-playing')) {
    restore(slot);
    return;
  }
  destroyAll(slot);
  const facade = slot.querySelector<HTMLElement>('[data-facade]');
  if (facade) facade.hidden = true;
  const iframe = document.createElement('iframe');
  iframe.src = embedSrc(id);
  iframe.title = 'Official YouTube player';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.setAttribute('allowfullscreen', '');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  slot.append(iframe);
  slot.classList.add('is-playing');
}

export function initLitePlayer() {
  document.addEventListener('click', (event) => {
    const playBtn = (event.target as HTMLElement | null)?.closest?.('[data-play]');
    if (!playBtn) return;
    const slot = playBtn.closest<HTMLElement>('[data-player-slot]');
    if (!slot?.dataset.embedId) return;
    event.preventDefault();
    play(slot);
  });

  document.querySelectorAll<HTMLImageElement>('[data-thumb]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback === 'mq') {
        img.src = '/images/hero-runway.jpg';
        return;
      }
      img.dataset.fallback = 'mq';
      img.src = img.src.replace('hqdefault.jpg', 'mqdefault.jpg');
    });
  });
}

initLitePlayer();
