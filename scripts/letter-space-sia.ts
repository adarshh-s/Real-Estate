// One-time script: changes "Sia Luxe" -> "S I A Luxe" (and the all-caps
// equivalent) inside text fields on documents already seeded in Sanity.
// Safe to run more than once — it's a no-op once nothing matches "Sia Luxe"
// anymore. Email domains are left untouched on purpose.

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

function letterSpace(text: string): string {
  return text.replace(/SIA LUXE/g, 'S I A LUXE').replace(/Sia Luxe/g, 'S I A Luxe');
}

const TEXT_FIELDS: Record<string, string[]> = {
  siteSettings: ['heroKicker', 'heroHeadlineLine1', 'heroHeadlineLine2', 'heroSubtitle', 'interstitialHeadline', 'interstitialBody', 'officeAddress'],
  agent: ['name', 'title', 'bio'],
  testimonial: ['name', 'role', 'quote'],
  project: ['name', 'developer', 'community', 'description'],
  article: ['title', 'excerpt', 'body'],
};

async function run() {
  let patchedCount = 0;

  for (const [type, fields] of Object.entries(TEXT_FIELDS)) {
    const docs: Record<string, unknown>[] = await client.fetch(`*[_type == $type]`, { type });

    for (const doc of docs) {
      const patch: Record<string, unknown> = {};

      for (const field of fields) {
        const value = doc[field];
        if (typeof value === 'string' && /sia luxe/i.test(value)) {
          patch[field] = letterSpace(value);
        }
      }

      if (Object.keys(patch).length > 0) {
        await client.patch(doc._id as string).set(patch).commit();
        console.log(`Patched ${type} ${doc._id}: ${Object.keys(patch).join(', ')}`);
        patchedCount += 1;
      }
    }
  }

  console.log(patchedCount === 0 ? 'Nothing to fix — no "Sia Luxe" text found in Sanity.' : `Done — patched ${patchedCount} document(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
