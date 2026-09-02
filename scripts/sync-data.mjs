import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(path.join(root, 'public/data'), { recursive: true });
await copyFile(path.join(root, 'src/data/streams.json'), path.join(root, 'public/data/streams.json'));
console.log('Synced src/data/streams.json → public/data/streams.json');
