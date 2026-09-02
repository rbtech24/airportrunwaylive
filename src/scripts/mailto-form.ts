import { site } from '../data/site';

export function bindMailtoForm() {
  document.querySelectorAll<HTMLFormElement>('[data-mailto-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector<HTMLElement>('[data-form-status]');
      const subject = form.dataset.subject ?? 'Airport Runways Live';
      const data = new FormData(form);
      const fields: Record<string, string> = {};
      for (const [k, v] of data.entries()) fields[k] = String(v);

      if (status) {
        status.hidden = false;
        status.textContent = 'Sending…';
      }

      try {
        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, fields }),
        });
        if (res.ok) {
          form.reset();
          if (status) status.textContent = 'Sent. We will reply from hello@airportrunwaylive.com.';
          return;
        }
      } catch {
        /* fall through to mailto */
      }

      const lines = Object.entries(fields)
        .filter(([k]) => k !== 'company')
        .map(([k, v]) => `${k}: ${v}`);
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      if (status) {
        status.textContent = 'Resend is not configured yet — opening your email app.';
      }
      window.location.href = mailto;
    });
  });
}
