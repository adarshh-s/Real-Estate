import { Link } from 'react-router-dom';
import type { Community } from '../types';
import { formatNumber } from '../lib/format';

export function CommunityCard({ community }: { community: Community }) {
  return (
    <Link
      to={`/communities/${community.slug}`}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(14,20,32,0.1)] transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-12px_rgba(14,20,32,0.4)]"
    >
      <img
        src={community.image}
        alt={community.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="relative z-10 p-6 text-cream">
        <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
          {formatNumber(community.listingsCount)} listings
        </p>
        <h3 className="font-display text-2xl leading-tight">{community.name}</h3>
        <p className="mt-1 text-sm text-cream/70">{community.tagline}</p>
      </div>
    </Link>
  );
}
