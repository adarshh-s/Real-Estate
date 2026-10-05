import type { Property, Tag } from '../types';
import type { FilterState } from '../components/Filters';

export interface SuggestedProperty {
  property: Property;
  score: number;
  reasons: string[];
}

/**
 * Suggests properties when exact filter criteria return 0 results.
 * Ranks candidate properties based on partial criteria matches (status, community,
 * property type, budget, beds, size, collection tag, and search query).
 */
export function getSuggestedProperties(
  properties: Property[],
  filters: FilterState,
  limit = 6,
): SuggestedProperty[] {
  if (!properties || properties.length === 0) return [];

  // If user filtered by status (For Sale vs For Rent), strongly prioritize same status
  const hasStatusFilter = filters.status !== 'All';
  const sameStatusPool = hasStatusFilter
    ? properties.filter((p) => p.status === filters.status)
    : properties;

  const candidatePool = sameStatusPool.length > 0 ? sameStatusPool : properties;

  const scored: SuggestedProperty[] = candidatePool.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Community match (highest relevance in Dubai real estate)
    if (filters.community) {
      if (p.community.toLowerCase() === filters.community.toLowerCase()) {
        score += 10;
        reasons.push(p.community);
      }
    }

    // 2. Property type match (e.g. Villa, Penthouse, Apartment)
    if (filters.type) {
      if (p.type.toLowerCase() === filters.type.toLowerCase()) {
        score += 8;
        reasons.push(p.type);
      }
    }

    // 3. Bedrooms match or proximity
    if (filters.minBeds > 0) {
      if (p.beds >= filters.minBeds) {
        score += 5;
        reasons.push(`${p.beds}+ Beds`);
      } else if (p.beds === filters.minBeds - 1) {
        score += 3;
        reasons.push(`${p.beds} Beds`);
      }
    }

    // 4. Budget proximity
    if (filters.maxPriceAED > 0) {
      if (p.priceAED <= filters.maxPriceAED) {
        score += 6;
        reasons.push('Within Budget');
      } else if (p.priceAED <= filters.maxPriceAED * 1.25) {
        score += 3;
        reasons.push('Near Budget');
      }
    }

    // 5. Size (sqft) match
    if (filters.minSizeSqft > 0) {
      if (p.sizeSqft >= filters.minSizeSqft) {
        score += 4;
        reasons.push(`${filters.minSizeSqft.toLocaleString()}+ sqft`);
      } else if (p.sizeSqft >= filters.minSizeSqft * 0.8) {
        score += 2;
      }
    }

    // 6. Collection tag match (Waterfront, Sky Villa, etc.)
    if (filters.tag) {
      if (p.tags?.includes(filters.tag as Tag)) {
        score += 5;
        reasons.push(filters.tag);
      }
    }

    // 7. Completion status
    if (filters.completion !== 'All') {
      if (p.completion === filters.completion) {
        score += 3;
        reasons.push(p.completion);
      }
    }

    // 8. Search keyword match
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      const haystack = `${p.title} ${p.community} ${p.subCommunity ?? ''} ${p.type} ${p.tags?.join(' ') ?? ''}`.toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      const matchedWord = words.find((w) => haystack.includes(w));
      if (matchedWord) {
        score += 5;
        reasons.push(`Matches "${matchedWord}"`);
      }
    }

    // Fallback reason if no specific filter was matched
    if (reasons.length === 0) {
      if (hasStatusFilter) {
        reasons.push(p.status);
      } else {
        reasons.push('Featured Residence');
      }
    }

    return { property: p, score, reasons };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
