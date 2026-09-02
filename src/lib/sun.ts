export function subsolar(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const doy = (date.getTime() - start) / 86400000;
  const lat = -23.44 * Math.cos((2 * Math.PI * (doy + 10)) / 365);
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lng = -15 * (hours - 12);
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;
  return { lat, lng };
}

/** Solar elevation in degrees at a lat/lon. */
export function solarElevation(lat: number, lon: number, date = new Date()) {
  const sun = subsolar(date);
  const toR = Math.PI / 180;
  const cosc =
    Math.sin(lat * toR) * Math.sin(sun.lat * toR) +
    Math.cos(lat * toR) * Math.cos(sun.lat * toR) * Math.cos((lon - sun.lng) * toR);
  const c = Math.acos(Math.min(1, Math.max(-1, cosc)));
  return 90 - (c * 180) / Math.PI;
}

/** Civil twilight through low sun — the spotting golden hour. */
export function isGoldenHour(lat: number, lon: number, date = new Date()) {
  const el = solarElevation(lat, lon, date);
  return el > -6 && el < 8;
}
