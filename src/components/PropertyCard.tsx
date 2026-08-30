import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize, Heart } from 'lucide-react';
import type { Property } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useShortlist } from '../context/ShortlistContext';
import { formatPrice, formatNumber } from '../lib/format';
import { Badge } from './Badge';
import clsx from 'clsx';

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const { currency } = useCurrency();
  const { isShortlisted, toggle } = useShortlist();
  const saved = isShortlisted(property.id);

  return (
    <Link
      to={`/property/${property.slug}`}
      className={clsx(
        'group flex flex-col overflow-hidden rounded-xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-ink/10 transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] hover:ring-ink/15',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="dark">{property.status}</Badge>
            {property.tags?.map((t) => (
              <Badge key={t} tone="gold">
                {t}
              </Badge>
            ))}
          </div>
          <button
            type="button"
            aria-label={saved ? 'Remove from shortlist' : 'Add to shortlist'}
            onClick={(e) => {
              e.preventDefault();
              toggle(property.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
          >
            <Heart size={16} className={saved ? 'fill-gold text-gold' : ''} />
          </button>
        </div>
        {property.completion === 'Off-Plan' && (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-cream backdrop-blur-sm">
            Off-Plan
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-ink">{property.title}</h3>
        </div>
        <p className="text-xs uppercase tracking-[0.12em] text-ink/50">
          {property.subCommunity ? `${property.subCommunity}, ` : ''}
          {property.community}
        </p>
        <p className="font-display text-xl text-gold">
          {formatPrice(property.priceAED, currency)}
          {property.status === 'For Rent' && (
            <span className="ml-1 text-xs font-sans text-ink/50">/ {property.rentPeriod}</span>
          )}
        </p>
        <div className="mt-auto flex items-center gap-4 border-t border-ink/[0.06] pt-3 text-xs text-ink/60">
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} /> {property.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={14} /> {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={14} /> {formatNumber(property.sizeSqft)} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
