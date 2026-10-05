import { useEffect, useRef, useState } from 'react';
import { Banknote, BedDouble, ChevronDown, Home, Maximize, Search, SlidersHorizontal, X } from 'lucide-react';
import clsx from 'clsx';
import { useCommunities } from '../hooks/useSanityContent';
import {
  DEFAULT_FILTERS,
  PROPERTY_TYPES,
  COLLECTION_TAGS,
  PRICE_CAPS,
  SIZE_CAPS,
  type FilterState,
} from './Filters';

type Menu = 'type' | 'price' | 'beds' | 'size' | 'more';
type OpenState = { menu: Menu; maxHeight: number } | null;

const pillCls = 'rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors';
const pillActive = 'border-ink bg-ink text-cream';
const pillInactive = 'border-ink/15 text-ink/60 hover:border-ink/40';

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={clsx(pillCls, active ? pillActive : pillInactive)}>
      {children}
    </button>
  );
}

function Panel({
  open,
  maxHeight,
  wide,
  alignRight,
  children,
}: {
  open: boolean;
  maxHeight: number;
  wide?: boolean;
  alignRight?: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      // The sidebar this sits in is `sticky`; once it's stuck, the page can
      // scroll past it without this panel moving at all, so anything taller
      // than the space actually left below the trigger would be permanently
      // unreachable unless the panel scrolls internally instead. maxHeight
      // is measured from the trigger's position each time it opens.
      style={{ maxHeight }}
      className={clsx(
        'absolute top-[calc(100%+10px)] z-30 max-w-[calc(100vw-2.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-ink/10 bg-cream p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.2)]',
        alignRight ? 'right-0' : 'left-0',
        wide ? 'w-[calc(100vw-3rem)] max-w-[19rem]' : 'w-64',
      )}
    >
      {children}
    </div>
  );
}

function QuickFilterCard({
  icon: Icon,
  label,
  value,
  active,
  open,
  maxHeight,
  alignRight,
  onToggle,
  children,
}: {
  icon: typeof Home;
  label: string;
  value: string;
  active: boolean;
  open: boolean;
  maxHeight: number;
  alignRight?: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          'flex w-full flex-col gap-2 rounded-2xl border p-3.5 text-left transition-colors',
          active || open ? 'border-ink bg-ink/[0.03]' : 'border-ink/12 hover:border-ink/25',
        )}
      >
        <div className="flex items-center justify-between">
          <Icon size={15} className={active ? 'text-gold' : 'text-ink/40'} strokeWidth={1.6} />
          <ChevronDown size={12} className={clsx('text-ink/30 transition-transform', open && 'rotate-180')} />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-ink/40">{label}</p>
          <p className={clsx('mt-0.5 truncate text-[13px]', active ? 'text-ink' : 'text-ink/55')}>{value}</p>
        </div>
      </button>
      <Panel open={open} maxHeight={maxHeight} alignRight={alignRight}>
        {children}
      </Panel>
    </div>
  );
}

