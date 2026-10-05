// One-time script: creates the new curated-luxury community documents in
// Sanity (the ones added to src/data/communities.ts alongside the original
// 8). Safe to re-run — skips any slug that already exists.
//
// Usage: npm run add:communities

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

const NEW_SLUGS = [
  'dubai-creek-harbour',
  'bluewaters-island',
  'difc',
  'jumeirah-beach-residence',
  'la-mer',
  'district-one',
  'al-barari',
  'tilal-al-ghaf',
  'palm-jebel-ali',
  'mina-rashid',
  'nad-al-sheba',
];

async function uploadImageFromUrl(url: string) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  return client.assets.upload('image', buffer, { filename: `${Date.now()}.jpg` });
}

async function run() {
  const toAdd = communities.filter((c) => NEW_SLUGS.includes(c.slug));
  let created = 0;

  for (const c of toAdd) {
    const existing = await client.fetch(`*[_type == "community" && slug.current == $slug][0]{_id}`, { slug: c.slug });
    if (existing) {
      console.log(`Skip (already exists): ${c.name}`);
      continue;
    }

    const asset = await uploadImageFromUrl(c.image);

    await client.create({
      _type: 'community',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      tagline: c.tagline,
      description: c.description,
      avgPricePerSqft: c.avgPricePerSqft,
      avgRentalYield: c.avgRentalYield,
      listingsCount: c.listingsCount,
      popularFor: c.popularFor,
      location: c.location ? { _type: 'geopoint', lat: c.location.lat, lng: c.location.lng } : undefined,
    });

    console.log(`Created: ${c.name}`);
    created += 1;
  }

  console.log(created === 0 ? 'Nothing to add — all already exist.' : `Done — created ${created} new communit${created === 1 ? 'y' : 'ies'}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
