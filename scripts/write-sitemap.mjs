import { existsSync, statSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const chunk = path.join(dist, 'sitemap-0.xml');
const indexFile = path.join(dist, 'sitemap-index.xml');
const main = path.join(dist, 'sitemap.xml');
const pi = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';

function withStylesheet(xml) {
  if (xml.includes('xml-stylesheet')) return xml;
  return xml.replace('<?xml version="1.0" encoding="UTF-8"?>', `<?xml version="1.0" encoding="UTF-8"?>\n${pi}`);
}

if (!existsSync(chunk)) {
  console.error('sitemap-0.xml missing — astro sitemap did not run');
  process.exit(1);
}

if (existsSync(main) && statSync(main).isDirectory()) {
  await rm(main, { recursive: true });
}

const urls = withStylesheet(await readFile(chunk, 'utf8'));
await writeFile(chunk, urls);
await writeFile(main, urls);
if (existsSync(indexFile)) {
  await writeFile(indexFile, withStylesheet(await readFile(indexFile, 'utf8')));
}

const count = (urls.match(/<loc>/g) ?? []).length;
console.log(`Wrote dist/sitemap.xml (${count} URLs)`);
