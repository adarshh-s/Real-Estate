// One-time script: removes two low-quality "text-only marketing quote card"
// images (e.g. "Let Your Imagination Drift" on a plain teal background) that
// slipped through the off-plan project image-sourcing pass — found via a
// compression-ratio scan across all 206 uploaded images, then confirmed
// visually.
//
// Usage: npm run remove:bad-slide-images

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

async function run() {
  await client.patch('7OkmNeJfeu3frDLfgrODil').unset(['images[_key=="rwpdvwxnnpj"]']).commit();
  console.log('Removed text-slide image from DAMAC Islands');

  await client.patch('flqZNGp7VQ6a1CboDi7iPB').unset(['images[_key=="ts06czl7f9"]']).commit();
  console.log('Removed text-slide image from Chelsea Residences');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
