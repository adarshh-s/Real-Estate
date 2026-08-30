import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import type { Community } from '../types';
import { formatNumber } from '../lib/format';

export function CommunityCard({
  community,
  index,
  featured = false,
}: {
  community: Community;
  index?: number;
  featured?: boolean;
}) {
  return (
    <Link
      to={`/communities/${community.slug}`}
      className={clsx(
        'group relative flex flex-col justify-end overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.35)]',
        featured ? 'aspect-[16/10] sm:aspect-[21/9]' : 'aspect-[3/4]',
      )}
    >
      <img
        src={community.image}
        alt={community.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

      {typeof index === 'number' && (
        <span className="absolute left-5 top-5 font-display text-xs tabular-nums text-cream/50">
          {String(index).padStart(2, '0')}
        </span>
      )}

      <div className="absolute right-5 top-5 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-cream/15 text-cream opacity-0 backdrop-blur-sm transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight size={16} />
      </div>

      <div className={clsx('relative z-10 p-6', featured && 'sm:max-w-lg sm:p-9')}>
        <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
          {community.tagline}
        </p>
        <h3 className={clsx('font-display leading-tight text-cream', featured ? 'text-3xl sm:text-4xl' : 'text-2xl')}>
          {community.name}
        </h3>

        {featured && (
          <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-cream/70 sm:block">
            {community.description}
          </p>
        )}

        <div
          className={clsx(
            'mt-4 flex items-center gap-4 border-t border-cream/15 pt-3 text-xs text-cream/60',
            !featured &&
              'translate-y-2 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          <span>{formatNumber(community.listingsCount)} listings</span>
          <span className="h-1 w-1 rounded-full bg-cream/30" />
          <span>AED {formatNumber(community.avgPricePerSqft)}/sqft</span>
        </div>
      </div>
    </Link>
  );
}
