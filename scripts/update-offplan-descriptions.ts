// One-time script: patches description + amenities on the existing off-plan
// project documents (created by add-offplan-projects.ts) with expanded,
// longer-form copy. Matches by slug — does not create new documents.
//
// Usage: npm run update:offplan-descriptions

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
const DATA_PATH = path.resolve(import.meta.dirname, 'data', 'offplan-projects.json');

interface ProjectData {
  slug: string;
  description: string;
  amenities: string[];
}

async function run() {
  const projects: ProjectData[] = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  let updated = 0;
  let notFound = 0;

  for (const p of projects) {
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug: p.slug });
    if (!existing) {
      console.log(`Not found (skip): ${p.slug}`);
      notFound += 1;
      continue;
    }

    await client
      .patch(existing._id)
      .set({ description: p.description, amenities: p.amenities })
      .commit();

    console.log(`Updated: ${p.slug}`);
    updated += 1;
  }

  console.log(`\nDone — updated ${updated}, not found ${notFound}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
