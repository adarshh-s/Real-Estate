import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, TrendingUp, Percent, BadgeCheck, PiggyBank, CalendarClock, Sofa, Sparkles, RotateCcw } from 'lucide-react';
import { useProperties } from '../hooks/useSanityContent';
import type { Tag } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Filters, DEFAULT_FILTERS, type FilterState } from '../components/Filters';
import { FilterBar } from '../components/FilterBar';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';
import { getSuggestedProperties } from '../lib/recommendations';

const MODE_CONTENT = {
  'For Sale': {
    kicker: 'Own In Dubai',
    heading: 'Properties For Sale',
    description:
      'Freehold ownership across Dubai’s most established and emerging communities, with zero income or capital gains tax, and residency options for qualifying buyers.',
    stats: [
      { icon: TrendingUp, label: 'Avg. Price Growth', value: '+8.2% YoY' },
      { icon: Percent, label: 'Property & Income Tax', value: '0%' },
      { icon: BadgeCheck, label: 'Golden Visa From', value: 'AED 2M' },
    ],
    cta: {
      kicker: 'Thinking Of Selling Instead?',
      title: 'Get a complimentary, data-backed valuation',
      to: '/sell',
      label: 'Request a Valuation',
    },
  },
  'For Rent': {
    kicker: 'Move In Dubai',
    heading: 'Properties For Rent',
    description:
      'Furnished and unfurnished leases across Dubai’s most sought-after addresses, flexible terms, move-in ready homes, and a dedicated leasing desk for relocating tenants.',
    stats: [
      { icon: PiggyBank, label: 'Avg. Rental Yield', value: '6% to 8%' },
      { icon: CalendarClock, label: 'Lease Terms', value: 'Flexible' },
      { icon: Sofa, label: 'Move-In Ready', value: 'Furnished Options' },
    ],
    cta: {
      kicker: 'Own a Property to Let?',
      title: 'List it with our private leasing desk',
      to: '/contact',
      label: 'Speak to Leasing',
    },
  },
} as const;

