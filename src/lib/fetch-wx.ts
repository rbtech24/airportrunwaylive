export interface MetarView {
  icao: string;
  fltCat?: string;
  temp?: number;
  dewp?: number;
  wdir?: number | string;
  wspd?: number;
  visib?: string | number;
  altim?: number;
  cover?: string;
  wxString?: string;
  rawOb?: string;
  obsTime?: string;
}

export async function fetchMetar(icao: string): Promise<MetarView | null> {
  const id = icao.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (id.length < 3 || id.length > 4) return null;
  const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(id)}&format=json`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AirportRunwaysLive/1.0 (https://www.airportrunwayslive.com)',
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as MetarView[];
  const row = Array.isArray(data) ? data[0] : null;
  return row ?? null;
}
