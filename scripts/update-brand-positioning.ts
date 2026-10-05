// One-time script: updates the live siteSettings document in Sanity with the
// revised "private real estate investment & advisory" brand positioning
// (previously a premium-brokerage narrative). Safe to re-run — it just sets
// the same fields each time.
//
// Usage: npm run update:brand-positioning

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

const PATCH = {
  heroKicker: 'Private Real Estate · Investment · Advisory',
  heroHeadlineLine1: 'Real estate,',
  heroHeadlineLine2: 'considered differently.',
  heroSubtitle:
    'A private real estate investment and advisory partner for Dubai, bringing the right opportunities into focus, not simply the most listings.',
  interstitialHeadline: 'Property is the opportunity. Perspective is the advantage.',
  interstitialBody:
    'We look beyond the property to location, developer, entry price, payment structure and long-term potential, before we bring an opportunity forward.',
};

async function run() {
  const docs: { _id: string }[] = await client.fetch(`*[_type == "siteSettings"]{_id}`);

  if (docs.length === 0) {
    console.log('No siteSettings document found in Sanity — nothing to patch.');
    return;
  }

  for (const doc of docs) {
    await client.patch(doc._id).set(PATCH).commit();
    console.log(`Patched siteSettings ${doc._id}`);
  }

  console.log('Done — hero and interstitial copy updated to the revised brand positioning.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
