import { Link, useParams, Navigate } from 'react-router-dom';
import { BedDouble, Bath, Maximize, LandPlot, Heart, Phone, Mail, MessageCircle, Check } from 'lucide-react';
import { usePropertyBySlug, useProperties, useAgents, useCommunities } from '../hooks/useSanityContent';
import { useCurrency } from '../context/CurrencyContext';
import { useShortlist } from '../context/ShortlistContext';
import { formatPrice, formatNumber } from '../lib/format';
import { Gallery } from '../components/Gallery';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMap } from '../components/PropertyMap';
import { Button } from '../components/Button';

export function PropertyDetail() {
  const { slug = '' } = useParams();
  const property = usePropertyBySlug(slug);
  const properties = useProperties();
  const agents = useAgents();
  const communities = useCommunities();
  const { currency } = useCurrency();
  const { isShortlisted, toggle } = useShortlist();

  if (!property) return <Navigate to="/listings" replace />;

  const agent = agents.find((a) => a.id === property.agentId || a.slug === property.agentId);
  const community = communities.find((c) => c.name === property.community);
  const mapLocation = property.location ?? community?.location;
  const similar = properties
    .filter((p) => p.id !== property.id && p.community === property.community)
    .slice(0, 3);
  const saved = isShortlisted(property.id);
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in ${property.title} (${property.reference}) listed on Sialuxe Real Estate.`,
  );

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Listings', to: '/listings' },
            { label: property.community, to: `/communities` },
            { label: property.title },
          ]}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge tone="dark">{property.status}</Badge>
              {property.tags?.map((t) => (
                <Badge key={t} tone="gold">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{property.title}</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-ink/50">
              {property.subCommunity ? `${property.subCommunity}, ` : ''}
              {property.community}, Dubai
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-display text-3xl text-gold">
              {formatPrice(property.priceAED, currency)}
              {property.status === 'For Rent' && (
                <span className="ml-1 text-sm font-sans text-ink/50">/ {property.rentPeriod}</span>
              )}
            </p>
            <button
              type="button"
              onClick={() => toggle(property.id)}
              aria-label={saved ? 'Remove from shortlist' : 'Add to shortlist'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-gold"
            >
              <Heart size={18} className={saved ? 'fill-gold text-gold' : 'text-ink'} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Gallery images={property.images} alt={property.title} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-[1fr_360px] lg:px-10">
        <div>
          <div className="grid grid-cols-2 gap-6 border-y border-ink/10 py-6 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <BedDouble size={20} className="text-gold" />
              <p className="text-sm text-ink">{property.beds} Bedrooms</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Bath size={20} className="text-gold" />
              <p className="text-sm text-ink">{property.baths} Bathrooms</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Maximize size={20} className="text-gold" />
              <p className="text-sm text-ink">{formatNumber(property.sizeSqft)} sqft</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <LandPlot size={20} className="text-gold" />
              <p className="text-sm text-ink">{property.completion}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl text-ink">Description</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {property.description}
            </p>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl text-ink">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-ink/70">
                  <Check size={14} className="text-gold" /> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 text-sm sm:grid-cols-4">
            <div>
              <p className="text-ink/40">Reference</p>
              <p className="mt-1 text-ink">{property.reference}</p>
            </div>
            <div>
              <p className="text-ink/40">Type</p>
              <p className="mt-1 text-ink">{property.type}</p>
            </div>
            <div>
              <p className="text-ink/40">Furnishing</p>
              <p className="mt-1 text-ink">{property.furnishing}</p>
            </div>
            {property.yearBuilt && (
              <div>
                <p className="text-ink/40">Year Built</p>
                <p className="mt-1 text-ink">{property.yearBuilt}</p>
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          {agent && (
            <div className="rounded-2xl border border-ink/10 p-6">
              <div className="flex items-center gap-4">
                <img src={agent.photo} alt={agent.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-display text-lg text-ink">{agent.name}</p>
                  <p className="text-xs uppercase tracking-[0.1em] text-gold">{agent.title}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button href={`https://wa.me/${agent.whatsapp}?text=${whatsappMessage}`} variant="primary">
                  <MessageCircle size={14} /> WhatsApp Consultant
                </Button>
                <Button href={`tel:${agent.phone}`} variant="outline">
                  <Phone size={14} /> {agent.phone}
                </Button>
                <Button href={`mailto:${agent.email}`} variant="ghost" className="px-0 justify-start">
                  <Mail size={14} /> {agent.email}
                </Button>
              </div>
            </div>
          )}
          <MortgageCalculator priceAED={property.priceAED} />
        </aside>
      </div>

      {mapLocation && (
        <div className="mx-auto max-w-7xl border-t border-ink/10 px-6 py-14 lg:px-10">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Location</h2>
          <div className="mt-8">
            <PropertyMap
              location={mapLocation}
              address={`${property.subCommunity ? `${property.subCommunity}, ` : ''}${property.community}, Dubai`}
            />
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <section className="border-t border-ink/10 bg-cream-soft py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              More in {property.community}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <div className="mt-10">
              <Link
                to={`/listings?community=${encodeURIComponent(property.community)}`}
                className="text-xs uppercase tracking-[0.16em] text-gold underline underline-offset-4"
              >
                View all listings in {property.community}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
