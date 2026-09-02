interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let payload: { subject?: string; fields?: Record<string, string> };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const fields = payload.fields ?? {};
  if (fields.company) return json({ ok: true }, 200);

  const key = env.RESEND_API_KEY?.trim();
  if (!key) return json({ ok: false, error: 'RESEND_API_KEY is not set' }, 503);

  const from = env.RESEND_FROM?.trim() || 'Airport Runways Live <hello@airportrunwayslive.com>';
  const to = env.RESEND_TO?.trim() || 'hello@airportrunwayslive.com';
  const subject = (payload.subject || 'Airport Runways Live').slice(0, 140);
  const lines = Object.entries(fields)
    .filter(([k]) => k !== 'company')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const reply = fields.email?.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[ARL] ${subject}`,
      text: lines || '(empty form)',
      ...(reply ? { reply_to: reply } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return json({ ok: false, error: body.slice(0, 400) }, 502);
  }

  return json({ ok: true });
};
