import type { Community } from '../types';
import { exteriors } from '../lib/images';

export const communities: Community[] = [
  {
    id: 'c1',
    slug: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    image: exteriors[1],
    tagline: 'The island that reshaped the coastline',
    description:
      'Signature beachfront villas and branded residences along the fronds of Dubai’s most photographed address, minutes from Atlantis and the Palm promenade.',
    avgPricePerSqft: 3100,
    listingsCount: 128,
    popularFor: ['Beachfront villas', 'Branded residences', 'Private beach access'],
  },
  {
    id: 'c2',
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    image: exteriors[2],
    tagline: 'Beneath the Burj Khalifa',
    description:
      'The city’s cultural core — Burj Khalifa, Dubai Mall and the Opera District wrapped around fountain and skyline-facing towers.',
    avgPricePerSqft: 2450,
    listingsCount: 214,
    popularFor: ['Skyline views', 'Sky villas', 'Walk-to-everything living'],
  },
  {
    id: 'c3',
    slug: 'dubai-marina',
    name: 'Dubai Marina',
    image: exteriors[0],
    tagline: 'A promenade of glass and water',
    description:
      'A two-kilometre marina lined with waterfront towers, yacht berths and one of the city’s longest running social scenes.',
    avgPricePerSqft: 1950,
    listingsCount: 261,
    popularFor: ['Waterfront living', 'Yacht access', 'Rental yield'],
  },
  {
    id: 'c4',
    slug: 'emirates-hills',
    name: 'Emirates Hills',
    image: exteriors[4],
    tagline: 'Dubai’s Beverly Hills',
    description:
      'Gated mansions set around the Montgomerie golf course — the most understated address for the city’s most private buyers.',
    avgPricePerSqft: 2200,
    listingsCount: 34,
    popularFor: ['Golf-course mansions', 'Ultra-privacy', 'Large plots'],
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
    listingsCount: 189,
    popularFor: ['Dubai Canal views', 'New completions', 'Strong yields'],
  },
  {
    id: 'c6',
    slug: 'jumeirah-bay-island',
    name: 'Jumeirah Bay Island',
    image: exteriors[6],
    tagline: 'The seahorse-shaped enclave',
    description:
      'Ultra-prime beachfront mansions on a private island beside the Bulgari Resort — among the highest price-per-sqft addresses in the region.',
    avgPricePerSqft: 4600,
    listingsCount: 19,
    popularFor: ['Private island mansions', 'Ultra-prime', 'Bulgari Resort access'],
  },
  {
    id: 'c7',
    slug: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    image: exteriors[3],
    tagline: 'A city within a park',
    description:
      'Master-planned villas and townhouses around an 18-hole championship course and Dubai Hills Mall — the address of choice for families.',
    avgPricePerSqft: 1600,
    listingsCount: 176,
    popularFor: ['Family villas', 'Golf views', 'Green space'],
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
    listingsCount: 61,
    popularFor: ['Fairway villas', 'Tour-standard golf', 'Low density'],
  },
];
