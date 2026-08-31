// One-time script: renames "Providence"/"Providence Estates" to "Sialuxe"/
// "Sialuxe Real Estate" inside text fields on documents already seeded in
// Sanity by migrate-to-sanity.ts. Safe to run more than once (it's a no-op
// once nothing matches "Providence" anymore).
//
// Usage: npm run rebrand:sanity

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

function rebrand(text: string): string {
  return text
    .replace(/providence-tower-downtown/g, 'sialuxe-tower-downtown')
    .replace(/Providence Tower/g, 'Sialuxe Tower')
    .replace(/providence\.ae/g, 'sialuxe.ae')
    .replace(/Providence Estates/g, 'Sialuxe Real Estate')
    .replace(/PROVIDENCE ESTATES/g, 'SIALUXE REAL ESTATE')
    .replace(/Providence['’]s/g, 'Sialuxe’s')
    .replace(/Providence/g, 'Sialuxe')
    .replace(/PROVIDENCE/g, 'SIALUXE');
}

const TEXT_FIELDS: Record<string, string[]> = {
  siteSettings: ['heroKicker', 'heroHeadlineLine1', 'heroHeadlineLine2', 'heroSubtitle', 'interstitialHeadline', 'interstitialBody', 'contactEmail', 'officeAddress'],
  agent: ['name', 'title', 'email', 'bio'],
  testimonial: ['name', 'role', 'quote'],
  project: ['name', 'developer', 'community', 'description'],
};

async function run() {
  let patchedCount = 0;

  for (const [type, fields] of Object.entries(TEXT_FIELDS)) {
    const docs: Record<string, unknown>[] = await client.fetch(`*[_type == $type]`, { type });

    for (const doc of docs) {
      const patch: Record<string, unknown> = {};

      for (const field of fields) {
        const value = doc[field];
        if (typeof value === 'string' && /providence/i.test(value)) {
          patch[field] = rebrand(value);
        }
      }

      if (doc.slug && typeof doc.slug === 'object' && 'current' in doc.slug) {
        const current = (doc.slug as { current: string }).current;
        if (/providence/i.test(current)) {
          patch.slug = { ...(doc.slug as object), current: rebrand(current) };
        }
      }

      if (Object.keys(patch).length > 0) {
        await client.patch(doc._id as string).set(patch).commit();
        console.log(`Patched ${type} ${doc._id}: ${Object.keys(patch).join(', ')}`);
        patchedCount += 1;
      }
    }
  }

  console.log(patchedCount === 0 ? 'Nothing to rebrand — no "Providence" text found in Sanity.' : `Done — patched ${patchedCount} document(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
