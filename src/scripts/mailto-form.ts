import { site } from '../data/site';

export function bindMailtoForm() {
  document.querySelectorAll<HTMLFormElement>('[data-mailto-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const subject = form.dataset.subject ?? 'Airport Runways Live';
      const data = new FormData(form);
      const lines = [...data.entries()].map(([k, v]) => `${k}: ${String(v)}`);
      const body = encodeURIComponent(lines.join('\n'));
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;
    });
  });
}
