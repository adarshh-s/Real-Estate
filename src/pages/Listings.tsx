import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, TrendingUp, Percent, BadgeCheck, PiggyBank, CalendarClock, Sofa } from 'lucide-react';
import { useProperties } from '../hooks/useSanityContent';
import type { Tag } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Filters, DEFAULT_FILTERS, type FilterState } from '../components/Filters';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

const MODE_CONTENT = {
  'For Sale': {
    kicker: 'Own In Dubai',
    heading: 'Properties For Sale',
    description:
      'Freehold ownership across Dubai’s most established and emerging communities — with zero income or capital gains tax, and residency options for qualifying buyers.',
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
      'Furnished and unfurnished leases across Dubai’s most sought-after addresses — flexible terms, move-in ready homes, and a dedicated leasing desk for relocating tenants.',
    stats: [
      { icon: PiggyBank, label: 'Avg. Rental Yield', value: '6–8%' },
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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: (searchParams.get('status') as FilterState['status']) || 'All',
      community: searchParams.get('community') || '',
      type: searchParams.get('type') || '',
      tag: searchParams.get('tag') || '',
    }));
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [searchParams]);

  const mode = filters.status === 'For Sale' || filters.status === 'For Rent' ? MODE_CONTENT[filters.status] : null;

  useEffect(() => {
    document.title = mode ? `${mode.heading} | Sialuxe Real Estate` : 'All Listings | Sialuxe Real Estate';
  }, [mode]);

  const results = useMemo(() => {
    let list = properties.filter((p) => {
      if (filters.status !== 'All' && p.status !== filters.status) return false;
      if (filters.community && p.community !== filters.community) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.minBeds && p.beds < filters.minBeds) return false;
      if (filters.maxPriceAED && p.priceAED > filters.maxPriceAED) return false;
      if (filters.completion !== 'All' && p.completion !== filters.completion) return false;
      if (filters.tag && !p.tags?.includes(filters.tag as Tag)) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceAED - b.priceAED);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceAED - a.priceAED);
    return list;
  }, [properties, filters, sort]);

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: mode ? mode.heading : 'Listings' }]} />
        {mode && (
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-gold">{mode.kicker}</p>
        )}
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{mode ? mode.heading : 'All Listings'}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          {mode ? mode.description : 'Browse the full Sialuxe portfolio across Dubai — for sale and to let.'}
        </p>
        <p className="mt-4 text-sm text-ink/40">{results.length} residences found</p>

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
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Filters value={filters} onChange={setFilters} />
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
            <div className="rounded-3xl border border-dashed border-ink/15 py-24 text-center">
              <p className="font-display text-xl text-ink">No properties match your search</p>
              <p className="mt-2 text-sm text-ink/50">Try adjusting your filters or budget.</p>
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
              Show {results.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
