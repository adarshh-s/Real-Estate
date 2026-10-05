import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BedDouble,
  Bath,
  Maximize,
  Home,
  Sofa,
  Car,
  Building2,
  Eye,
  Clock,
  CalendarClock,
  CalendarDays,
  Hash,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Check,
  FileText,
} from 'lucide-react';
import { usePropertyBySlug, useProperties, useAgents, useCommunities } from '../hooks/useSanityContent';
import { useCurrency } from '../context/CurrencyContext';
import { useShortlist } from '../context/ShortlistContext';
import { formatPrice, formatNumber, formatRelativeTime } from '../lib/format';
import { PropertyGalleryMosaic } from '../components/PropertyGalleryMosaic';
import { PageLoading } from '../components/PageLoading';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { ROICalculator } from '../components/ROICalculator';
import { FormattedDescription } from '../components/FormattedDescription';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMap } from '../components/PropertyMap';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { RequestBrochureModal } from '../components/RequestBrochureModal';
import { PropertyTransactionHistory } from '../components/PropertyTransactionHistory';

export function PropertyDetail() {
  const { slug = '' } = useParams();
  const { property, notFound } = usePropertyBySlug(slug);
  const properties = useProperties();
  const agents = useAgents();
  const communities = useCommunities();
  const { currency } = useCurrency();
  const { isShortlisted, toggle } = useShortlist();
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  if (notFound) return <Navigate to="/listings" replace />;
  if (!property) return <PageLoading />;

  const agent = agents.find((a) => a.id === property.agentId || a.slug === property.agentId);
  const community = communities.find((c) => c.name === property.community);
  const mapLocation = property.location ?? community?.location;
  const similar = properties
    .filter((p) => p.id !== property.id && p.community === property.community)
    .slice(0, 3);
  const saved = isShortlisted(property.id);

  const agentListings = agent ? properties.filter((p) => p.agentId === agent.id || p.agentId === agent.slug) : [];
  const agentForSaleCount = agentListings.filter((p) => p.status === 'For Sale').length;
  const agentForRentCount = agentListings.filter((p) => p.status === 'For Rent').length;

  // A rough investor-facing estimate, not a real appraisal — uses the
  // community's known average yield where we have one, otherwise a
  // conservative Dubai-wide assumption.
  const estimatedAnnualRent =
    property.status === 'For Sale' ? Math.round((property.priceAED * (community?.avgRentalYield ?? 6)) / 100) : null;
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in ${property.title} (${property.reference}) listed on S I A Luxe Real Estate.`,
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-28">
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
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="font-display text-3xl text-gold sm:text-4xl">
                {formatPrice(property.priceAED, currency)}
                {property.status === 'For Rent' && (
                  <span className="ml-1 text-sm font-sans text-ink/50">/ {property.rentPeriod}</span>
                )}
              </p>
              <p className="mt-1 text-xs text-ink/40">
                {formatPrice(Math.round(property.priceAED / property.sizeSqft), currency)} / sqft
              </p>
            </div>
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
        <PropertyGalleryMosaic images={property.images} alt={property.title} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-[1fr_360px] lg:px-10">
        <div>
          <h2 className="font-display text-xl text-ink">
            {property.beds} Bedroom {property.type} for {property.status === 'For Rent' ? 'rent' : 'sale'} in{' '}
            {property.subCommunity ?? property.community}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { icon: Home, label: 'Type', value: property.type },
              { icon: Maximize, label: 'Size', value: `${formatNumber(property.sizeSqft)} sqft` },
              { icon: BedDouble, label: 'Bedrooms', value: String(property.beds) },
              { icon: Bath, label: 'Bathrooms', value: String(property.baths) },
              ...(property.parking != null ? [{ icon: Car, label: 'Parking', value: String(property.parking) }] : []),
              ...(property.developer ? [{ icon: Building2, label: 'Developer', value: property.developer }] : []),
              ...(property.view ? [{ icon: Eye, label: 'View', value: property.view }] : []),
              { icon: Sofa, label: 'Furnishing', value: property.furnishing },
              ...(property.availableFrom
                ? [{ icon: CalendarClock, label: 'Available', value: property.availableFrom }]
                : []),
              { icon: Hash, label: 'Reference', value: property.reference },
              { icon: CalendarClock, label: 'Completion', value: property.completion },
              ...(property.yearBuilt
                ? [{ icon: CalendarDays, label: 'Year Built', value: String(property.yearBuilt) }]
                : []),
              ...(property.createdAt
                ? [{ icon: Clock, label: 'Listed', value: formatRelativeTime(property.createdAt) }]
                : []),
            ].map((f) => (
              <div key={f.label} className="min-w-0 rounded-2xl border border-ink/10 p-3.5 sm:p-4">
                <f.icon size={18} className="text-gold" strokeWidth={1.6} />
                <p className="mt-3 text-[11px] uppercase tracking-[0.1em] text-ink/40">{f.label}</p>
                <p className="mt-0.5 truncate font-display text-base text-ink" title={f.value}>{f.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-ink/10 pt-10">
            <h2 className="font-display text-2xl text-ink">About this property</h2>
            <FormattedDescription text={property.description} className="mt-4" />
          </div>

          <div className="mt-10 border-t border-ink/10 pt-10">
            <h2 className="font-display text-2xl text-ink">What It Has</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {property.amenities.map((a) => (
                <div key={a} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-pale text-gold">
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm text-ink/70">{a}</span>
                </div>
              ))}
            </div>
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
                <Button onClick={() => setBrochureModalOpen(true)} variant="outline">
                  <FileText size={14} /> Request Brochure
                </Button>
                <Button href={`tel:${agent.phone}`} variant="outline">
                  <Phone size={14} /> {agent.phone}
                </Button>
                <Button href={`mailto:${agent.email}`} variant="ghost" className="px-0 justify-start">
                  <Mail size={14} /> {agent.email}
                </Button>
              </div>
              {agentListings.length > 0 && (
                <p className="mt-4 text-xs text-ink/40">
                  {agentForSaleCount} for sale · {agentForRentCount} for rent on their books right now
                </p>
              )}
            </div>
          )}
          {estimatedAnnualRent && (
            <div className="rounded-2xl bg-cream-soft p-5 text-sm">
              <span className="text-ink/60">Est. rent: </span>
              <span className="font-display text-ink">{formatPrice(estimatedAnnualRent, currency)}</span>
              <span className="text-ink/60"> a year</span>
            </div>
          )}
          <MortgageCalculator priceAED={property.priceAED} />
          {property.status === 'For Sale' && (
            <ROICalculator
              priceAED={property.priceAED}
              monthlyRentAED={estimatedAnnualRent ? Math.round(estimatedAnnualRent / 12) : undefined}
            />
          )}
        </aside>
      </div>

      <PropertyTransactionHistory property={property} />

      {mapLocation && (
        <div className="mx-auto max-w-7xl border-t border-ink/10 px-6 py-14 lg:px-10">
          <Reveal>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Location</h2>
          </Reveal>
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

      <RequestBrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
        projectName={property.title}
        developer={property.developer}
        community={property.community}
        priceFromAED={property.priceAED}
        propertyReference={property.reference}
        isProperty={true}
        agentName={agent?.name}
        agentEmail={agent?.email}
      />
    </motion.div>
  );
}
