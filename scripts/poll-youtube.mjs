/**
 * Quota-safe YouTube Data API poller for Airport Runways Live.
 *
 * Architecture that survives the default 10,000 unit/day quota:
 *   - Curated channel / video IDs only. Never search the whole of YouTube.
 *   - Fast path: videos.list?part=snippet,liveStreamingDetails  (1 unit / 50 IDs)
 *   - Slow path: channels.list + playlistItems.list to pick up a new live video ID
 *   - search.list is OFF unless you pass --discover (100 units per call)
 *   - liveBroadcasts.list is owner-only. It cannot list Airline Videos.
 *
 * Math (fast path): 120 known video IDs = 3 units/poll. Every 10 min = 432 units/day.
 *
 * The website reads public/data/status.json. It never calls Google on a pageview.
 *
 * Usage:
 *   YOUTUBE_API_KEY=... node scripts/poll-youtube.mjs
 *   node scripts/poll-youtube.mjs --discover   # rare, expensive
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STREAMS = path.join(root, 'src/data/streams.json');
const STATUS = path.join(root, 'public/data/status.json');
const API = 'https://www.googleapis.com/youtube/v3';
try {
  const envFile = await readFile(path.join(root, '.env'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
} catch {
  /* no .env */
}

const KEY = process.env.YOUTUBE_API_KEY ?? '';
const DISCOVER = process.argv.includes('--discover');
const REFRESH_LATEST = process.argv.includes('--refresh-latest');

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

async function api(pathname, params) {
  const url = new URL(API + pathname);
  url.searchParams.set('key', KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`${pathname} ${res.status} ${JSON.stringify(body.error ?? body)}`);
  }
  return body;
}

function isLive(video) {
  const live = video?.liveStreamingDetails;
  return Boolean(live?.actualStartTime && !live?.actualEndTime);
}

function deriveStatus(stream, live) {
  if (stream.type === '247') return live ? '247' : 'off';
  if (live) return 'live';
  return stream.type === 'scheduled' ? 'scheduled' : 'off';
}

async function loadJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function main() {
  const streams = await loadJson(STREAMS, []);
  const prev = await loadJson(STATUS, { streams: {}, channelIds: {}, quotaUnits: 0 });
  const channelIds = { ...(prev.channelIds ?? {}) };
  let units = 0;

  if (!KEY) {
    const catalogOnly = {
      updatedAt: new Date().toISOString(),
      source: 'catalog',
      quotaUnits: 0,
      streams: Object.fromEntries(
        streams.map((s) => [
          s.id,
          { status: s.status, videoId: s.embedId ?? null, title: null, live: s.status === 'live' || s.status === '247' },
        ]),
      ),
      channelIds,
    };
    await writeFile(STATUS, JSON.stringify(catalogOnly, null, 2) + '\n');
    console.log('No YOUTUBE_API_KEY. Wrote catalog fallback to public/data/status.json');
    return;
  }

  // Resolve missing channel IDs via forHandle (1 unit each, cached forever after).
  for (const s of streams) {
    if (s.channelId) {
      channelIds[s.id] = s.channelId;
      continue;
    }
    if (channelIds[s.id]) continue;
    const handle = String(s.handle ?? '').replace(/^@/, '');
    if (!handle) continue;
    if (!/^[\w.-]+$/.test(handle)) continue;
    try {
      const data = await api('/channels', { part: 'id,contentDetails', forHandle: handle });
      units += 1;
      const id = data.items?.[0]?.id;
      if (id) channelIds[s.id] = id;
    } catch (err) {
      console.warn('forHandle failed', handle, err.message);
    }
  }

  const knownVideoIds = new Map();
  for (const s of streams) {
    const cached = prev.streams?.[s.id]?.videoId;
    const vid = s.embedId || cached;
    if (vid) knownVideoIds.set(s.id, vid);
  }

  // Optional slow path: latest upload on channels that have no video ID yet.
  if (REFRESH_LATEST) {
    const missing = streams.filter((s) => !knownVideoIds.get(s.id) && channelIds[s.id]);
    for (const s of missing) {
      try {
        const ch = await api('/channels', { part: 'contentDetails', id: channelIds[s.id] });
        units += 1;
        const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploads) continue;
        const items = await api('/playlistItems', {
          part: 'contentDetails',
          playlistId: uploads,
          maxResults: '1',
        });
        units += 1;
        const vid = items.items?.[0]?.contentDetails?.videoId;
        if (vid) knownVideoIds.set(s.id, vid);
      } catch (err) {
        console.warn('refresh-latest failed', s.id, err.message);
      }
    }
  }

  // Fast path: videos.list in batches of 50. This is the 3-units-per-poll design.
  const uniqueIds = [...new Set(knownVideoIds.values())];
  const byVideo = new Map();
  for (const group of chunk(uniqueIds, 50)) {
    const data = await api('/videos', {
      part: 'snippet,liveStreamingDetails',
      id: group.join(','),
    });
    units += 1;
    for (const item of data.items ?? []) byVideo.set(item.id, item);
  }

  // --discover is the only search.list call. Default project ~100/day. Do not poll this.
  if (DISCOVER) {
    const hosted = streams.filter((s) => s.type !== '247' && channelIds[s.id]).slice(0, 1);
    for (const s of hosted) {
      try {
        const data = await api('/search', {
          part: 'snippet',
          channelId: channelIds[s.id],
          eventType: 'live',
          type: 'video',
          maxResults: '1',
        });
        units += 100;
        const vid = data.items?.[0]?.id?.videoId;
        if (vid) knownVideoIds.set(s.id, vid);
        console.log('discover', s.id, vid ?? 'none');
      } catch (err) {
        console.warn('discover failed', s.id, err.message);
      }
    }
  }

  const next = {};
  for (const s of streams) {
    const videoId = knownVideoIds.get(s.id) ?? s.embedId ?? null;
    const video = videoId ? byVideo.get(videoId) : null;
    const live = video ? isLive(video) : false;
    next[s.id] = {
      status: deriveStatus(s, live),
      videoId,
      title: video?.snippet?.title ?? null,
      live,
    };
  }

  const out = {
    updatedAt: new Date().toISOString(),
    source: 'youtube',
    quotaUnits: units,
    streams: next,
    channelIds,
  };
  await writeFile(STATUS, JSON.stringify(out, null, 2) + '\n');
  const liveCount = Object.values(next).filter((s) => s.live).length;
  console.log(`Wrote status.json · units=${units} · live_or_247=${liveCount} · videos=${uniqueIds.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
