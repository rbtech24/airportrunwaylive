export const site = {
  name: 'Airport Runways Live',
  short: 'ARL',
  domain: 'https://www.airportrunwayslive.com',
  youtube: 'https://www.youtube.com/@AirportRunwaysLive',
  youtubeHandle: '@AirportRunwaysLive',
  email: 'hello@airportrunwayslive.com',
  alert: '',
  tagline: 'Watch the runways. Live.',
  year: 2026,
  description:
    'Watch airport runways live. A board of YouTube airport streams plus hosted coverage from Orlando (MCO).',
} as const;

export type SiteConfig = typeof site;
