import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';

const ACTIVITY_LABELS = ['Just Listed', 'Price Updated', 'Under Offer', 'New Match'];

export function VerticalTicker({ properties }: { properties: Property[] }) {
  const { currency } = useCurrency();
  const track = [...properties, ...properties];

  return (
    <div className="group relative h-[440px] overflow-hidden rounded-3xl border border-ink/10 bg-cream-soft">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-cream-soft to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-cream-soft to-transparent" />
      <div className="flex animate-marquee-vertical flex-col group-hover:[animation-play-state:paused]">
        {track.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            to={`/property/${p.slug}`}
            className="flex shrink-0 items-center gap-4 border-b border-ink/8 px-6 py-4 transition-colors hover:bg-cream"
          >
            <img src={p.images[0]} alt={p.title} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{p.title}</p>
              <p className="truncate text-xs text-ink/50">{p.community}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-xs text-ink">{formatPrice(p.priceAED, currency)}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-gold">
                {ACTIVITY_LABELS[i % ACTIVITY_LABELS.length]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
