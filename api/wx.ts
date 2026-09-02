export default async function handler(
  req: { query?: { icao?: string | string[] } },
  res: { status: (n: number) => { json: (b: unknown) => unknown }; setHeader: (k: string, v: string) => void },
) {
  const raw = req.query?.icao;
  const icao = String(Array.isArray(raw) ? raw[0] : raw ?? '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
  if (icao.length < 3 || icao.length > 4) {
    res.status(400).json({ error: 'icao required' });
    return;
  }
  const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(icao)}&format=json`;
  const upstream = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AirportRunwaysLive/1.0 (https://www.airportrunwayslive.com)',
    },
  });
  if (!upstream.ok) {
    res.status(upstream.status).json({ error: 'weather upstream failed' });
    return;
  }
  const data = await upstream.json();
  const row = Array.isArray(data) ? data[0] : null;
  res.setHeader('Cache-Control', 'public, max-age=120');
  res.status(200).json(row ?? {});
}
