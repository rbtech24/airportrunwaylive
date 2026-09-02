export const site = {
  name: 'Airport Runways Live',
  short: 'ARL',
  domain: 'https://airportrunwaylive.com',
  youtube: 'https://www.youtube.com/@AirportRunwaysLive',
  youtubeHandle: '@AirportRunwaysLive',
  email: 'hello@airportrunwaylive.com',
  alert: '',
  tagline: 'Watch the runways. Live.',
  year: 2026,
  description:
    'Watch airport runways live. A board of YouTube airport streams plus hosted coverage from Orlando (MCO).',
} as const;

export type SiteConfig = typeof site;
