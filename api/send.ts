import { sendBoardEmail } from '../src/lib/send-email';

export default async function handler(
  req: { method?: string; body?: { subject?: string; fields?: Record<string, string> } | string },
  res: { status: (n: number) => { json: (b: unknown) => unknown } },
) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  const fields = payload.fields ?? {};
  if (fields.company) {
    res.status(200).json({ ok: true });
    return;
  }
  const result = await sendBoardEmail(
    {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM: process.env.RESEND_FROM,
      RESEND_TO: process.env.RESEND_TO,
    },
    { subject: payload.subject ?? 'Airport Runways Live', fields },
  );
  res.status(result.status).json(result);
}
