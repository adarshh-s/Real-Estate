import fs from 'node:fs';
import path from 'node:path';

interface ProjectRaw {
  _id: string;
  name: string;
  slug: string;
  developer: string;
  community: string;
  priceFromAED: number | null;
  handover: string | null;
  unitTypes: string[] | null;
  amenities: string[] | null;
  paymentPlan: {
    onBooking?: number;
    duringConstruction?: number;
    onHandover?: number;
  } | null;
  description: string;
}

function cleanText(t: string): string {
  if (!t) return '';
  return t
    .replace(/—/g, ', ')
    .replace(/–/g, ' to ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatAED(n: number | null): string | null {
  if (!n) return null;
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `AED ${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  return `AED ${(n / 1000).toFixed(0)}K`;
}

export function structureProjectDescription(p: ProjectRaw): string {
  const desc = cleanText(p.description);

  // Extract payment numbers from text if not in paymentPlan
  let onBooking = p.paymentPlan?.onBooking;
  let duringConstruction = p.paymentPlan?.duringConstruction;
  let onHandover = p.paymentPlan?.onHandover;

  if (!onBooking) {
    const m = desc.match(/(\d+)%\s+on\s+booking/i);
    if (m) onBooking = parseInt(m[1], 10);
  }
  if (!duringConstruction) {
    const m = desc.match(/(\d+)%\s+during\s+construction/i) || desc.match(/(\d+)%\s+across\s+construction/i);
    if (m) duringConstruction = parseInt(m[1], 10);
  }
  if (!onHandover) {
    const m = desc.match(/(\d+)%\s+at\s+handover/i) || desc.match(/(\d+)%\s+on\s+handover/i);
    if (m) onHandover = parseInt(m[1], 10);
  }

  // Safe sentence split: avoid splitting on abbreviations
  const sentences = desc
    .replace(/(sq\.\s*ft\.)/gi, 'sq ft')
    .replace(/(approx\.)/gi, 'approx')
    .replace(/(e\.g\.)/gi, 'eg')
    .replace(/(i\.e\.)/gi, 'ie')
    .replace(/(no\.)/gi, 'no')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const overviewSentences: string[] = [];
  const residenceSentences: string[] = [];
  const paymentSentences: string[] = [];
  const locationSentences: string[] = [];
  const investmentSentences: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const lower = s.toLowerCase();

    if (i === 0) {
      overviewSentences.push(s);
      continue;
    }

    if (
      lower.includes('payment plan') ||
      lower.includes('booking') ||
      lower.includes('during construction') ||
      lower.includes('on handover') ||
      lower.includes('post-handover') ||
      lower.includes('instalment') ||
      lower.includes('instalments') ||
      lower.includes('down payment')
    ) {
      paymentSentences.push(s);
    } else if (
      lower.includes('located in') ||
      lower.includes('situated in') ||
      lower.includes('strategically located') ||
      lower.includes('border') ||
      lower.includes('road') ||
      lower.includes('highway') ||
      lower.includes('airport') ||
      lower.includes('neighbour') ||
      lower.includes('district') ||
      lower.includes('connectivity') ||
      lower.includes('access to') ||
      lower.includes('commute')
    ) {
      locationSentences.push(s);
    } else if (
      lower.includes('investor') ||
      lower.includes('yield') ||
      lower.includes('appreciation') ||
      lower.includes('trade-off') ||
      lower.includes('starting from') ||
      lower.includes('weighing') ||
      lower.includes('rental demand') ||
      lower.includes('capital required') ||
      lower.includes('liquidity')
    ) {
      investmentSentences.push(s);
    } else {
      residenceSentences.push(s);
    }
  }

  // Ensure balance across sections
  if (overviewSentences.length === 1 && residenceSentences.length > 3) {
    overviewSentences.push(residenceSentences.shift()!);
  }

  // 1. Key Highlights
  const highlights: string[] = [];
  highlights.push(`Developed by ${p.developer} in ${p.community}`);
  if (p.unitTypes && p.unitTypes.length > 0) {
    highlights.push(`Curated collection of ${p.unitTypes.join(', ')}`);
  }
  if (p.priceFromAED) {
    highlights.push(`Starting from approximately ${formatAED(p.priceFromAED)}`);
  }
  if (p.handover) {
    highlights.push(`Handover targeted for ${p.handover}`);
  }
  if (p.amenities && p.amenities.length > 0) {
    highlights.push(`Signature amenities including ${p.amenities.slice(0, 3).join(', ')}`);
  }

  // 2. Payment Plan bullets
  const paymentBullets: string[] = [];
  if (onBooking) paymentBullets.push(`${onBooking}% on initial booking`);
  if (duringConstruction) paymentBullets.push(`${duringConstruction}% payable during construction`);
  if (onHandover) paymentBullets.push(`${onHandover}% due upon handover`);

  const postMatch =
    desc.match(/(\d+)%\s+structured\s+as\s+a\s+genuinely\s+extended\s+post-handover/i) ||
    desc.match(/post-handover\s+payment\s+plan\s+spread\s+out\s+to\s+(\d+)/i) ||
    desc.match(/(\d+)%\s+post-handover/i);
  if (postMatch) {
    paymentBullets.push(`Extended post-handover payment plan available`);
  }

  // Assemble markdown blocks
  const blocks: string[] = [];

  // Lead Overview
  blocks.push(overviewSentences.join(' '));

  // Key Highlights Section
  blocks.push('### Key Highlights');
  blocks.push(highlights.map((h) => `• ${h}`).join('\n'));

  // Architecture & Residences Section
  blocks.push('### Architecture & Signature Residences');
  const resPara =
    residenceSentences.join(' ') ||
    `Featuring contemporary architecture, generous floorplans, expansive private balconies, and premium interior specifications designed for elegant modern living.`;
  blocks.push(resPara);

  if (p.amenities && p.amenities.length > 2) {
    blocks.push(p.amenities.slice(0, 6).map((a) => `• ${a}`).join('\n'));
  }

  // Payment Plan & Investment Section
  blocks.push('### Payment Structure & Investment Profile');
  if (paymentBullets.length > 0) {
    blocks.push(paymentBullets.map((b) => `• ${b}`).join('\n'));
  }
  const payPara =
    (paymentSentences.join(' ') + ' ' + investmentSentences.join(' ')).trim() ||
    `Structured with competitive entry pricing, flexible milestone terms, and strong long-term capital appreciation and rental yield prospects in Dubai expanding prime corridors.`;
  blocks.push(payPara);

  // Location & Connectivity Section
  if (locationSentences.length > 0) {
    blocks.push('### Location & Strategic Connectivity');
    blocks.push(locationSentences.join(' '));
  }

  return blocks.join('\n\n');
}

// Read raw data and test generate
const rawPath = path.resolve('scripts/data/all-sanity-projects-raw.json');
const projects: ProjectRaw[] = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

const structuredMap: Record<string, string> = {};
for (const p of projects) {
  structuredMap[p.slug] = structureProjectDescription(p);
}

const outputPath = path.resolve('scripts/data/offplan-descriptions-structured.json');
fs.writeFileSync(outputPath, JSON.stringify(structuredMap, null, 2));
console.log(`Generated structured descriptions for ${Object.keys(structuredMap).length} projects.`);
