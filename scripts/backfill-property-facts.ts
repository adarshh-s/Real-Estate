// One-time script: fills in the new parking/developer/view/availableFrom
// fields on properties already seeded in Sanity, using sensible per-community
// defaults. Safe to re-run — skips any field that's already set.
//
// Usage: npm run backfill:property-facts

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

const COMMUNITY_DEFAULTS: Record<string, { developer: string; view: string }> = {
  'Palm Jumeirah': { developer: 'Nakheel', view: 'Sea & Palm View' },
  'Dubai Marina': { developer: 'Emaar', view: 'Marina View' },
  'Emirates Hills': { developer: 'Emaar', view: 'Golf Course' },
  'Business Bay': { developer: 'Damac', view: 'Canal View' },
  'Dubai Hills Estate': { developer: 'Emaar', view: 'Golf Course' },
  'Downtown Dubai': { developer: 'Emaar', view: 'Burj Khalifa & Skyline' },
  'Jumeirah Golf Estates': { developer: 'Emaar', view: 'Golf Course' },
  'Jumeirah Bay Island': { developer: 'Kleindienst Group', view: 'Sea View' },
  'Dubai Creek Harbour': { developer: 'Emaar', view: 'Creek & Skyline' },
  'Golf Lane': { developer: 'Emaar', view: 'Golf Course' },
  'Golf Grand': { developer: 'Emaar', view: 'Golf Course' },
};

function parkingFor(beds: number, type: string): number {
  if (type === 'Villa' || type === 'Mansion' || type === 'Townhouse') return Math.min(4, Math.max(2, beds));
  return beds >= 3 ? 2 : 1;
}

async function run() {
  const docs: { _id: string; title: string; community: string; type: string; beds: number; completion: string; parking?: number; developer?: string; view?: string; availableFrom?: string }[] =
    await client.fetch(`*[_type == "property"]{ _id, title, community, type, beds, completion, parking, developer, view, availableFrom }`);

  let patched = 0;

  for (const doc of docs) {
    const defaults = COMMUNITY_DEFAULTS[doc.community] ?? { developer: 'Private Developer', view: 'Community View' };
    const patch: Record<string, unknown> = {};

    if (doc.parking == null) patch.parking = parkingFor(doc.beds, doc.type);
    if (!doc.developer) patch.developer = defaults.developer;
    if (!doc.view) patch.view = defaults.view;
    if (!doc.availableFrom) patch.availableFrom = doc.completion === 'Ready' ? 'Immediately' : 'On Handover';

    if (Object.keys(patch).length > 0) {
      await client.patch(doc._id).set(patch).commit();
      console.log(`Patched ${doc.title}: ${Object.keys(patch).join(', ')}`);
      patched += 1;
    }
  }

  console.log(patched === 0 ? 'Nothing to backfill — all properties already have these fields.' : `Done — patched ${patched} propert${patched === 1 ? 'y' : 'ies'}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
