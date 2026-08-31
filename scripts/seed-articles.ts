// One-time script: seeds the Journal articles into Sanity without touching
// any other content type. Written separately from migrate-to-sanity.ts
// because that script refuses to re-run once properties already exist —
// this lets the Journal be added to an already-migrated project.
// Safe to run more than once — skips articles that already exist by slug.
//
// Usage: npm run seed:articles

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

try {
  process.loadEnvFile();
} catch {
  // no .env file yet — fall through to the missing-var check below
}

import { articles } from '../src/data/articles.ts';
import { agents } from '../src/data/agents.ts';

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });
const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');

function image(assetId: string) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
}

async function uploadAsset(kind: 'image' | 'file', src: string): Promise<string> {
  if (src.startsWith('http')) {
    const res = await fetch(src);
    const buffer = Buffer.from(await res.arrayBuffer());
    const doc = await client.assets.upload(kind, buffer);
    return doc._id;
  }
  const filePath = path.join(PUBLIC_DIR, src.replace(/^\//, ''));
  const buffer = fs.readFileSync(filePath);
  const doc = await client.assets.upload(kind, buffer);
  return doc._id;
}

async function run() {
  const agentIdBySlug: Record<string, string> = {};
  const existingAgents = await client.fetch<{ slug: string; _id: string }[]>(
    `*[_type == "agent"]{ "slug": slug.current, _id }`,
  );
  for (const a of existingAgents) agentIdBySlug[a.slug] = a._id;
  const agentSlugById = Object.fromEntries(agents.map((a) => [a.id, a.slug]));

  console.log('Journal articles:');
  for (const a of articles) {
    const existing = await client.fetch<{ _id: string; images?: unknown[] } | null>(
      `*[_type == "article" && slug.current == $slug][0]{ _id, images }`,
      { slug: a.slug },
    );

    if (existing) {
      if (a.images && a.images.length > 0 && (!existing.images || existing.images.length === 0)) {
        const imageAssetIds = await Promise.all(a.images.map((url) => uploadAsset('image', url)));
        await client.patch(existing._id).set({ images: imageAssetIds.map(image) }).commit();
        console.log(`  ~ ${a.title} (added gallery images)`);
      } else {
        console.log(`  = ${a.title} (already exists, skipped)`);
      }
      continue;
    }

    const coverAssetId = await uploadAsset('image', a.coverImage);
    const imageAssetIds = a.images ? await Promise.all(a.images.map((url) => uploadAsset('image', url))) : [];
    const authorSlug = agentSlugById[a.authorId ?? ''];
    await client.create({
      _type: 'article',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      category: a.category,
      coverImage: image(coverAssetId),
      images: imageAssetIds.length > 0 ? imageAssetIds.map(image) : undefined,
      excerpt: a.excerpt,
      body: a.body,
      author: authorSlug && agentIdBySlug[authorSlug] ? { _type: 'reference', _ref: agentIdBySlug[authorSlug] } : undefined,
      publishedAt: a.publishedAt,
      readMinutes: a.readMinutes,
      featured: a.featured ?? false,
    });
    console.log(`  + ${a.title}`);
  }

  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
