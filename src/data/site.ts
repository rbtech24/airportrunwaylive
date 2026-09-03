export const site = {
  name: 'Airport Runways Live',
  short: 'ARL',
  domain: 'https://www.airportrunwayslive.com',
  youtube: 'https://www.youtube.com/@AirportRunwaysLive',
  youtubeHandle: '@AirportRunwaysLive',
  email: 'hello@airportrunwayslive.com',
  googleSiteVerification: 'UtpUArXhuuPMwF7vp4MyxuAtYv2o0TZrKQqUNZ_dggs',
  alert: '',
  tagline: 'Watch the runways. Live.',
  year: 2026,
  description:
    'Watch airport runways live. A board of YouTube airport streams plus hosted lives from Orlando (MCO) and Tampa (TPA).',
} as const;

export type SiteConfig = typeof site;
