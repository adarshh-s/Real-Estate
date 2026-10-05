import type { Community } from '../types';
import { exteriors } from '../lib/images';

// Only communities where we currently have real property or off-plan project
// inventory, kept in sync with the Sanity dataset via scripts/prune-unavailable-communities.ts.
export const communities: Community[] = [
  {
    id: 'c2',
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    image: exteriors[2],
    tagline: 'Beneath the Burj Khalifa',
    description:
      'The city’s cultural core, with Burj Khalifa, Dubai Mall and the Opera District wrapped around fountain and skyline-facing towers.',
    avgPricePerSqft: 2450,
    avgRentalYield: 5.4,
    listingsCount: 3,
    popularFor: ['Skyline views', 'Sky villas', 'Walk-to-everything living'],
    location: { lat: 25.1972, lng: 55.2744 },
  },
  {
    id: 'c5',
    slug: 'business-bay',
    name: 'Business Bay',
    image: exteriors[5],
    tagline: 'Downtown’s working waterfront',
    description:
      'Canal-front towers and design-led addresses a short walk from Downtown, popular with end-users and yield-focused investors alike.',
    avgPricePerSqft: 1750,
    avgRentalYield: 6.9,
    listingsCount: 6,
    popularFor: ['Dubai Canal views', 'New completions', 'Strong yields'],
    location: { lat: 25.1859, lng: 55.2632 },
  },
  {
    id: 'c7',
    slug: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    image: exteriors[3],
    tagline: 'A city within a park',
    description:
      'Master-planned villas and townhouses around an 18-hole championship course and Dubai Hills Mall, the address of choice for families.',
    avgPricePerSqft: 1600,
    avgRentalYield: 5.7,
    listingsCount: 2,
    popularFor: ['Family villas', 'Golf views', 'Green space'],
    location: { lat: 25.1004, lng: 55.2477 },
  },
  {
    id: 'c8',
    slug: 'jumeirah-golf-estates',
    name: 'Jumeirah Golf Estates',
    image: exteriors[4],
    tagline: 'Home of the DP World Tour Championship',
    description:
      'Fairway-facing villas across two championship courses, favoured by golf enthusiasts and those seeking space without leaving the city.',
    avgPricePerSqft: 1450,
    avgRentalYield: 5.1,
    listingsCount: 1,
    popularFor: ['Fairway villas', 'Tour-standard golf', 'Low density'],
    location: { lat: 25.0398, lng: 55.1699 },
  },
  {
    id: 'c9',
    slug: 'dubai-creek-harbour',
    name: 'Dubai Creek Harbour',
    image: exteriors[2],
    tagline: 'A new skyline rising on the Creek',
    description:
      'Emaar’s waterfront district facing Ras Al Khor, built around a promenade, marina and a skyline set to rival Downtown, offering early positioning for long-term growth.',
    avgPricePerSqft: 2100,
    avgRentalYield: 5.8,
    listingsCount: 3,
    popularFor: ['Creek & skyline views', 'New-build towers', 'Waterfront promenade'],
    location: { lat: 25.199, lng: 55.354 },
  },
  {
    id: 'c13',
    slug: 'la-mer',
    name: 'La Mer',
    image: exteriors[3],
    tagline: 'A beach village in Jumeirah',
    description:
      'A low-rise beachfront lifestyle district blending residences with a curated stretch of cafes, retail and open sand, closer to Downtown than most beach addresses.',
    avgPricePerSqft: 2650,
    avgRentalYield: 5.2,
    listingsCount: 1,
    popularFor: ['Beachfront lifestyle', 'Low-rise living', 'Close to Downtown'],
    location: { lat: 25.2285, lng: 55.268 },
  },
  {
    id: 'c17',
    slug: 'palm-jebel-ali',
    name: 'Palm Jebel Ali',
    image: exteriors[5],
    tagline: 'The next Palm island',
    description:
      'Nakheel’s second palm-shaped island, larger than Palm Jumeirah, featuring early-release waterfront villas for buyers positioning ahead of completion.',
    avgPricePerSqft: 2800,
    avgRentalYield: 4.2,
    listingsCount: 1,
    popularFor: ['Early-release villas', 'Waterfront plots', 'Long-term positioning'],
    location: { lat: 24.9857, lng: 55.0273 },
  },
];