export function Listings() {
  const properties = useProperties();
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    status: (searchParams.get('status') as FilterState['status']) || 'All',
    community: searchParams.get('community') || '',
    type: searchParams.get('type') || '',
    tag: searchParams.get('tag') || '',
  }));

  const isFirstRender = useRef(true);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: (searchParams.get('status') as FilterState['status']) || 'All',
      community: searchParams.get('community') || '',
      type: searchParams.get('type') || '',
      tag: searchParams.get('tag') || '',
    }));
    // Skip on the very first render so a restored scroll position (e.g. from
    // the browser's back button) isn't immediately overridden — only jump to
    // top when the filters actually change while already on this page.
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [searchParams]);

  const mode = filters.status === 'For Sale' || filters.status === 'For Rent' ? MODE_CONTENT[filters.status] : null;

  useEffect(() => {
    document.title = mode ? `${mode.heading} | S I A Luxe Real Estate` : 'All Listings | S I A Luxe Real Estate';
  }, [mode]);

  const results = useMemo(() => {
    let list = properties.filter((p) => {
      if (filters.status !== 'All' && p.status !== filters.status) return false;
      if (filters.community && p.community !== filters.community) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.minBeds && p.beds < filters.minBeds) return false;
      if (filters.maxPriceAED && p.priceAED > filters.maxPriceAED) return false;
      if (filters.minSizeSqft && p.sizeSqft < filters.minSizeSqft) return false;
      if (filters.completion !== 'All' && p.completion !== filters.completion) return false;
      if (filters.tag && !p.tags?.includes(filters.tag as Tag)) return false;
      if (filters.search) {
        const q = filters.search.trim().toLowerCase();
        const haystack = `${p.title} ${p.community} ${p.subCommunity ?? ''} ${p.reference}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceAED - b.priceAED);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceAED - a.priceAED);
    return list;
  }, [properties, filters, sort]);

  const suggestedResults = useMemo(() => {
    if (results.length > 0) return [];
    return getSuggestedProperties(properties, filters);
  }, [results.length, properties, filters]);

  const activeFilterList = useMemo(() => {
    const list: { key: keyof FilterState; label: string; reset: () => void }[] = [];
    if (filters.status !== 'All' && !mode) {
      list.push({ key: 'status', label: `Status: ${filters.status}`, reset: () => setFilters((p) => ({ ...p, status: 'All' })) });
    }
    if (filters.community) {
      list.push({ key: 'community', label: filters.community, reset: () => setFilters((p) => ({ ...p, community: '' })) });
    }
    if (filters.type) {
      list.push({ key: 'type', label: filters.type, reset: () => setFilters((p) => ({ ...p, type: '' })) });
    }
    if (filters.minBeds > 0) {
      list.push({ key: 'minBeds', label: `${filters.minBeds}+ Beds`, reset: () => setFilters((p) => ({ ...p, minBeds: 0 })) });
    }
    if (filters.maxPriceAED > 0) {
      const millions = filters.maxPriceAED / 1_000_000;
      list.push({
        key: 'maxPriceAED',
        label: `Under AED ${millions >= 1 ? `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M` : filters.maxPriceAED.toLocaleString()}`,
        reset: () => setFilters((p) => ({ ...p, maxPriceAED: 0 })),
      });
    }
    if (filters.minSizeSqft > 0) {
      list.push({ key: 'minSizeSqft', label: `${filters.minSizeSqft.toLocaleString()}+ sqft`, reset: () => setFilters((p) => ({ ...p, minSizeSqft: 0 })) });
    }
    if (filters.completion !== 'All') {
      list.push({ key: 'completion', label: filters.completion, reset: () => setFilters((p) => ({ ...p, completion: 'All' })) });
    }
    if (filters.tag) {
      list.push({ key: 'tag', label: filters.tag, reset: () => setFilters((p) => ({ ...p, tag: '' })) });
    }
    if (filters.search) {
      list.push({ key: 'search', label: `"${filters.search}"`, reset: () => setFilters((p) => ({ ...p, search: '' })) });
    }
    return list;
  }, [filters, mode]);

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: mode ? mode.heading : 'Listings' }]} />
        {mode && (
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-gold">{mode.kicker}</p>
        )}
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{mode ? mode.heading : 'All Listings'}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          {mode ? mode.description : 'Browse the full S I A Luxe portfolio across Dubai, for sale and to let.'}
        </p>
        <p className="mt-4 text-sm text-ink/40">
          {results.length > 0
            ? `${results.length} residences found`
            : `0 exact matches · Showing ${suggestedResults.length} suggested residences`}
        </p>

        {mode && (
          <div className="mt-8 grid grid-cols-1 gap-4 border-y border-ink/10 py-6 sm:grid-cols-3">
            {mode.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon size={20} className="shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-lg text-ink">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[260px_1fr] lg:px-10">
        <aside className="relative z-20 hidden lg:block">
          <div className="sticky top-28">
            <FilterBar value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs uppercase tracking-[0.14em] lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs uppercase tracking-[0.12em] text-ink/40">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="border-0 border-b border-ink/20 bg-transparent py-1 text-xs uppercase tracking-[0.12em] text-ink focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="rounded-3xl border border-dashed border-ink/20 bg-surface/60 p-8 sm:p-12 text-center backdrop-blur-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Sparkles size={24} />
                </div>
                <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">No Exact Matches Found</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                  We couldn't find residences matching all your filters combined. Below are the closest residences matching key aspects of your search.
                </p>

                {activeFilterList.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-ink/50 mr-1">Active filters:</span>
                    {activeFilterList.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={item.reset}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-cream px-3 py-1 text-xs text-ink transition-colors hover:border-gold hover:text-gold"
                        title={`Remove ${item.label}`}
                      >
                        <span>{item.label}</span>
                        <X size={12} className="text-ink/50 hover:text-ink" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFilters(mode ? { ...DEFAULT_FILTERS, status: filters.status } : DEFAULT_FILTERS)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-medium text-cream transition-colors hover:bg-gold hover:text-ink"
                  >
                    <RotateCcw size={13} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>

              {suggestedResults.length > 0 && (
                <div>
                  <div className="mb-6 flex flex-col gap-1 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] font-medium text-gold">Recommended For You</p>
                      <h3 className="mt-1 font-display text-2xl text-ink">Suggested Similar Residences</h3>
                      <p className="mt-1 text-xs text-ink/50">
                        Properties matching some of your selected preferences (location, property type, or budget).
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-ink/40">
                      {suggestedResults.length} suggested {suggestedResults.length === 1 ? 'residence' : 'residences'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                    {suggestedResults.map(({ property, reasons }) => (
                      <div key={property.id} className="flex flex-col">
                        {reasons.length > 0 && (
                          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.12em] font-medium text-ink/40">Matches:</span>
                            {reasons.map((reason) => (
                              <span
                                key={reason}
                                className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] font-medium text-ink"
                              >
                                <span className="h-1 w-1 rounded-full bg-gold" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mode && (
        <section className="border-t border-ink/10 bg-cream-soft py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">{mode.cta.kicker}</p>
              <p className="mt-2 font-display text-2xl text-ink">{mode.cta.title}</p>
            </div>
            <Button to={mode.cta.to} variant="primary">
              {mode.cta.label}
            </Button>
          </div>
        </section>
      )}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-xl">Filters</p>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <Filters value={filters} onChange={setFilters} />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 rounded-full bg-ink py-3 text-xs uppercase tracking-[0.16em] text-cream"
            >
              {results.length > 0 ? `Show ${results.length} Results` : `Show ${suggestedResults.length} Suggestions`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
