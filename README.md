# Airport Runways Live

Directory of airport / runway livestreams on YouTube, plus a hosted-channel hub for Airport Runways Live (MCO, TPA, BOG).

**Domain:** [airportrunwaylive.com](https://airportrunwaylive.com)
**YouTube:** [@AirportRunwaysLive](https://www.youtube.com/@AirportRunwaysLive)

## Hard rules

- Never restream or proxy another creator’s video. Official YouTube iframes only.
- `/watch` = one iframe. `/multiview` = two max.
- Never fake a LIVE badge. LIVE comes from the YouTube Data API cache over a curated ID list, or stays off.
- Footer: “We link to official YouTube lives. Creators keep the views.”
- The 24/7 cam is an upgrade, not the business. The desk is how the directory and the channel feed each other.

## Run

```bash
npm install
npm run dev
```

http://127.0.0.1:4321

```bash
npm run build
npm run preview
```

## What is on the board

| Piece | Route |
|---|---|
| Live board | `/live` |
| Airport pages | `/airports/mco` and the other hubs |
| 24/7 cams | `/cams` |
| Watch | `/watch?id=` |
| Multiview | `/multiview` |
| Schedule | `/schedule` |
| Add a stream (you approve) | `/add` |
| Host-a-cam | `/host-a-cam` |
| ES/EN | `/es`, `/es/about`, `/es/faq` + chrome toggle |
| Alerts | `public/data/site-config.json` → `"alert"` |
| Featured / paid PIN | `/featured` |
| Aviation Live Desk | `/desk` |

## Edit the board

- Catalog: `src/data/streams.json` (then `npm run sync-data`)
- Alert banner: `public/data/site-config.json` `"alert": "Storm night at MCO — we’re going live"`
- Paid pin: set `"featuredSlot": true` on that record
- Host pin (ARL MCO): `"featured": true`
- Manual LIVE (only if you know): `"status": "live"` — prefer the poller

## YouTube API poller (the only design that survives quota)

Default project (2026): `search.list` ~100/day; everything else 10,000 units/day; reset midnight Pacific; no rollover.

**Do not** poll `search.list`. 100 searches is the whole day. `liveBroadcasts.list` only lists *your* broadcasts.

Finished pattern:

1. Curated list of channel / video IDs (not the whole of YouTube).
2. Worker every 10 minutes checks those IDs only.
3. Cheap call: `videos.list?part=snippet,liveStreamingDetails` — 1 unit, 50 IDs.
4. Cache results in `public/data/status.json`.
5. The website reads that cache on the client. Google is never hit on a pageview.
6. `search.list&eventType=live` is `--discover` only, maybe once a day.

Math that works: 120 video IDs, batched 50 = 3 units/poll × 144/day = 432 units. Fine.

```bash
copy .env.example .env
# put YOUTUBE_API_KEY in .env
npm run poll              # fast path
npm run poll:latest       # also fetch latest upload IDs for channels missing a video
npm run poll:discover     # one search.list, 100 units — do not cron this
```

Cron the fast path every 10 minutes after deploy (upload `public/data/status.json` next to the site). Without a key, `npm run poll` writes a catalog fallback and the board still renders.

## Stack

Astro 7 static site. Client JS: `/live` filters, status-cache badges, i18n chrome, `/multiview`, mailto forms.
