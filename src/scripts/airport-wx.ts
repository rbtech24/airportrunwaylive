type Metar = {
  icaoId?: string;
  fltCat?: string;
  temp?: number;
  wdir?: number | string;
  wspd?: number;
  visib?: string | number;
  cover?: string;
  wxString?: string;
  rawOb?: string;
  obsTime?: number | string;
};

function line(m: Metar): string {
  const bits = [];
  if (m.fltCat) bits.push(m.fltCat);
  if (typeof m.temp === 'number') bits.push(`${Math.round(m.temp)}°C`);
  if (m.wdir != null && m.wspd != null) bits.push(`wind ${m.wdir}°/${m.wspd}kt`);
  if (m.visib != null) bits.push(`vis ${m.visib}`);
  if (m.cover) bits.push(m.cover);
  if (m.wxString) bits.push(m.wxString);
  return bits.join(' · ') || 'Observation received';
}

async function fill(el: HTMLElement) {
  const icao = el.dataset.wx;
  if (!icao) return;
  const summary = el.querySelector('[data-wx-summary]');
  const raw = el.querySelector('[data-wx-raw]');
  try {
    const res = await fetch(`/api/wx?icao=${encodeURIComponent(icao)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('wx');
    const m = (await res.json()) as Metar;
    if (!m || (!m.rawOb && !m.fltCat)) {
      if (summary) summary.textContent = 'No METAR in the last cycle.';
      return;
    }
    if (summary) summary.textContent = line(m);
    if (raw && m.rawOb) raw.textContent = m.rawOb;
  } catch {
    if (summary) {
      summary.innerHTML = `Weather proxy offline. Read the METAR on <a href="https://aviationweather.gov/data/metar/?ids=${encodeURIComponent(icao)}" target="_blank" rel="noopener noreferrer">aviationweather.gov</a>.`;
    }
  }
}

document.querySelectorAll<HTMLElement>('[data-wx]').forEach(fill);
