// One-time script: removes curated community documents that have zero
// matching real properties or off-plan projects, and updates the
// `listingsCount` on the remaining communities to reflect actual inventory
// counts rather than demo placeholder numbers.
//
// Usage: npm run prune:communities

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

const UNAVAILABLE_NAMES = [
  'Emirates Hills',
  'Jumeirah Bay Island',
  'Jumeirah Beach Residence',
  'DIFC',
  'Al Barari',
  'Mina Rashid',
  'Palm Jumeirah',
  'Dubai Marina',
  'Bluewaters Island',
  'District One',
  'Tilal Al Ghaf',
  'Nad Al Sheba',
];

async function run() {
  console.log('Removing communities with no matching real inventory...\n');
  for (const name of UNAVAILABLE_NAMES) {
    const doc = await client.fetch(`*[_type == "community" && name == $name][0]{_id}`, { name });
    if (!doc) {
      console.log(`Not found (skip): ${name}`);
      continue;
    }
    await client.delete(doc._id);
    console.log(`Deleted: ${name}`);
  }

  console.log('\nUpdating listingsCount on remaining communities...\n');
  const remaining: { _id: string; name: string }[] = await client.fetch(`*[_type == "community"]{_id, name}`);
  for (const c of remaining) {
    const propertyCount: number = await client.fetch(`count(*[_type == "property" && community == $name])`, {
      name: c.name,
    });
    const projectCount: number = await client.fetch(
      `count(*[_type == "project" && community match $namePattern])`,
      { namePattern: `*${c.name}*` },
    );
    const total = propertyCount + projectCount;
    await client.patch(c._id).set({ listingsCount: total }).commit();
    console.log(`${c.name}: ${propertyCount} properties + ${projectCount} projects = ${total}`);
  }

  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
