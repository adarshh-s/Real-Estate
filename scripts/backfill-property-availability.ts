// One-time script: fills parking/availableFrom ONLY where the property's own
// description or title text explicitly states it (e.g. "ready for immediate
// move-in", "dedicated parking", title contains "Vacant"). Does not guess —
// properties with no textual evidence are left untouched. Reference numbers
// and parking counts with no explicit figure anywhere in the source data are
// left blank; they need the client's real values, not an invented one.
//
// Usage: npm run backfill:property-availability

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

const FIXES: { titleMatch: string; set: Record<string, unknown>; reason: string }[] = [
  {
    titleMatch: 'High Floor Unfurnished 3br + Maid | Downtown Dubai',
    set: { parking: 1, availableFrom: 'Immediately' },
    reason: 'description says "dedicated parking" and "ready for immediate move-in"',
  },
  {
    titleMatch: 'Hot Deal I Spacious | Furnished | Pool&Gym',
    set: { availableFrom: 'Immediately' },
    reason: 'description says "vacant, ready-to-move-in residence" (parking already set)',
  },
  {
    titleMatch: 'Park View | Vacant | High Floor | Majan',
    set: { availableFrom: 'Immediately' },
    reason: 'title says "Vacant" and description says "vacant, ready-to-move-in residence"',
  },
  {
    titleMatch: 'Spacious | Vacant | Fully Furnished | 4 Cheques',
    set: { availableFrom: 'Immediately' },
    reason: 'title explicitly states "Vacant"',
  },
  {
    titleMatch: 'Spacious | All En-Suite | Villa Views | Vacant Now',
    set: { availableFrom: 'Immediately' },
    reason: 'title says "Vacant Now" and description says "vacant and ready for immediate move-in"',
  },
];

async function run() {
  for (const fix of FIXES) {
    const doc = await client.fetch(`*[_type == "property" && title == $title][0]{_id}`, { title: fix.titleMatch });
    if (!doc) {
      console.log(`Not found (skip): ${fix.titleMatch}`);
      continue;
    }
    await client.patch(doc._id).set(fix.set).commit();
    console.log(`Updated: ${fix.titleMatch} — ${JSON.stringify(fix.set)} (${fix.reason})`);
  }
  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
