// Bulk-uploads every image in a local folder and appends them to a
// property's `images` array in Sanity — a workaround for when the Studio's
// own drag-and-drop multi-upload isn't cooperating. Existing images on the
// property are kept; these are added after them.
//
// Usage: npm run upload:images -- <property-slug> <path-to-folder>
// Example: npm run upload:images -- palace-residences-creek-blue ~/Desktop/pearl-house-photos

import { createClient } from '@sanity/client';
import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, join } from 'path';

try {
  process.loadEnvFile();
} catch {
  // no .env file yet — fall through to the missing-var check below
}

const [, , slug, folder] = process.argv;

if (!slug || !folder) {
  console.error('Usage: npm run upload:images -- <property-slug> <path-to-folder>');
  process.exit(1);
}

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

async function run() {
  if (!statSync(folder).isDirectory()) {
    console.error(`Not a folder: ${folder}`);
    process.exit(1);
  }

  const files = readdirSync(folder)
    .filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.error(`No image files found in ${folder}`);
    process.exit(1);
  }

  const property = await client.fetch<{ _id: string; title: string } | null>(
    `*[_type == "property" && slug.current == $slug][0]{ _id, title }`,
    { slug },
  );

  if (!property) {
    console.error(`No property found with slug "${slug}".`);
    process.exit(1);
  }

  console.log(`Uploading ${files.length} image(s) to "${property.title}"...`);

  const newImages = [];
  for (const file of files) {
    const path = join(folder, file);
    const asset = await client.assets.upload('image', readFileSync(path), { filename: file });
    newImages.push({
      _type: 'image',
      _key: randomKey(),
      asset: { _type: 'reference', _ref: asset._id },
    });
    console.log(`  uploaded: ${file}`);
  }

  await client.patch(property._id).setIfMissing({ images: [] }).append('images', newImages).commit();

  console.log(`Done — added ${newImages.length} image(s) to "${property.title}".`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
