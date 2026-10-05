// One-time script: patches paymentPlan (and a few remaining priceFromAED /
// handover gaps) onto the off-plan project documents, using only figures
// verified via web search against developer sites / major portals.
//
// Projects whose real payment structure includes a post-handover instalment
// tail (a 4th bucket our schema doesn't have) are deliberately left without a
// paymentPlan here rather than force-fitting the post-handover percentage
// into "on handover" — that would misrepresent when the money is actually
// due. Same principle for prices/handover dates where sources conflicted
// too much to pick one confidently.
//
// Usage: npm run update:offplan-payment-plans

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

const PAYMENT_PLANS: Record<string, { onBooking: number; duringConstruction: number; onHandover: number }> = {
  'alana-the-valley': { onBooking: 10, duringConstruction: 80, onHandover: 10 },
  masaar: { onBooking: 5, duringConstruction: 35, onHandover: 60 },
  'al-ghadeer-gardens': { onBooking: 5, duringConstruction: 50, onHandover: 45 },
  'damac-islands': { onBooking: 20, duringConstruction: 55, onHandover: 25 },
  'greenz-by-danube': { onBooking: 10, duringConstruction: 60, onHandover: 30 },
  'reportage-village': { onBooking: 20, duringConstruction: 52, onHandover: 28 },
  'tilal-binghatti': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'the-valley': { onBooking: 10, duringConstruction: 70, onHandover: 20 },
  'sobha-sanctuary': { onBooking: 10, duringConstruction: 50, onHandover: 40 },
  'amali-residences': { onBooking: 5, duringConstruction: 55, onHandover: 40 },
  bayn: { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'palm-jebel-ali-villas': { onBooking: 20, duringConstruction: 60, onHandover: 20 },
  'ghaf-woods': { onBooking: 10, duringConstruction: 50, onHandover: 40 },
  athlon: { onBooking: 5, duringConstruction: 55, onHandover: 40 },
  valo: { onBooking: 10, duringConstruction: 80, onHandover: 10 },
  'jumeirah-asora-bay': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'city-walk-crestlane': { onBooking: 20, duringConstruction: 55, onHandover: 25 },
  'jumeirah-emirates-towers': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'lumena-alta': { onBooking: 5, duringConstruction: 45, onHandover: 50 },
  'arancia-yards': { onBooking: 10, duringConstruction: 30, onHandover: 60 },
  'meriva-collection': { onBooking: 20, duringConstruction: 50, onHandover: 30 },
  'costa-mare': { onBooking: 20, duringConstruction: 50, onHandover: 30 },
  'sobha-central': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'binghatti-skyrise': { onBooking: 20, duringConstruction: 50, onHandover: 30 },
  'bugatti-residences': { onBooking: 25, duringConstruction: 45, onHandover: 30 },
  'chelsea-residences': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'the-archive': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'the-symphony': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  linar: { onBooking: 5, duringConstruction: 25, onHandover: 70 },
  'reef-997': { onBooking: 20, duringConstruction: 40, onHandover: 40 },
  'alta-view-skyhomes': { onBooking: 20, duringConstruction: 50, onHandover: 30 },
};

const PRICE_FILLS: Record<string, number> = {
  'greenz-by-danube': 3500000,
  'tilal-binghatti': 4200000,
  valo: 1790000,
  'city-walk-crestlane': 2620000,
  'arancia-yards': 1000000,
  'costa-mare': 2775828,
  'sobha-central': 1520000,
  linar: 860000,
  'samana-greens': 639000,
  'the-heights': 2400000,
  'tiger-sky-tower': 2200000,
};

const HANDOVER_FILLS: Record<string, string> = {
  'greenz-by-danube': 'Q4 2029',
  'sobha-sanctuary': 'Q3 2029',
  'bayz-102': 'Dec 2029',
};

async function run() {
  let paymentUpdated = 0;
  let priceUpdated = 0;
  let handoverUpdated = 0;

  for (const [slug, plan] of Object.entries(PAYMENT_PLANS)) {
    const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug });
    if (!doc) {
      console.log(`Not found (skip payment plan): ${slug}`);
      continue;
    }
    await client.patch(doc._id).set({ paymentPlan: plan }).commit();
    console.log(`Payment plan set: ${slug} — ${plan.onBooking}/${plan.duringConstruction}/${plan.onHandover}`);
    paymentUpdated += 1;
  }

  for (const [slug, price] of Object.entries(PRICE_FILLS)) {
    const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug });
    if (!doc) continue;
    await client.patch(doc._id).set({ priceFromAED: price }).commit();
    console.log(`Price filled: ${slug} — AED ${price.toLocaleString()}`);
    priceUpdated += 1;
  }

  for (const [slug, handover] of Object.entries(HANDOVER_FILLS)) {
    const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, { slug });
    if (!doc) continue;
    await client.patch(doc._id).set({ handover }).commit();
    console.log(`Handover filled: ${slug} — ${handover}`);
    handoverUpdated += 1;
  }

  console.log(`\nDone — ${paymentUpdated} payment plans, ${priceUpdated} prices, ${handoverUpdated} handovers.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
