// One-time script: pushes today's bundled demo content (properties, projects,
// communities, agents, testimonials, hero video) into a Sanity project so the
// client's Studio starts populated instead of empty. Safe to point at a fresh,
// empty dataset; refuses to run against a dataset that already has properties
// in it unless --force is passed, to avoid accidental duplicates.
//
// Usage:
//   1. Fill in .env at the project root (see .env.example) with:
//        VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, SANITY_WRITE_TOKEN
//   2. npm run migrate:sanity

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

try {
  process.loadEnvFile();
} catch {
  // no .env file yet — fall through to the missing-var check below
}
import { properties } from '../src/data/properties.ts';
import { projects } from '../src/data/projects.ts';
import { communities } from '../src/data/communities.ts';
import { agents } from '../src/data/agents.ts';
import { testimonials } from '../src/data/testimonials.ts';

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes('--force');

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.');
  console.error('Copy .env.example to .env and fill both in first — see the README for where to get them.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });
const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');

async function uploadAsset(assetType: 'image' | 'file', source: string, filenameHint?: string): Promise<string> {
  let buffer: Buffer;
  let filename = filenameHint;
  if (source.startsWith('http')) {
    const res = await fetch(source);
    buffer = Buffer.from(await res.arrayBuffer());
    filename ??= source.split('/').pop()?.split('?')[0] || `${assetType}`;
  } else {
    const filePath = path.join(PUBLIC_DIR, source.replace(/^\//, ''));
    buffer = fs.readFileSync(filePath);
    filename ??= path.basename(filePath);
  }
  const asset = await client.assets.upload(assetType, buffer, { filename });
  return asset._id;
}

const image = (assetId: string) => ({ _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } });

async function run() {
  const existing = await client.fetch<number>(`count(*[_type == "property"])`);
  if (existing > 0 && !force) {
    console.error(
      `This dataset already has ${existing} propert${existing === 1 ? 'y' : 'ies'} in it. ` +
        'Re-running would create duplicates. Pass --force if you really want to proceed anyway.',
    );
    process.exit(1);
  }

  console.log(`Migrating demo content into Sanity project ${projectId}/${dataset}...\n`);

  console.log('Communities:');
  const communityIdBySlug: Record<string, string> = {};
  for (const c of communities) {
    const imageAssetId = await uploadAsset('image', c.image);
    const doc = await client.create({
      _type: 'community',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      image: image(imageAssetId),
      tagline: c.tagline,
      description: c.description,
      avgPricePerSqft: c.avgPricePerSqft,
      listingsCount: c.listingsCount,
      popularFor: c.popularFor,
      location: c.location ? { _type: 'geopoint', lat: c.location.lat, lng: c.location.lng } : undefined,
    });
    communityIdBySlug[c.slug] = doc._id;
    console.log(`  + ${c.name}`);
  }

  console.log('\nAgents:');
  const agentIdBySlug: Record<string, string> = {};
  for (const a of agents) {
    const photoAssetId = await uploadAsset('image', a.photo);
    const doc = await client.create({
      _type: 'agent',
      name: a.name,
      slug: { _type: 'slug', current: a.slug },
      title: a.title,
      photo: image(photoAssetId),
      phone: a.phone,
      whatsapp: a.whatsapp,
      email: a.email,
      languages: a.languages,
      specialties: a.specialties,
      bio: a.bio,
      listingsCount: a.listingsCount,
    });
    agentIdBySlug[a.slug] = doc._id;
    console.log(`  + ${a.name}`);
  }
  const agentSlugById = Object.fromEntries(agents.map((a) => [a.id, a.slug]));

  console.log('\nProperties:');
  for (const p of properties) {
    const imageAssetIds = await Promise.all(p.images.slice(0, 6).map((url) => uploadAsset('image', url)));
    const agentSlug = agentSlugById[p.agentId];
    await client.create({
      _type: 'property',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      community: p.community,
      subCommunity: p.subCommunity,
      type: p.type,
      status: p.status,
      priceAED: p.priceAED,
      rentPeriod: p.rentPeriod,
      beds: p.beds,
      baths: p.baths,
      sizeSqft: p.sizeSqft,
      plotSqft: p.plotSqft,
      furnishing: p.furnishing,
      completion: p.completion,
      images: imageAssetIds.map(image),
      description: p.description,
      amenities: p.amenities,
      agent: agentSlug ? { _type: 'reference', _ref: agentIdBySlug[agentSlug] } : undefined,
      tags: p.tags,
      featured: p.featured ?? false,
      yearBuilt: p.yearBuilt,
      reference: p.reference,
      location: p.location ? { _type: 'geopoint', lat: p.location.lat, lng: p.location.lng } : undefined,
    });
    console.log(`  + ${p.title}`);
  }

  console.log('\nOff-plan projects:');
  for (const pr of projects) {
    const imageAssetIds = await Promise.all(pr.images.slice(0, 6).map((url) => uploadAsset('image', url)));
    await client.create({
      _type: 'project',
      name: pr.name,
      slug: { _type: 'slug', current: pr.slug },
      developer: pr.developer,
      community: pr.community,
      status: pr.status,
      priceFromAED: pr.priceFromAED,
      paymentPlan: pr.paymentPlan,
      handover: pr.handover,
      images: imageAssetIds.map(image),
      description: pr.description,
      unitTypes: pr.unitTypes,
      amenities: pr.amenities,
    });
    console.log(`  + ${pr.name}`);
  }

  console.log('\nTestimonials:');
  for (const t of testimonials) {
    await client.create({ _type: 'testimonial', name: t.name, role: t.role, quote: t.quote });
    console.log(`  + ${t.name}`);
  }

  console.log('\nSite settings (hero + cinematic video)...');
  const heroVideoAssetId = await uploadAsset('file', '/videos/hero-luxury-home.mp4');
  const heroPosterAssetId = await uploadAsset('image', '/hero-poster.jpg');
  const interstitialVideoAssetId = await uploadAsset('file', '/videos/twilight-villa.mp4');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroVideo: { _type: 'file', asset: { _type: 'reference', _ref: heroVideoAssetId } },
    heroPoster: image(heroPosterAssetId),
    heroKicker: 'Dubai · International Realty',
    heroHeadlineLine1: 'Extraordinary addresses,',
    heroHeadlineLine2: 'for an extraordinary city.',
    heroSubtitle:
      'Sialuxe Real Estate curates Dubai’s finest waterfront villas, sky residences and private estates for a global clientele — with the discretion of a private office.',
    interstitialVideo: { _type: 'file', asset: { _type: 'reference', _ref: interstitialVideoAssetId } },
    interstitialHeadline: 'Where every address is extraordinary',
    interstitialBody:
      'From private beach clubs to sky-high infinity pools, discover what sets a Sialuxe residence apart.',
    contactPhone: '+971 4 555 0100',
    contactEmail: 'hello@sialuxe.ae',
    whatsappNumber: '971505550100',
    officeAddress: 'Gate Village 7, DIFC, Dubai, UAE',
  });
  console.log('  + Site Settings');

  console.log('\nDone. Open the Studio and you should see everything populated.');
}

run().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
