export type StreamType = 'hosted' | '247' | 'scheduled';
export type StreamStatus = 'live' | '247' | 'scheduled' | 'off';
export type Region = 'us' | 'europe' | 'caribbean' | 'latam' | 'other';

export interface Stream {
  id: string;
  featured: boolean;
  featuredSlot?: boolean;
  host: boolean;
  approved?: boolean;
  airport: string;
  icao: string;
  city: string;
  country: string;
  region: Region;
  name: string;
  handle: string;
  url: string;
  channelId?: string;
  type: StreamType;
  status: StreamStatus;
  schedule: string;
  notes: string;
  embedId?: string;
  covers?: string[];
}

export interface StatusEntry {
  status: StreamStatus;
  videoId?: string | null;
  title?: string | null;
  live: boolean;
}

export interface StatusCache {
  updatedAt: string | null;
  source: 'catalog' | 'youtube';
  quotaUnits: number;
  streams: Record<string, StatusEntry>;
  channelIds?: Record<string, string>;
}

export interface Airport {
  code: string;
  icao: string;
  name: string;
  city: string;
  region: Region;
  country: string;
  intro: string;
  ourNote: string;
  related: string[];
}
