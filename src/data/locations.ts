import type { Stream, StreamStatus } from './types';
import { streams, youtubeThumbUrl, youtubeWatchUrl } from './catalog';

export interface GeoSpot {
  lat: number;
  lon: number;
  name: string;
  city: string;
}

/** Airport reference points for every field that has a stream (or a page). */
export const locations: Record<string, GeoSpot> = {
  MCO: { lat: 28.4312, lon: -81.3081, name: 'Orlando International', city: 'Orlando' },
  TPA: { lat: 27.9755, lon: -82.5332, name: 'Tampa International', city: 'Tampa' },
  BOG: { lat: 4.7016, lon: -74.1469, name: 'El Dorado International', city: 'Bogotá' },
  LAX: { lat: 33.9425, lon: -118.408, name: 'Los Angeles International', city: 'Los Angeles' },
  DFW: { lat: 32.8998, lon: -97.0403, name: 'Dallas/Fort Worth International', city: 'Dallas' },
  MIA: { lat: 25.7959, lon: -80.287, name: 'Miami International', city: 'Miami' },
  FLL: { lat: 26.0726, lon: -80.1527, name: 'Fort Lauderdale–Hollywood International', city: 'Fort Lauderdale' },
  SFO: { lat: 37.6213, lon: -122.379, name: 'San Francisco International', city: 'San Francisco' },
  PHX: { lat: 33.4343, lon: -112.0116, name: 'Phoenix Sky Harbor', city: 'Phoenix' },
  DEN: { lat: 39.8561, lon: -104.6737, name: 'Denver International', city: 'Denver' },
  BOS: { lat: 42.3656, lon: -71.0096, name: 'Boston Logan International', city: 'Boston' },
  LAS: { lat: 36.084, lon: -115.1537, name: 'Harry Reid International', city: 'Las Vegas' },
  SXM: { lat: 18.041, lon: -63.1089, name: 'Princess Juliana International', city: 'St. Maarten' },
  MAN: { lat: 53.3537, lon: -2.275, name: 'Manchester Airport', city: 'Manchester' },
  LHR: { lat: 51.47, lon: -0.4543, name: 'London Heathrow', city: 'London' },
  JFK: { lat: 40.6413, lon: -73.7781, name: 'John F. Kennedy International', city: 'New York' },
  LGA: { lat: 40.7769, lon: -73.874, name: 'LaGuardia', city: 'New York' },
  MSY: { lat: 29.9934, lon: -90.258, name: 'Louis Armstrong International', city: 'New Orleans' },
  RNO: { lat: 39.4991, lon: -119.7681, name: 'Reno-Tahoe International', city: 'Reno' },
  ACE: { lat: 28.9455, lon: -13.6052, name: 'Lanzarote Airport', city: 'Lanzarote' },
  SDF: { lat: 38.174, lon: -85.7364, name: 'Louisville Muhammad Ali International', city: 'Louisville' },
  AMS: { lat: 52.3105, lon: 4.7683, name: 'Amsterdam Airport Schiphol', city: 'Amsterdam' },
  LIS: { lat: 38.7742, lon: -9.1342, name: 'Humberto Delgado Airport', city: 'Lisbon' },
  YVR: { lat: 49.1947, lon: -123.1792, name: 'Vancouver International', city: 'Vancouver' },
  MEL: { lat: -37.669, lon: 144.841, name: 'Melbourne Airport', city: 'Melbourne' },
  BNE: { lat: -27.3842, lon: 153.1175, name: 'Brisbane Airport', city: 'Brisbane' },
  SYD: { lat: -33.9399, lon: 151.1753, name: 'Sydney Kingsford Smith', city: 'Sydney' },
  NRT: { lat: 35.7647, lon: 140.3864, name: 'Narita International', city: 'Tokyo' },
  HND: { lat: 35.5494, lon: 139.7798, name: 'Tokyo Haneda', city: 'Tokyo' },
  DXB: { lat: 25.2532, lon: 55.3657, name: 'Dubai International', city: 'Dubai' },
  SIN: { lat: 1.3644, lon: 103.9915, name: 'Singapore Changi', city: 'Singapore' },
  MSP: { lat: 44.8848, lon: -93.2223, name: 'Minneapolis–St. Paul International', city: 'Minneapolis' },
  ICN: { lat: 37.4602, lon: 126.4407, name: 'Incheon International', city: 'Seoul' },
};

export interface MapStream {
  id: string;
  name: string;
  handle: string;
  status: StreamStatus;
  type: Stream['type'];
  embedId?: string;
  thumb: string | null;
  watchUrl: string;
  host: boolean;
}

export interface MapPoint {
  code: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  status: StreamStatus;
  hasPage: boolean;
  golden?: boolean;
  streams: MapStream[];
}

const statusRank: Record<StreamStatus, number> = {
  live: 0,
  '247': 1,
  scheduled: 2,
  off: 3,
};

const pageCodes = new Set([
  'MCO',
  'TPA',
  'BOG',
  'LAX',
  'DFW',
  'MIA',
  'FLL',
  'SFO',
  'PHX',
  'DEN',
  'BOS',
  'LAS',
  'SXM',
  'MAN',
  'LHR',
  'JFK',
  'AMS',
  'LIS',
  'YVR',
  'MEL',
  'BNE',
  'SYD',
  'ACE',
  'NRT',
  'HND',
  'DXB',
  'SIN',
  'MSP',
  'ICN',
]);

function toMapStream(s: Stream): MapStream {
  return {
    id: s.id,
    name: s.name,
    handle: s.handle,
    status: s.status,
    type: s.type,
    embedId: s.embedId,
    thumb: s.embedId ? youtubeThumbUrl(s.embedId) : null,
    watchUrl: youtubeWatchUrl(s),
    host: s.host,
  };
}

export function mapPoints(): MapPoint[] {
  const byCode = new Map<string, MapStream[]>();

  function add(code: string, stream: Stream) {
    const list = byCode.get(code) ?? [];
    if (!list.some((x) => x.id === stream.id)) list.push(toMapStream(stream));
    byCode.set(code, list);
  }

  for (const s of streams) {
    add(s.airport, s);
    for (const extra of s.covers ?? []) add(extra, s);
  }

  const points: MapPoint[] = [];
  for (const [code, list] of byCode) {
    const geo = locations[code];
    if (!geo) continue;
    const best = [...list].sort((a, b) => statusRank[a.status] - statusRank[b.status])[0];
    points.push({
      code,
      name: geo.name,
      city: geo.city,
      lat: geo.lat,
      lon: geo.lon,
      status: best?.status ?? 'off',
      hasPage: pageCodes.has(code),
      streams: list,
    });
  }
  return points.sort((a, b) => a.code.localeCompare(b.code));
}
