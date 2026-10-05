// One-time script: creates the researched real-world off-plan project documents
// in Sanity, with an official marketing image per project where one was found.
// Safe to re-run — skips any slug that already exists.
//
// Usage: npm run add:offplan-projects

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
const IMAGES_DIR = '/private/tmp/claude-501/-Users-adarsh-Desktop-Projects-Real-Estate/be09264d-ee0d-4ff5-94ab-835a1cda1358/scratchpad/offplan-images';

interface ProjectData {
  slug: string;
  name: string;
  developer: string;
  community: string;
  status: string;
  priceFromAED: number | null;
  handover: string;
  unitTypes: string[];
  amenities: string[];
  description: string;
  imageFile: string;
}

async function uploadImage(filename: string) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 1000) return null; // skip empty/broken downloads
  const asset = await client.assets.upload('image', buffer, { filename });
  return asset._id;
}

async function run() {
  const projects: ProjectData[] = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  let created = 0;
  let skippedExisting = 0;
  let missingImage = 0;

  for (const p of projects) {
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug: p.slug });
    if (existing) {
      console.log(`Skip (already exists): ${p.name}`);
      skippedExisting += 1;
      continue;
    }

    const imageAssetId = await uploadImage(p.imageFile);
    if (!imageAssetId) missingImage += 1;

    await client.create({
      _type: 'project',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      developer: p.developer,
      community: p.community,
      status: p.status,
      ...(p.priceFromAED != null ? { priceFromAED: p.priceFromAED } : {}),
      handover: p.handover,
      unitTypes: p.unitTypes,
      amenities: p.amenities,
      description: p.description,
      showInActivity: false,
      ...(imageAssetId
        ? { images: [{ _type: 'image', _key: 'img0', asset: { _type: 'reference', _ref: imageAssetId } }] }
        : {}),
    });

    console.log(`Created: ${p.name}${imageAssetId ? '' : ' (no image found)'}`);
    created += 1;
  }

  console.log(
    `\nDone — created ${created}, skipped ${skippedExisting} existing, ${missingImage} created without an image.`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
