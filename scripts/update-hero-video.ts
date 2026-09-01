// One-time script: replaces the homepage hero video + poster in Sanity with
// the new files in public/videos/hero-luxury-home.mp4 and public/hero-poster.jpg.
//
// Usage: npm run update:hero-video

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

try {
  process.loadEnvFile();
} catch {
  // no .env file yet — fall through to the missing-var check below
}

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });
const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');

async function uploadAsset(kind: 'image' | 'file', relPath: string) {
  const buffer = fs.readFileSync(path.join(PUBLIC_DIR, relPath));
  const doc = await client.assets.upload(kind, buffer, { filename: path.basename(relPath) });
  return doc._id;
}

async function run() {
  console.log('Uploading new hero video...');
  const videoAssetId = await uploadAsset('file', 'videos/hero-luxury-home.mp4');
  console.log('Uploading new hero poster...');
  const posterAssetId = await uploadAsset('image', 'hero-poster.jpg');

  await client
    .patch('siteSettings')
    .set({
      heroVideo: { _type: 'file', asset: { _type: 'reference', _ref: videoAssetId } },
      heroPoster: { _type: 'image', asset: { _type: 'reference', _ref: posterAssetId } },
    })
    .commit();

  console.log('Done — hero video and poster updated in Sanity.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
