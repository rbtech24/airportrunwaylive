import { strings, type Lang } from '../i18n/strings';
import { langFromPath } from '../i18n/lang';

/** English is the default. Spanish only on /es routes (or an explicit ?lang=es). */
export function currentLang(): Lang {
  if (langFromPath(window.location.pathname) === 'es') return 'es';
  if (new URLSearchParams(window.location.search).get('lang') === 'es') return 'es';
  return 'en';
}

export function applyLang(lang: Lang) {
  document.documentElement.lang = lang;
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
  try {
    localStorage.removeItem('arl-lang');
  } catch {
    /* ignore */
  }

  applyLang(currentLang());
}

initI18n();
