import { useCommunities } from '../hooks/useSanityContent';
import clsx from 'clsx';

export interface FilterState {
  status: 'All' | 'For Sale' | 'For Rent';
  community: string;
  type: string;
  minBeds: number;
  maxPriceAED: number;
  completion: 'All' | 'Ready' | 'Off-Plan';
  tag: string;
}

export const DEFAULT_FILTERS: FilterState = {
  status: 'All',
  community: '',
  type: '',
  minBeds: 0,
  maxPriceAED: 0,
  completion: 'All',
  tag: '',
};

const PROPERTY_TYPES = ['Apartment', 'Penthouse', 'Villa', 'Townhouse', 'Mansion'];
const COLLECTION_TAGS = ['Waterfront', 'Sky Villa', 'Branded Residence', 'Exclusive', 'New'];
const PRICE_CAPS = [
  { label: 'Any Price', value: 0 },
  { label: 'Up to AED 2M', value: 2_000_000 },
  { label: 'Up to AED 5M', value: 5_000_000 },
  { label: 'Up to AED 15M', value: 15_000_000 },
  { label: 'Up to AED 40M', value: 40_000_000 },
];

function FieldLabel({ children }: { children: string }) {
  return <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">{children}</p>;
}

const selectCls =
  'w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none';

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const communities = useCommunities();
  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <FieldLabel>Status</FieldLabel>
        <div className="flex gap-2">
          {(['All', 'For Sale', 'For Rent'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set('status', s)}
              className={clsx(
                'flex-1 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors',
                value.status === s ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
              )}
            >
              {s === 'All' ? 'All' : s.replace('For ', '')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Community</FieldLabel>
        <select value={value.community} onChange={(e) => set('community', e.target.value)} className={selectCls}>
          <option value="">All Communities</option>
          {communities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Property Type</FieldLabel>
        <select value={value.type} onChange={(e) => set('type', e.target.value)} className={selectCls}>
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Minimum Bedrooms</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set('minBeds', n)}
              className={clsx(
                'h-9 w-9 rounded-full border text-xs transition-colors',
                value.minBeds === n ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
              )}
            >
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Budget</FieldLabel>
        <select
          value={value.maxPriceAED}
          onChange={(e) => set('maxPriceAED', Number(e.target.value))}
          className={selectCls}
        >
          {PRICE_CAPS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Collection</FieldLabel>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => set('tag', '')}
            className={clsx(
              'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors',
              value.tag === '' ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
            )}
          >
            Any
          </button>
          {COLLECTION_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set('tag', t)}
              className={clsx(
                'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors',
                value.tag === t ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Completion</FieldLabel>
        <div className="flex gap-2">
          {(['All', 'Ready', 'Off-Plan'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set('completion', c)}
              className={clsx(
                'flex-1 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors',
                value.completion === c ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="self-start text-xs uppercase tracking-[0.14em] text-gold underline underline-offset-4 hover:text-ink"
      >
        Reset Filters
      </button>
    </div>
  );
}