export function FilterBar({ value, onChange }: { value: FilterState; onChange: (next: FilterState) => void }) {
  const communities = useCommunities();
  const [open, setOpen] = useState<OpenState>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) => onChange({ ...value, [key]: v });

  const toggle = (menu: Menu, e: React.MouseEvent<HTMLButtonElement>) => {
    if (open?.menu === menu) {
      setOpen(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const maxHeight = Math.max(160, window.innerHeight - rect.bottom - 24);
    setOpen({ menu, maxHeight });
  };

  // Type/Price/Beds/Size are single-choice, so picking a value closes the
  // menu immediately — only "More Filters" holds several independent fields
  // and stays open across selections.
  const selectAndClose = <K extends keyof FilterState>(key: K, v: FilterState[K]) => {
    onChange({ ...value, [key]: v });
    setOpen(null);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    // A scroll can change how much room is left below the trigger (or move
    // it entirely once the sidebar un-sticks), so close rather than risk a
    // stale, mismeasured panel.
    const onScroll = () => setOpen(null);
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const moreCount = [value.community !== '', value.completion !== 'All', value.tag !== ''].filter(Boolean).length;
  const hasAnyFilter = JSON.stringify(value) !== JSON.stringify(DEFAULT_FILTERS);

  const priceLabel = PRICE_CAPS.find((p) => p.value === value.maxPriceAED)?.label ?? 'Any Price';
  const sizeLabel = SIZE_CAPS.find((s) => s.value === value.minSizeSqft)?.label ?? 'Any Size';
  const bedsLabel = value.minBeds === 0 ? 'Any' : `${value.minBeds}+ Beds`;
  const typeLabel = value.type || 'Any Type';

  return (
    <div ref={rootRef} className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/40">
          <SlidersHorizontal size={14} /> Filters
        </div>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-gold hover:text-ink"
          >
            <X size={11} /> Reset
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
        <input
          type="text"
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search for properties"
          className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-9 pr-3.5 text-xs text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none"
        />
      </div>

      <div className="flex rounded-xl border border-ink/12 p-1">
        {(['All', 'For Sale', 'For Rent'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => set('status', s)}
            className={clsx(
              'flex-1 rounded-lg py-2 text-[11px] uppercase tracking-[0.1em] transition-colors',
              value.status === s ? 'bg-ink text-cream' : 'text-ink/55 hover:text-ink',
            )}
          >
            {s === 'All' ? 'All' : s.replace('For ', '')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <QuickFilterCard
          icon={Home}
          label="Type"
          value={typeLabel}
          active={value.type !== ''}
          open={open?.menu === 'type'}
          maxHeight={open?.maxHeight ?? 0}
          onToggle={(e) => toggle('type', e)}
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-ink/40">Property Type</p>
          <div className="flex flex-wrap gap-2">
            <Pill active={value.type === ''} onClick={() => selectAndClose('type', '')}>
              Any
            </Pill>
            {PROPERTY_TYPES.map((t) => (
              <Pill key={t} active={value.type === t} onClick={() => selectAndClose('type', t)}>
                {t}
              </Pill>
            ))}
          </div>
        </QuickFilterCard>

        <QuickFilterCard
          icon={Banknote}
          label="Price"
          value={priceLabel}
          active={value.maxPriceAED !== 0}
          open={open?.menu === 'price'}
          maxHeight={open?.maxHeight ?? 0}
          alignRight
          onToggle={(e) => toggle('price', e)}
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-ink/40">Budget</p>
          <div className="flex flex-col gap-2">
            {PRICE_CAPS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => selectAndClose('maxPriceAED', p.value)}
                className={clsx(
                  'rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors',
                  value.maxPriceAED === p.value
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink/70 hover:border-ink/30',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </QuickFilterCard>

        <QuickFilterCard
          icon={BedDouble}
          label="Beds"
          value={bedsLabel}
          active={value.minBeds !== 0}
          open={open?.menu === 'beds'}
          maxHeight={open?.maxHeight ?? 0}
          onToggle={(e) => toggle('beds', e)}
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-ink/40">Minimum Bedrooms</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => selectAndClose('minBeds', n)}
                className={clsx(
                  'h-9 w-9 rounded-full border text-xs transition-colors',
                  value.minBeds === n ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40',
                )}
              >
                {n === 0 ? 'Any' : `${n}+`}
              </button>
            ))}
          </div>
        </QuickFilterCard>

        <QuickFilterCard
          icon={Maximize}
          label="Size"
          value={sizeLabel}
          active={value.minSizeSqft !== 0}
          open={open?.menu === 'size'}
          maxHeight={open?.maxHeight ?? 0}
          alignRight
          onToggle={(e) => toggle('size', e)}
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-ink/40">Minimum Size</p>
          <div className="flex flex-col gap-2">
            {SIZE_CAPS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => selectAndClose('minSizeSqft', s.value)}
                className={clsx(
                  'rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors',
                  value.minSizeSqft === s.value
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink/70 hover:border-ink/30',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </QuickFilterCard>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => toggle('more', e)}
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-dashed px-4 py-3 text-xs uppercase tracking-[0.12em] transition-colors',
            moreCount > 0 || open?.menu === 'more'
              ? 'border-ink text-ink'
              : 'border-ink/20 text-ink/60 hover:border-ink/40',
          )}
        >
          <span className="flex items-center gap-2">
            More Filters
            {moreCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-cream">
                {moreCount}
              </span>
            )}
          </span>
          <ChevronDown size={13} className={clsx('transition-transform', open?.menu === 'more' && 'rotate-180')} />
        </button>
        <Panel open={open?.menu === 'more'} maxHeight={open?.maxHeight ?? 0} wide>
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">Community</p>
              <select
                value={value.community}
                onChange={(e) => set('community', e.target.value)}
                className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
              >
                <option value="">All Communities</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">Completion</p>
              <div className="flex gap-2">
                {(['All', 'Ready', 'Off-Plan'] as const).map((c) => (
                  <Pill key={c} active={value.completion === c} onClick={() => set('completion', c)}>
                    {c}
                  </Pill>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">Collection</p>
              <div className="flex flex-wrap gap-2">
                <Pill active={value.tag === ''} onClick={() => set('tag', '')}>
                  Any
                </Pill>
                {COLLECTION_TAGS.map((t) => (
                  <Pill key={t} active={value.tag === t} onClick={() => set('tag', t)}>
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
