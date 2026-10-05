import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';

export interface ActivityItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  image: string;
  priceAED?: number;
  label: string;
}

export function VerticalTicker({ items }: { items: ActivityItem[] }) {
  const { currency } = useCurrency();
  const track = [...items, ...items];

  return (
    <div className="group relative h-[440px] overflow-hidden rounded-3xl border border-ink/10 bg-cream-soft">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-cream-soft to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-cream-soft to-transparent" />
      <div className="flex animate-marquee-vertical flex-col group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            to={item.href}
            className="flex shrink-0 items-center gap-4 border-b border-ink/8 px-6 py-4 transition-colors hover:bg-cream"
          >
            <img src={item.image} alt={item.title} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{item.title}</p>
              <p className="truncate text-xs text-ink/50">{item.subtitle}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-xs text-ink">
                {item.priceAED != null ? formatPrice(item.priceAED, currency) : 'Price on request'}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-gold">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
