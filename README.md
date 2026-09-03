# Airport Runways Live

Directory of airport / runway livestreams on YouTube, plus hosted lives from Orlando International (MCO) and Tampa International (TPA).

**Domain:** [airportrunwayslive.com](https://www.airportrunwayslive.com)
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
2. GitHub Action runs **three times a day** (13:00, 18:00, 23:00 UTC) on curated IDs only.
3. Cheap call: `videos.list?part=snippet,liveStreamingDetails` — 1 unit, 50 IDs. `--refresh-latest` also pulls the newest upload ID per channel so a new live is picked up.
4. Cache results in `public/data/status.json` (committed back to the repo).
5. The website reads that cache on the client. Google is never hit on a pageview.
6. `search.list&eventType=live` is `--discover` only. Do not put it on the cron.

### How to get a YouTube Data API key

1. Open [Google Cloud Console](https://console.cloud.google.com/) and sign in.
2. **New project** — name it `Airport Runways Live`.
3. **APIs & Services → Library** → search **YouTube Data API v3** → **Enable**.
4. **APIs & Services → Credentials → Create credentials → API key**.
5. Edit the key → **API restrictions** → restrict to **YouTube Data API v3**. If you also lock **Application restrictions** to HTTP referrers, allow `https://www.airportrunwayslive.com/*`. The poller sends that origin as `Referer` so GitHub Actions is not blocked. Do not use IP restriction — Actions has no fixed IP.
6. Put the key in local `.env` as `YOUTUBE_API_KEY=`.
7. GitHub → this repo → **Settings → Secrets and variables → Actions** → new secret named `YOUTUBE_API_KEY`.
8. Optionally **Run workflow** on **Poll YouTube lives**. It also runs 13:00 / 18:00 / 23:00 UTC.

The key is **not** used in the browser. Do not scrape `search.list` on a timer.

Three polls a day is well inside quota. Add `YOUTUBE_API_KEY` as a GitHub Actions secret named `YOUTUBE_API_KEY`.

```bash
copy .env.example .env
# put YOUTUBE_API_KEY in .env
npm run poll              # fast path
npm run poll:latest       # also fetch latest upload IDs for channels missing a video
npm run poll:discover     # one search.list, 100 units — do not cron this
```

Without a key, `npm run poll` writes a catalog fallback and the board still renders.

## Resend (contact / add a stream / host-a-cam / remove)

1. Verify `airportrunwayslive.com` in [Resend](https://resend.com/domains).
2. Copy `.env.example` to `.env` and set `RESEND_API_KEY`.
3. On Vercel (production): Project → Settings → Environment Variables → `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`. Cloudflare Pages uses the same names if you host there.

Local `npm run dev` posts to `/api/send` via a Vite middleware. Vercel uses `api/send.ts`. Cloudflare Pages uses `functions/api/send.ts`. If the key is missing, the form falls back to mailto.

## Live airport weather (free, no key)

Airport pages load the latest **METAR** from the NOAA Aviation Weather Center (`aviationweather.gov`). No API key. AWC does not allow browser CORS, so `/api/wx?icao=KMCO` proxies it (Vercel `api/wx.ts`, local Vite middleware). Not a flight tracker. Not ATC.

## Google Search Console (why `site:` is empty)

The board is crawlable (`robots.txt` allows Googlebot, sitemap is live, no `noindex` on public pages). Google still shows **zero pages** until the property is verified and the sitemap is submitted — this domain is new.

1. Open [Google Search Console](https://search.google.com/search-console) → **Add property** → **Domain** `airportrunwayslive.com` (covers apex + www).
2. Verify with the DNS TXT record at the registrar (or HTML tag: set Vercel env `PUBLIC_GSC_VERIFICATION` to the content value and redeploy).
3. **Sitemaps** → submit `https://www.airportrunwayslive.com/sitemap-index.xml`
4. **URL inspection** → request indexing for `/`, `/live`, `/airports/mco`, `/airports/tpa`, `/cams` (quota is a handful per day).

Also put `https://www.airportrunwayslive.com` in the YouTube channel **About** links. Google discovers new sites from links, not from hope.

Bing/Yandex: `npm run indexnow` after a deploy (key file must already be live).

## Stack

Astro 7 static site. Client JS: `/live` filters, status-cache badges, i18n chrome, `/multiview`, forms (Resend with mailto fallback).
