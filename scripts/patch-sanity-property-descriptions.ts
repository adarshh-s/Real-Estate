import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

try {
  process.loadEnvFile();
} catch {
  // fall through to check below
}

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'lp7d6opw';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN in environment.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const DATA_PATH = path.resolve('scripts/data/ready-properties-structured.json');

async function run() {
  const descriptions: Record<string, string> = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const properties: { _id: string; slug: string }[] = await client.fetch(
    `*[_type == "property"]{ _id, "slug": slug.current }`
  );

  console.log(`Found ${properties.length} property documents in Sanity.`);
  let updated = 0;
  let skipped = 0;

  for (const p of properties) {
    const structuredDesc = descriptions[p.slug];
    if (!structuredDesc) {
      console.log(`No structured description for slug: ${p.slug} (skip)`);
      skipped += 1;
      continue;
    }

    await client
      .patch(p._id)
      .set({ description: structuredDesc })
      .commit();

    console.log(`✓ Patched ${p.slug} (${structuredDesc.split('\n').length} lines)`);
    updated += 1;
  }

  console.log(`\nDone — successfully updated ${updated} properties in Sanity. Skipped: ${skipped}.`);
}

run().catch((err) => {
  console.error('Patch failed:', err);
  process.exit(1);
});
