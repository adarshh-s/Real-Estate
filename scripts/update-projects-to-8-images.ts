import { createClient } from '@sanity/client';

try {
  process.loadEnvFile();
} catch {
  // no-op
}

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function run() {
  console.log('Fetching projects and candidate high-res image assets from Sanity...\n');

  // 1. Fetch all projects
  const projects = await client.fetch<
    {
      _id: string;
      name: string;
      slug: string;
      images: { _key: string; _type: string; asset: { _ref: string } }[];
    }[]
  >(`*[_type == "project"]{
    _id,
    name,
    "slug": slug.current,
    "images": coalesce(images, [])
  }`);

  // 2. Fetch high-res landscape image assets
  const candidateAssets = await client.fetch<
    {
      _id: string;
      originalFilename: string;
      w: number;
      h: number;
    }[]
  >(`*[_type == "sanity.imageAsset" && metadata.dimensions.width >= 1200 && metadata.dimensions.aspectRatio > 1.2]{
    _id,
    originalFilename,
    "w": metadata.dimensions.width,
    "h": metadata.dimensions.height
  }`);

  console.log(`Found ${projects.length} projects and ${candidateAssets.length} high-res landscape assets.`);

  const TARGET_COUNT = 8;
  let totalAdded = 0;
  let projectsUpdated = 0;

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const currentImages = p.images || [];
    const currentCount = currentImages.length;

    if (currentCount >= TARGET_COUNT) {
      console.log(`- "${p.name}" (${p.slug}): already has ${currentCount} images, skipping.`);
      continue;
    }

    const needed = TARGET_COUNT - currentCount;
    const existingRefs = new Set(currentImages.map((img) => img.asset?._ref).filter(Boolean));

    // Filter candidate assets not already in this project
    const available = candidateAssets.filter((a) => !existingRefs.has(a._id));
    if (available.length === 0) {
      console.warn(`- "${p.name}" (${p.slug}): no available unique candidate assets!`);
      continue;
    }

    // Pick deterministic distinct assets based on project slug
    const seed = hashString(p.slug || p._id);
    const newImageItems = [];

    for (let j = 0; j < needed; j++) {
      const assetIdx = (seed + j * 7 + i * 3) % available.length;
      const pickedAsset = available[assetIdx];
      existingRefs.add(pickedAsset._id); // avoid picking same in this loop

      newImageItems.push({
        _type: 'image',
        _key: randomKey(),
        asset: {
          _type: 'reference',
          _ref: pickedAsset._id,
        },
      });
    }

    // Append to Sanity document
    await client
      .patch(p._id)
      .setIfMissing({ images: [] })
      .append('images', newImageItems)
      .commit();

    console.log(
      `✓ "${p.name}" (${p.slug}): added ${newImageItems.length} image(s) (${currentCount} -> ${currentCount + newImageItems.length})`
    );

    totalAdded += newImageItems.length;
    projectsUpdated += 1;
  }

  console.log(`\nAll done! Added ${totalAdded} image(s) across ${projectsUpdated} projects.`);
}

run().catch((err) => {
  console.error('Error updating projects:', err);
  process.exit(1);
});
