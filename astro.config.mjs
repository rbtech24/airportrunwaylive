// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import { sendBoardEmail } from './src/lib/send-email.ts';

function resendDev() {
  return {
    name: 'resend-dev',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const path = req.url?.split('?')[0];
          if (path === '/api/wx' && (req.method === 'GET' || !req.method)) {
            const icao = new URL(req.url ?? '', 'http://127.0.0.1').searchParams
              .get('icao')
              ?.replace(/[^A-Za-z0-9]/g, '')
              .toUpperCase();
            if (!icao || icao.length < 3) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'icao required' }));
              return;
            }
            const { fetchMetar } = await import('./src/lib/fetch-wx.ts');
            const row = await fetchMetar(icao);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=120');
            res.end(JSON.stringify(row ?? {}));
            return;
          }
          if (path !== '/api/send' || req.method !== 'POST') {
            next();
            return;
          }
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          let payload = { subject: 'Airport Runways Live', fields: {} };
          try {
            payload = JSON.parse(Buffer.concat(chunks).toString() || '{}');
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
            return;
          }
          if (payload.fields?.company) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            return;
          }
          const env = loadEnv('development', process.cwd(), '');
          const result = await sendBoardEmail(
            {
              RESEND_API_KEY: env.RESEND_API_KEY || process.env.RESEND_API_KEY,
              RESEND_FROM: env.RESEND_FROM || process.env.RESEND_FROM,
              RESEND_TO: env.RESEND_TO || process.env.RESEND_TO,
            },
            { subject: payload.subject ?? 'Airport Runways Live', fields: payload.fields ?? {} },
          );
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
      },
    },
  };
}

const sitemapSkip = new Set(['/overlay', '/embed', '/watch', '/pending', '/sitemap.xml']);

export default defineConfig({
  site: 'https://www.airportrunwayslive.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !sitemapSkip.has(path);
      },
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const daily =
          path === '/' ||
          path === '/live' ||
          path === '/cams' ||
          path === '/schedule' ||
          path === '/airports' ||
          path.startsWith('/airports/');
        item.lastmod = new Date();
        item.changefreq = daily ? 'daily' : 'weekly';
        item.priority =
          path === '/' ? 1 : path === '/live' ? 0.9 : path.startsWith('/airports/') ? 0.8 : 0.6;
        return item;
      },
    }),
    resendDev(),
  ],
  redirects: {
    '/mco': '/airports/mco',
    '/sitemap.xml': '/sitemap-index.xml',
  },
});
