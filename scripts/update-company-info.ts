// One-time script: writes the client's real legal/contact details into the
// Sanity siteSettings singleton (replacing the placeholder values).
//
// Usage: npm run update:company-info

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

const fields = {
  legalCompanyName: 'S I A Luxe Real Estate LLC',
  tradeLicenseNumber: '1645460',
  reraOrn: '63958',
  officeAddress: 'Office No. 2202, The Citadel Tower, Marasi Drive, Business Bay, Dubai, United Arab Emirates',
  contactPhone: '+971 56 874 6746',
  whatsappNumber: '971568746746',
  contactEmail: 'info@sia-luxe.com',
};

async function run() {
  await client
    .patch('siteSettings')
    .setIfMissing({ _type: 'siteSettings' })
    .set(fields)
    .commit({ autoGenerateArrayKeys: true });
  console.log('Done — real company info updated in Sanity siteSettings.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
