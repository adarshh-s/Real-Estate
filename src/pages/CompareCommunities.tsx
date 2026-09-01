import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { useCommunities } from '../hooks/useSanityContent';
import { Breadcrumb } from '../components/Breadcrumb';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { formatNumber } from '../lib/format';
import type { Community } from '../types';

const selectCls =
  'w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none';

function CommunityHero({ community }: { community: Community }) {
  return (
    <Link
      to={`/communities/${community.slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl"
    >
      <img
        src={community.image}
        alt={community.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="relative z-10 p-5">
        <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-cream/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
          {community.tagline}
        </p>
        <h2 className="flex items-center gap-1.5 font-display text-2xl leading-tight text-cream">
          {community.name}
          <ArrowUpRight
            size={16}
            className="mb-0.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </h2>
      </div>
    </Link>
  );
}

function StatRow({
  label,
  a,
  b,
  format,
  higherIsStronger,
}: {
  label: string;
  a: number;
  b: number;
  format: (n: number) => string;
  higherIsStronger?: boolean;
}) {
  const aWins = higherIsStronger !== undefined && a !== b && (higherIsStronger ? a > b : a < b);
  const bWins = higherIsStronger !== undefined && a !== b && (higherIsStronger ? b > a : b < a);
  return (
    <div className="border-t border-ink/10 py-5">
      <p className="text-center text-[10px] uppercase tracking-[0.16em] text-ink/40">{label}</p>
      <div className="mt-2.5 grid grid-cols-2 divide-x divide-ink/10">
        <div className="pr-4 text-center">
          <p className="font-display text-2xl text-ink">{format(a)}</p>
          {aWins && <p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-ink/45">Stronger</p>}
        </div>
        <div className="pl-4 text-center">
          <p className="font-display text-2xl text-ink">{format(b)}</p>
          {bWins && <p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-ink/45">Stronger</p>}
        </div>
      </div>
    </div>
  );
}

export function CompareCommunities() {
  const communities = useCommunities();
  const [searchParams, setSearchParams] = useSearchParams();

  const a = useMemo(
    () => communities.find((c) => c.slug === searchParams.get('a')) ?? communities[0],
    [communities, searchParams],
  );
  const b = useMemo(
    () => communities.find((c) => c.slug === searchParams.get('b')) ?? communities[1],
    [communities, searchParams],
  );

  useEffect(() => {
    document.title = 'Compare Communities | S I A Luxe Real Estate';
  }, []);

  const setSlug = (side: 'a' | 'b', slug: string) => {
    const other = side === 'a' ? b : a;
    const next = new URLSearchParams(searchParams);
    if (slug === other?.slug) {
      // Swap rather than allow the same community on both sides.
      next.set(side === 'a' ? 'b' : 'a', (side === 'a' ? a : b)?.slug ?? '');
    }
    next.set(side, slug);
    setSearchParams(next, { replace: true });
  };

  const swap = () => {
    const next = new URLSearchParams(searchParams);
    next.set('a', b?.slug ?? '');
    next.set('b', a?.slug ?? '');
    setSearchParams(next, { replace: true });
  };

  if (communities.length < 2 || !a || !b) {
    return (
      <div className="pt-28">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
          <p className="text-sm text-ink/50">Add at least two communities to compare them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 lg:px-10">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Communities', to: '/communities' }, { label: 'Compare' }]}
        />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Compare Communities</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Set two neighbourhoods side by side — price per sqft, estimated rental yield and what each
          address is known for — to see which fits the brief.
        </p>

        <Reveal className="mt-10 grid grid-cols-2 items-center gap-4">
          <select value={a.slug} onChange={(e) => setSlug('a', e.target.value)} className={selectCls}>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={b.slug} onChange={(e) => setSlug('b', e.target.value)} className={selectCls}>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Reveal>

        <div className="relative mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommunityHero community={a} />
          <CommunityHero community={b} />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap communities"
            className="absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-ink text-cream shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 sm:flex"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        <Reveal className="mt-4">
          <StatRow
            label="Avg. Price / Sqft"
            a={a.avgPricePerSqft}
            b={b.avgPricePerSqft}
            format={(n) => `AED ${formatNumber(n)}`}
          />
          {typeof a.avgRentalYield === 'number' && typeof b.avgRentalYield === 'number' && (
            <StatRow
              label="Est. Rental Yield"
              a={a.avgRentalYield}
              b={b.avgRentalYield}
              format={(n) => `${n.toFixed(1)}%`}
              higherIsStronger
            />
          )}
          <StatRow label="Active Listings" a={a.listingsCount} b={b.listingsCount} format={(n) => formatNumber(n)} />
        </Reveal>

        <Reveal className="mt-4 grid grid-cols-1 gap-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
          {[a, b].map((c) => (
            <div key={c.id}>
              <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-ink/40">Popular For</p>
              <div className="flex flex-wrap gap-2">
                {c.popularFor.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-ink/10 px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-ink/60"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {[a, b].map((c) => (
            <p key={c.id} className="text-sm leading-relaxed text-ink/60">
              {c.description}
            </p>
          ))}
        </Reveal>

        <Reveal
          className={clsx(
            'mt-16 flex flex-col items-center gap-5 rounded-2xl border border-ink/10 px-6 py-12 text-center',
          )}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Still Deciding?</p>
          <h3 className="max-w-md font-display text-2xl text-ink sm:text-3xl">
            Speak to an advisor who knows both addresses
          </h3>
          <Button to="/contact">Book a Consultation</Button>
        </Reveal>
      </div>
    </div>
  );
}
