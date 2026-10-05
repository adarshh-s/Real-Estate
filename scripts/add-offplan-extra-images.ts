// Bulk-uploads additional images for off-plan projects, appending them to
// each project's existing `images` array. Reads every subfolder under
// EXTRA_IMAGES_DIR (one per project slug) and appends whatever image files
// are found there — sourced separately, this script only handles the upload.
//
// Usage: npm run add:offplan-extra-images

import { createClient } from '@sanity/client';
import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, join } from 'path';

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

const EXTRA_IMAGES_DIR =
  '/private/tmp/claude-501/-Users-adarsh-Desktop-Projects-Real-Estate/be09264d-ee0d-4ff5-94ab-835a1cda1358/scratchpad/offplan-images-extra';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

async function run() {
  const slugFolders = readdirSync(EXTRA_IMAGES_DIR).filter((f) => statSync(join(EXTRA_IMAGES_DIR, f)).isDirectory());

  console.log(`Found ${slugFolders.length} project folders to process.\n`);

  let totalUploaded = 0;
  let projectsUpdated = 0;

  for (const slug of slugFolders) {
    const folder = join(EXTRA_IMAGES_DIR, slug);
    const files = readdirSync(folder)
      .filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()))
      .sort();

    if (files.length === 0) {
      console.log(`Skip (no images found): ${slug}`);
      continue;
    }

    const doc = await client.fetch<{ _id: string; name: string } | null>(
      `*[_type == "project" && slug.current == $slug][0]{ _id, name }`,
      { slug },
    );

    if (!doc) {
      console.log(`Skip (no matching project): ${slug}`);
      continue;
    }

    const newImages = [];
    for (const file of files) {
      const path = join(folder, file);
      const buffer = readFileSync(path);
      if (buffer.length < 1000) continue; // skip empty/broken downloads
      const asset = await client.assets.upload('image', buffer, { filename: file });
      newImages.push({
        _type: 'image',
        _key: randomKey(),
        asset: { _type: 'reference', _ref: asset._id },
      });
    }

    if (newImages.length === 0) {
      console.log(`Skip (no valid images): ${slug}`);
      continue;
    }

    await client.patch(doc._id).setIfMissing({ images: [] }).append('images', newImages).commit();
    console.log(`Added ${newImages.length} image(s) to "${doc.name}" (${slug})`);
    totalUploaded += newImages.length;
    projectsUpdated += 1;
  }

  console.log(`\nDone — ${totalUploaded} images added across ${projectsUpdated} projects.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
