// One-time script: adds the `location` geopoint to communities already seeded
// in Sanity by migrate-to-sanity.ts, using the coordinates in
// src/data/communities.ts. Safe to run more than once (skips communities that
// already have a location set).
//
// Usage: npm run backfill:locations

import { createClient } from '@sanity/client';
import { communities } from '../src/data/communities.ts';

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
  let patched = 0;

  for (const c of communities) {
    const doc = await client.fetch<{ _id: string; location?: unknown } | null>(
      `*[_type == "community" && slug.current == $slug][0]{ _id, location }`,
      { slug: c.slug },
    );
    if (!doc) {
      console.log(`Skipping ${c.name} — not found in Sanity.`);
      continue;
    }
    if (doc.location) {
      console.log(`Skipping ${c.name} — already has a location.`);
      continue;
    }
    await client
      .patch(doc._id)
      .set({ location: { _type: 'geopoint', lat: c.location.lat, lng: c.location.lng } })
      .commit();
    console.log(`Patched ${c.name}`);
    patched += 1;
  }

  console.log(patched === 0 ? 'Nothing to backfill.' : `Done — patched ${patched} communit${patched === 1 ? 'y' : 'ies'}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
