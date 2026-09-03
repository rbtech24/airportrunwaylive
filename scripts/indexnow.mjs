const HOST = 'www.airportrunwayslive.com';
const KEY = 'c4e8f1a27b9d40c6a5e13f8d2b7c90e1';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const keyRes = await fetch(KEY_LOCATION);
if (!keyRes.ok) {
  console.error(`IndexNow key file not live yet: ${KEY_LOCATION} (${keyRes.status})`);
  process.exit(1);
}

const xml = await fetch(SITEMAP).then((r) => {
  if (!r.ok) throw new Error(`sitemap ${r.status}`);
  return r.text();
});
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) {
  console.error('No URLs in sitemap.');
  process.exit(1);
}

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body,
});
const text = await res.text();
console.log(`IndexNow ${res.status} — ${urls.length} URLs`);
if (text) console.log(text);
if (!res.ok && res.status !== 202) process.exit(1);
