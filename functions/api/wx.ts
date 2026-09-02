export const onRequestGet = async ({ request }: { request: Request }) => {
  const icao = new URL(request.url).searchParams.get('icao')?.replace(/[^A-Za-z0-9]/g, '').toUpperCase() ?? '';
  if (icao.length < 3 || icao.length > 4) {
    return new Response(JSON.stringify({ error: 'icao required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(icao)}&format=json`;
  const upstream = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AirportRunwaysLive/1.0 (https://www.airportrunwayslive.com)',
    },
  });
  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: 'weather upstream failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const data = await upstream.json();
  const row = Array.isArray(data) ? data[0] : null;
  return new Response(JSON.stringify(row ?? {}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=120',
    },
  });
};
