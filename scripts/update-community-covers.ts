// One-time script: replaces each surviving community's generic reused stock
// `image` with a real, verified photo/render of that specific place (some
// were duplicated across multiple communities before — e.g. Downtown Dubai
// and Dubai Creek Harbour shared the exact same generic stock image).
//
// Usage: npm run update:community-covers

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

const COVERS_DIR =
  '/private/tmp/claude-501/-Users-adarsh-Desktop-Projects-Real-Estate/be09264d-ee0d-4ff5-94ab-835a1cda1358/scratchpad/community-covers';

const SLUG_TO_FILE: Record<string, string> = {
  'downtown-dubai': 'downtown-dubai.jpg',
  'business-bay': 'business-bay.jpg',
  'dubai-hills-estate': 'dubai-hills-estate.jpg',
  'dubai-creek-harbour': 'dubai-creek-harbour.jpg',
  'jumeirah-golf-estates': 'jumeirah-golf-estates.jpg',
  'la-mer': 'la-mer.jpg',
  'palm-jebel-ali': 'palm-jebel-ali.jpg',
};

async function run() {
  let updated = 0;

  for (const [slug, filename] of Object.entries(SLUG_TO_FILE)) {
    const doc = await client.fetch<{ _id: string; name: string } | null>(
      `*[_type == "community" && slug.current == $slug][0]{_id, name}`,
      { slug },
    );
    if (!doc) {
      console.log(`Not found (skip): ${slug}`);
      continue;
    }

    const filePath = path.join(COVERS_DIR, filename);
    const buffer = fs.readFileSync(filePath);
    const asset = await client.assets.upload('image', buffer, { filename });

    await client
      .patch(doc._id)
      .set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      .commit();

    console.log(`Updated cover image: ${doc.name} (${slug})`);
    updated += 1;
  }

  console.log(`\nDone — updated ${updated} community cover images.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
