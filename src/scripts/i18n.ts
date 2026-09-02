import { strings, type Lang } from '../i18n/strings';
import { counterpartPath } from '../i18n/lang';

const KEY = 'arl-lang';

export function currentLang(): Lang {
  const html = document.documentElement.lang;
  if (html === 'es') return 'es';
  const stored = localStorage.getItem(KEY);
  return stored === 'es' ? 'es' : 'en';
}

export function applyLang(lang: Lang) {
  document.documentElement.lang = lang;
  localStorage.setItem(KEY, lang);
  const dict = strings[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as keyof typeof dict;
    if (key && dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder as keyof typeof dict;
    if (key && dict[key]) el.placeholder = dict[key];
  });
  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((el) => {
    el.classList.toggle('is-on', el.getAttribute('data-lang') === lang);
  });
}

export function initI18n() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const fromPath = path === '/es' || path.startsWith('/es/') ? 'es' : 'en';
  const lang = fromPath === 'es' ? 'es' : currentLang();
  applyLang(lang);

  document.querySelectorAll<HTMLAnchorElement>('[data-lang]').forEach((a) => {
    a.addEventListener('click', (event) => {
      const target = (a.getAttribute('data-lang') ?? 'en') as Lang;
      const mapped = counterpartPath(path, target);
      if (mapped) return;
      event.preventDefault();
      applyLang(target);
    });
  });
}

initI18n();
