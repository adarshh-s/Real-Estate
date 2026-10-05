// One-time script: applies the client's internal T1/T2/T3 developer-tier
// categorization to existing off-plan projects in Sanity.
//
// Matched by exact project `name` as currently stored. A few of the client's
// names differ slightly from what's in Sanity (typos / shorthand on their
// side, or our own earlier transcription) — mapped to the closest existing
// project; see the printed warnings for anything that didn't match 1:1.
//
// Usage: npm run tier:offplan-projects

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

// name (as stored in Sanity) -> tier. Comment notes the client's original label where it differs.
const TIER_MAP: Record<string, 'T1' | 'T2' | 'T3'> = {
  // T1
  'Alva at The Valley': 'T1', // client listed as The Valley "Alaya" — closest existing project; name likely needs correcting to "Alaya at The Valley"
  'Valia at Dubai Creek Harbour': 'T1',
  'Jumeirah Residences Asora Bay': 'T1',
  'City Walk Crestlane': 'T1', // client listed as "Crestlane 5"
  'Jumeirah Residences Emirates Towers': 'T1', // client listed as "Jumeirah Residence"
  'Lumena Alta': 'T1',
  'Arancia Yards': 'T1', // client listed as "Arancia"
  'The Meriva Collection': 'T1', // client listed as "Meriva Signature"
  'Costa Mare': 'T1',
  'Sobha Sanctuary': 'T1', // client listed as "Santury"
  'Sobha Central': 'T1',

  // T2
  'Bugatti Residences by Binghatti': 'T2', // client listed as "Bugatti"
  'Greenz by Danube': 'T2', // client listed as "Greens"
  'Bayz 102': 'T2',
  'Chelsea Residences': 'T2', // client listed as "Chelsea"
  'DAMAC Islands': 'T2', // client listed as "Islands (New Launch)"
  'The Archive': 'T2',
  'The Symphony': 'T2', // client listed as "Symphony"
  Linar: 'T2', // client listed as "Linar new launch"

  // T3
  'Samana Business Park': 'T3',
  'Samana Greens': 'T3', // client listed as "Greenfields" — closest existing Samana project
  'REEF 997': 'T3', // client listed as "997"
  'Alta V1ew Skyhomes': 'T3', // client listed as "Alta Views"
  'Moonsa Residences': 'T3', // client listed as "Moonsa"
  'Terra Tower': 'T3',
  'Tiger Sky Tower': 'T3', // client listed as "Tiger Sky"
  'Volga Tower': 'T3', // client listed as "Volga"
};

async function run() {
  let updated = 0;
  let missing = 0;
  for (const [name, tier] of Object.entries(TIER_MAP)) {
    const result = await client
      .patch({ query: '*[_type == "project" && name == $name]', params: { name } })
      .set({ tier })
      .commit({ autoGenerateArrayKeys: true })
      .catch(() => null);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.warn(`No project found matching name: "${name}" (tier ${tier})`);
      missing++;
    } else {
      console.log(`Tiered "${name}" -> ${tier}`);
      updated++;
    }
  }
  console.log(`\nDone — ${updated} projects tiered, ${missing} not found.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
