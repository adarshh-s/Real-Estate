import { createClient } from '@sanity/client';
import { articles } from '../src/data/articles.js';
import { communities } from '../src/data/communities.js';

try {
  process.loadEnvFile();
} catch {
  // no .env file yet
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

function cleanString(text: string): string {
  if (!text || !text.includes('—')) return text;
  return text
    .replace(/,\s*—\s*/g, ', ')
    .replace(/\.\s*—\s*/g, '. ')
    .replace(/\s+—\s+/g, ', ')
    .replace(/—/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function run() {
  console.log('Fetching all published documents from Sanity...');
  const docs: any[] = await client.fetch('*[!(_id in path("_.**"))]');
  console.log(`Fetched ${docs.length} documents.`);

  const docsToUpdate: any[] = [];

  for (const doc of docs) {
    const raw = JSON.stringify(doc);
    if (!raw.includes('—')) continue;

    const patchOps: Record<string, any> = {};

    if (doc._type === 'siteSettings') {
      if (doc.interstitialBody && doc.interstitialBody.includes('—')) {
        patchOps.interstitialBody =
          'We look beyond the property to location, developer, entry price, payment structure and long-term potential, before we bring an opportunity forward.';
      }
      if (doc.heroSubtitle && doc.heroSubtitle.includes('—')) {
        patchOps.heroSubtitle = cleanString(doc.heroSubtitle);
      }
    } else if (doc._type === 'article') {
      const match = articles.find((a) => a.slug === doc.slug?.current || a.title === doc.title);
      if (match) {
        if (doc.body && doc.body.includes('—')) {
          patchOps.body = match.body;
        }
        if (doc.excerpt && doc.excerpt.includes('—')) {
          patchOps.excerpt = match.excerpt;
        }
      } else {
        if (doc.body && doc.body.includes('—')) patchOps.body = cleanString(doc.body);
        if (doc.excerpt && doc.excerpt.includes('—')) patchOps.excerpt = cleanString(doc.excerpt);
      }
    } else if (doc._type === 'community') {
      const match = communities.find((c) => c.slug === doc.slug?.current || c.name === doc.name);
      if (match) {
        if (doc.description && doc.description.includes('—')) {
          patchOps.description = match.description;
        }
      } else {
        if (doc.description && doc.description.includes('—')) {
          patchOps.description = cleanString(doc.description);
        }
      }
    } else {
      // General handler (projects, properties, etc.)
      for (const [key, val] of Object.entries(doc)) {
        if (typeof val === 'string' && val.includes('—')) {
          patchOps[key] = cleanString(val);
        }
      }
    }

    if (Object.keys(patchOps).length > 0) {
      docsToUpdate.push({ id: doc._id, type: doc._type, name: doc.name || doc.title || doc._id, patchOps });
    }
  }

  console.log(`Found ${docsToUpdate.length} documents needing updates.`);

  for (const item of docsToUpdate) {
    await client.patch(item.id).set(item.patchOps).commit();
    console.log(`Updated [${item.type}] ${item.name} (${Object.keys(item.patchOps).join(', ')})`);
  }

  console.log('Successfully removed all em dashes from Sanity CMS!');
}

run().catch((err) => {
  console.error('Error running script:', err);
  process.exit(1);
});
