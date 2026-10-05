// One-time script: fixes a data-modeling inconsistency found while auditing
// the Communities section — most properties had their `community` field set
// to the specific building/development name (e.g. "Gardenia Livings") with
// the actual area/community in `subCommunity` (e.g. "Arjan, Dubai"), while a
// couple of properties had it the other way around. Since CommunityDetail.tsx
// matches listings to a community page via `property.community === name`,
// this inconsistency meant most properties never showed up on any community
// page. This script normalizes every property so `community` always holds
// the true area name and `subCommunity` holds the specific building name.
//
// Usage: npm run normalize:property-communities

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

// title -> correct { community, subCommunity }, derived from each property's
// own subCommunity text (stripped of ", Dubai" suffixes and typos).
const FIXES: Record<string, { community: string; subCommunity: string }> = {
  'Fully Furnished | Spacious | Prime Location': { community: 'Arjan', subCommunity: 'Gardenia Livings' },
  'Brand New | Single Row | Appliances Included': { community: 'DAMAC Lagoons', subCommunity: 'Malta 1' },
  'Mid Floor | Open View | New Project': { community: 'Jumeirah Village Circle (JVC)', subCommunity: 'Pearl House 1' },
  'Green Open View | New Built | Vacant Unit': { community: 'Dubai Hills Estate', subCommunity: 'Golf Grand' },
  'Golf Front | 4br + Maid | Rooftop Terrace': { community: 'Emaar South', subCommunity: 'Golf Lane' },
  'Hot Deal I Spacious | Furnished | Pool&Gym': { community: 'Business Bay', subCommunity: 'Bay Square 9' },
  'Modern Layout | Waterfront Living |': { community: 'Dubai Maritime City', subCommunity: 'The Mural' },
  'Park View | Vacant | High Floor | Majan': { community: 'Majan', subCommunity: 'The Haven B' },
  'Spacious | Vacant | Fully Furnished | 4 Cheques': { community: 'Al Furjan', subCommunity: 'Talia Residences' },
  'Spacious | All En-Suite | Villa Views | Vacant Now': { community: 'Dubai Festival City (DFC)', subCommunity: 'Al Badia Residences 23' },
  // Downtown Dubai and Palace Residences Creek Blue were already correct — no entry needed.
};

async function run() {
  let updated = 0;

  for (const [title, fix] of Object.entries(FIXES)) {
    const doc = await client.fetch(`*[_type == "property" && title == $title][0]{_id}`, { title });
    if (!doc) {
      console.log(`Not found (skip): ${title}`);
      continue;
    }
    await client.patch(doc._id).set(fix).commit();
    console.log(`Fixed: ${title} -> community="${fix.community}", subCommunity="${fix.subCommunity}"`);
    updated += 1;
  }

  console.log(`\nDone — updated ${updated} properties.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
