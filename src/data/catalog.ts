import type { Stream, StreamStatus } from './types';
import raw from './streams.json';

export const streams = raw as Stream[];

const statusRank: Record<StreamStatus, number> = {
  live: 0,
  '247': 1,
  scheduled: 2,
  off: 3,
};

export function sortStreams(list: Stream[]): Stream[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const aPaid = Boolean(a.featuredSlot);
    const bPaid = Boolean(b.featuredSlot);
    if (aPaid !== bPaid) return aPaid ? -1 : 1;
    const sr = statusRank[a.status] - statusRank[b.status];
    if (sr !== 0) return sr;
    if (a.host !== b.host) return a.host ? -1 : 1;
    return a.airport.localeCompare(b.airport) || a.name.localeCompare(b.name);
  });
}

export const sortedStreams = sortStreams(streams);

export function getStream(id: string): Stream | undefined {
  return streams.find((s) => s.id === id);
}

export function streamsForAirport(code: string): Stream[] {
  const upper = code.toUpperCase();
  return sortStreams(
    streams.filter(
      (s) => s.airport === upper || (s.covers ?? []).includes(upper),
    ),
  );
}

export function featuredStreams(limit = 4): Stream[] {
  const live = sortedStreams.filter((s) => s.status === 'live');
  const ours = sortedStreams.filter((s) => s.featured);
  const merged: Stream[] = [];
  for (const s of [...ours, ...live]) {
    if (!merged.some((m) => m.id === s.id)) merged.push(s);
    if (merged.length >= limit) break;
  }
  return merged;
}

export function cams247(): Stream[] {
  return sortStreams(streams.filter((s) => s.type === '247'));
}

export function embeddableStreams(): Stream[] {
  return sortStreams(streams.filter((s) => Boolean(s.embedId)));
}

export function youtubeWatchUrl(stream: Stream): string {
  if (stream.embedId) return `https://www.youtube.com/watch?v=${stream.embedId}`;
  return stream.url;
}

export function youtubeEmbedUrl(stream: Stream): string | null {
  if (!stream.embedId) return null;
  return `https://www.youtube-nocookie.com/embed/${stream.embedId}`;
}

export function youtubeThumbUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeChannelUrl(stream: Stream): string {
  if (stream.handle.startsWith('@')) {
    return `https://www.youtube.com/${stream.handle}`;
  }
  return stream.url;
}

export function creatorSlug(handle: string): string {
  return handle.replace(/^@/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function creators(): {
  handle: string;
  slug: string;
  name: string;
  url: string;
  streams: Stream[];
}[] {
  const map = new Map<string, Stream[]>();
  for (const s of sortedStreams) {
    const key = s.handle;
    const list = map.get(key) ?? [];
    list.push(s);
    map.set(key, list);
  }
  return [...map.entries()].map(([handle, list]) => ({
    handle,
    slug: creatorSlug(handle),
    name: list[0].name.replace(/ — .*$/, ''),
    url: youtubeChannelUrl(list[0]),
    streams: list,
  }));
}

export function getCreator(slug: string) {
  return creators().find((c) => c.slug === slug);
}
