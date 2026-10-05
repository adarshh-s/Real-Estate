// One-time script: fixes specific data-quality issues found while auditing
// existing property documents — not a generic backfill. Each fix here is
// either a confirmed factual correction (Pearl House 1's developer, verified
// via web search) or a clear migration artifact (an apartment with a
// negative/placeholder plot size, a size/plot field swap, a stray rentPeriod
// left on a For Sale listing, or a competitor's own boilerplate copy that
// slipped into an imported description).
//
// Usage: npm run fix:property-data

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

async function run() {
  // 1. "Fully Furnished | Spacious | Prime Location" (Gardenia Livings, Arjan) —
  //    sizeSqft was 1 (junk) while plotSqft held 742, which matches a normal
  //    1-bed apartment size and appears to be the true sizeSqft misfiled during
  //    import. Apartments don't have their own plot, so plotSqft is cleared.
  const gardenia = await client.fetch(`*[_type == "property" && title == "Fully Furnished | Spacious | Prime Location"][0]{_id}`);
  if (gardenia) {
    await client.patch(gardenia._id).set({ sizeSqft: 742 }).unset(['plotSqft']).commit();
    console.log('Fixed: Fully Furnished | Spacious | Prime Location (sizeSqft 1 -> 742, cleared bad plotSqft)');
  }

  // 2. "Mid Floor | Open View | New Project" (Pearl House 1, JVC) —
  //    developer was blank; confirmed via web search (Gulf News) that Pearl
  //    House 1 was developed by Imtiaz Developments — also stated in the
  //    property's own description text. plotSqft was -2 (junk, apartment).
  //    Description also had fäm Properties' own boilerplate ("contact fäm
  //    Properties — your trusted partner...") left over from the source
  //    import, actively directing enquiries to a competitor — removed.
  const pearlHouse = await client.fetch(
    `*[_type == "property" && title == "Mid Floor | Open View | New Project"][0]{_id, description}`,
  );
  if (pearlHouse) {
    const cleanedDescription = pearlHouse.description
      .split('As the largest real estate agency in Dubai')[0]
      .trim();
    await client
      .patch(pearlHouse._id)
      .set({ developer: 'Imtiaz Developments', description: cleanedDescription })
      .unset(['plotSqft'])
      .commit();
    console.log('Fixed: Mid Floor | Open View | New Project (developer set, cleared bad plotSqft, stripped fäm Properties boilerplate)');
  }

  // 3. Stray rentPeriod left set on For Sale listings (field is only meaningful
  //    for For Rent listings; harmless in the UI since it's conditionally
  //    hidden, but incorrect at the data level).
  const forSaleWithRentPeriod: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "property" && status == "For Sale" && defined(rentPeriod)]{_id, title}`,
  );
  for (const p of forSaleWithRentPeriod) {
    await client.patch(p._id).unset(['rentPeriod']).commit();
    console.log(`Fixed: ${p.title} (cleared stray rentPeriod on a For Sale listing)`);
  }

  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
