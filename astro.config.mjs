// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://airportrunwaylive.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
  redirects: {
    '/mco': '/airports/mco',
  },
});
