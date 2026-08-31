import type { Project } from '../types';
import { gallery } from '../lib/images';
import { communities } from './communities';

const communityImage = Object.fromEntries(communities.map((c) => [c.name, c.image]));
const coverFor = (community: string) => communityImage[community];

export const projects: Project[] = [
  {
    id: 'pr1',
    slug: 'the-orchid-palm-jumeirah',
    name: 'The Orchid',
    developer: 'Nakheel',
    community: 'Palm Jumeirah',
    status: 'Under Construction',
    priceFromAED: 18500000,
    paymentPlan: { onBooking: 20, duringConstruction: 50, onHandover: 30 },
    handover: 'Q2 2028',
    images: gallery(21, 4, coverFor('Palm Jumeirah')),
    description:
      'A collection of 24 beachfront mansions on a new Palm frond extension, each with private beach frontage and a rooftop infinity pool.',
    unitTypes: ['6-Bed Mansion', '7-Bed Mansion'],
    amenities: ['Private beach', 'Rooftop pools', 'Marina berths', 'Concierge'],
  },
  {
    id: 'pr2',
    slug: 'sia-luxe-tower-downtown',
    name: 'S I A Luxe Tower',
    developer: 'Emaar',
    community: 'Downtown Dubai',
    status: 'Presale',
    priceFromAED: 3200000,
    paymentPlan: { onBooking: 10, duringConstruction: 70, onHandover: 20 },
    handover: 'Q4 2027',
    images: gallery(22, 4, coverFor('Downtown Dubai')),
    description:
      'A slender 68-storey tower rising beside the Burj Khalifa, with sky lounges at every tenth floor and direct Dubai Mall connectivity.',
    unitTypes: ['1-Bed', '2-Bed', '3-Bed Sky Villa'],
    amenities: ['Sky lounges', 'Infinity pool level 40', 'Direct mall link', 'Padel court'],
  },
  {
    id: 'pr3',
    slug: 'canal-heights-two-business-bay',
    name: 'Canal Heights II',
    developer: 'DAMAC',
    community: 'Business Bay',
    status: 'Under Construction',
    priceFromAED: 1650000,
    paymentPlan: { onBooking: 20, duringConstruction: 55, onHandover: 25 },
    handover: 'Q1 2027',
    images: gallery(23, 4, coverFor('Business Bay')),
    description:
      'The second phase of the Canal Heights waterfront collection, offering studios to three-bedroom residences directly on the Dubai Canal.',
    unitTypes: ['Studio', '1-Bed', '2-Bed', '3-Bed'],
    amenities: ['Canal-front pool deck', 'Co-working lounge', 'Cinema room', 'Retail promenade'],
  },
  {
    id: 'pr4',
    slug: 'hillside-reserve-dubai-hills',
    name: 'Hillside Reserve',
    developer: 'Emaar',
    community: 'Dubai Hills Estate',
    status: 'Launching Soon',
    priceFromAED: 6400000,
    paymentPlan: { onBooking: 20, duringConstruction: 50, onHandover: 30 },
    handover: 'Q3 2028',
    images: gallery(24, 4, coverFor('Dubai Hills Estate')),
    description:
      'An exclusive enclave of 45 villas backing onto the championship golf course, launching to S I A Luxe private clients ahead of public release.',
    unitTypes: ['5-Bed Villa', '6-Bed Villa'],
    amenities: ['Golf course backdrop', 'Private pools', 'Clubhouse access', '24h security'],
  },
  {
    id: 'pr5',
    slug: 'marina-crown-residences',
    name: 'Marina Crown Residences',
    developer: 'Select Group',
    community: 'Dubai Marina',
    status: 'Under Construction',
    priceFromAED: 2100000,
    paymentPlan: { onBooking: 15, duringConstruction: 60, onHandover: 25 },
    handover: 'Q2 2027',
    images: gallery(25, 4, coverFor('Dubai Marina')),
    description:
      'A slender marina-facing tower with a crown-level sky pool and interiors curated by an international design house.',
    unitTypes: ['1-Bed', '2-Bed', '3-Bed'],
    amenities: ['Sky pool', 'Marina views', 'Wellness spa', 'Valet parking'],
  },
  {
    id: 'pr6',
    slug: 'bay-island-villas-jumeirah',
    name: 'Bay Island Villas',
    developer: 'Meraas',
    community: 'Jumeirah Bay Island',
    status: 'Presale',
    priceFromAED: 55000000,
    paymentPlan: { onBooking: 30, duringConstruction: 40, onHandover: 30 },
    handover: 'Q4 2028',
    images: gallery(26, 4, coverFor('Jumeirah Bay Island')),
    description:
      'The final land release on Jumeirah Bay Island — twelve waterfront villa plots with bespoke architectural design services included.',
    unitTypes: ['Custom Villa Plot'],
    amenities: ['Private plot design', 'Marina berth per villa', 'Beach club membership'],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
