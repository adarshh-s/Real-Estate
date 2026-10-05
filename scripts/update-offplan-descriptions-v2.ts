// One-time script: replaces the short (100-150 word) off-plan project
// descriptions with expanded 400-500 word versions. Matches by slug.
//
// Usage: npm run update:offplan-descriptions-v2

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
const DATA_PATH = path.resolve(import.meta.dirname, 'data', 'offplan-descriptions-expanded.json');

async function run() {
  const descriptions: Record<string, string> = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  let updated = 0;
  let notFound = 0;

  for (const [slug, description] of Object.entries(descriptions)) {
    const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug });
    if (!doc) {
      console.log(`Not found (skip): ${slug}`);
      notFound += 1;
      continue;
    }
    await client.patch(doc._id).set({ description }).commit();
    console.log(`Updated: ${slug} (${description.split(' ').length} words)`);
    updated += 1;
  }

  console.log(`\nDone — updated ${updated}, not found ${notFound}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
