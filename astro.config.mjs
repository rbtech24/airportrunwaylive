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

export default defineConfig({
  site: 'https://www.airportrunwayslive.com',
  trailingSlash: 'never',
  integrations: [sitemap(), resendDev()],
  redirects: {
    '/mco': '/airports/mco',
  },
});
