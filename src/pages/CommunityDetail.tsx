import { Link, Navigate, useParams } from 'react-router-dom';
import { useCommunities, useProperties } from '../hooks/useSanityContent';
import { PropertyCard } from '../components/PropertyCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { formatNumber } from '../lib/format';

export function CommunityDetail() {
  const { slug = '' } = useParams();
  const communities = useCommunities();
  const properties = useProperties();
  const community = communities.find((c) => c.slug === slug);

  if (!community) return <Navigate to="/communities" replace />;

  const listings = properties.filter((p) => p.community === community.name);

  return (
    <div className="pt-16">
      <section className="relative flex h-[60vh] items-end overflow-hidden">
        <img src={community.image} alt={community.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 lg:px-10">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Communities', to: '/communities' },
              { label: community.name },
            ]}
          />
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">{community.name}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.12em] text-gold-soft">{community.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl text-ink">About {community.name}</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {community.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {community.popularFor.map((p) => (
                <span key={p} className="rounded-full border border-ink/10 px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-ink/60">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-start rounded-2xl border border-ink/10 p-6">
            <div>
              <p className="font-display text-2xl text-gold">AED {formatNumber(community.avgPricePerSqft)}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink/50">Avg. Price / Sqft</p>
            </div>
            <div>
              <p className="font-display text-2xl text-gold">{community.listingsCount}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink/50">Active Listings</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Available in {community.name}</h2>
            <Link
              to={`/listings?community=${encodeURIComponent(community.name)}`}
              className="hidden text-xs uppercase tracking-[0.14em] text-gold underline underline-offset-4 sm:block"
            >
              View All
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink/50">
              No current listings — contact us for off-market opportunities in {community.name}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
