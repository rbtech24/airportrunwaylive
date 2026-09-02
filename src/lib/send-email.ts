export interface MailEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
}

export interface MailPayload {
  subject: string;
  fields: Record<string, string>;
}

export async function sendBoardEmail(env: MailEnv, payload: MailPayload) {
  const key = env.RESEND_API_KEY?.trim();
  if (!key) {
    return { ok: false as const, status: 503, error: 'RESEND_API_KEY is not set' };
  }

  const from = env.RESEND_FROM?.trim() || 'Airport Runways Live <hello@airportrunwayslive.com>';
  const to = env.RESEND_TO?.trim() || 'hello@airportrunwayslive.com';
  const subject = (payload.subject || 'Airport Runways Live').slice(0, 140);
  const lines = Object.entries(payload.fields)
    .filter(([k]) => k !== 'company')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const reply = payload.fields.email?.trim();

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
    return { ok: false as const, status: 502, error: body.slice(0, 500) };
  }

  return { ok: true as const, status: 200 };
}
