import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Check, FileText } from 'lucide-react';
import { useProjectBySlug, useCommunities } from '../hooks/useSanityContent';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';
import { Gallery } from '../components/Gallery';
import { PageLoading } from '../components/PageLoading';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ROICalculator } from '../components/ROICalculator';
import { FormattedDescription } from '../components/FormattedDescription';
import { RequestBrochureModal } from '../components/RequestBrochureModal';
import { PropertyMap } from '../components/PropertyMap';
import { Reveal } from '../components/Reveal';

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const { project, notFound } = useProjectBySlug(slug);
  const communities = useCommunities();
  const { currency } = useCurrency();
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  if (notFound) return <Navigate to="/off-plan" replace />;
  if (!project) return <PageLoading />;

  const community = communities.find((c) => c.name === project.community);
  const mapLocation = community?.location ?? { lat: 25.1972, lng: 55.2744 };

  const whatsappMessage = encodeURIComponent(
    `Hello, I'd like more information on ${project.name} by ${project.developer}.`,
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'New Projects', to: '/off-plan' }, { label: project.name }]}
        />
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="gold" className="mb-3">
              {project.status}
            </Badge>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">{project.name}</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-ink/50">
              {project.developer} · {project.community}
            </p>
          </div>
          <p className="font-display text-3xl text-gold">
            {project.priceFromAED != null ? `From ${formatPrice(project.priceFromAED, currency)}` : 'Price on request'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Gallery images={project.images} alt={project.name} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-[1fr_360px] lg:px-10">
        <div>
          <h2 className="font-display text-2xl text-ink">Overview</h2>
          <FormattedDescription text={project.description} className="mt-4" />

          {project.paymentPlan && (
            <>
              <h2 className="mt-10 font-display text-2xl text-ink">Payment Plan</h2>
              <div className="mt-4 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-4">
                {[
                  ['On Booking', project.paymentPlan.onBooking],
                  ['During Construction', project.paymentPlan.duringConstruction],
                  ['On Handover', project.paymentPlan.onHandover],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-ink/10 p-3 text-center sm:p-4">
                    <p className="font-display text-xl text-gold sm:text-2xl">{value}%</p>
                    <p className="mt-1 text-[10px] leading-tight uppercase tracking-[0.06em] text-ink/50 sm:text-[11px] sm:tracking-[0.1em]">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="mt-3 text-xs text-ink/40">Estimated handover: {project.handover}</p>

          <h2 className="mt-10 font-display text-2xl text-ink">Unit Types</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.unitTypes.map((u) => (
              <Badge key={u} tone="light" className="border border-ink/10">
                {u}
              </Badge>
            ))}
          </div>

          <h2 className="mt-10 font-display text-2xl text-ink">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {project.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2 text-sm text-ink/70">
                <Check size={14} className="text-gold" /> {a}
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          {/* Unified Project Action Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/70 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm">
            <p className="text-sm font-sans text-ink/60">Starting price</p>
            <p className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {project.priceFromAED != null ? formatPrice(project.priceFromAED, currency) : 'Price on request'}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                href={`https://wa.me/971505550104?text=${whatsappMessage}`}
                variant="primary"
                className="w-full justify-center py-4"
              >
                <MessageCircle size={15} /> Discover more
              </Button>
              <Button
                onClick={() => setBrochureModalOpen(true)}
                variant="outline"
                className="w-full justify-center py-4 border-ink/20 hover:border-ink hover:bg-ink hover:text-cream"
              >
                <FileText size={15} /> Request the brochure
              </Button>
              {project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  download
                  className="mt-1 text-center text-xs text-ink/50 underline underline-offset-4 hover:text-gold"
                >
                  Download official developer PDF
                </a>
              )}
            </div>

            <div className="mt-6 border-t border-ink/10 pt-5 text-sm text-ink/70">
              Handover {project.handover}
            </div>
          </div>

          <ROICalculator priceAED={project.priceFromAED} />
        </aside>
      </div>

      {mapLocation && (
        <div className="mx-auto max-w-7xl border-t border-ink/10 px-6 py-14 lg:px-10">
          <Reveal>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Location</h2>
          </Reveal>
          <div className="mt-8">
            <PropertyMap
              location={mapLocation}
              address={`${project.community}, Dubai`}
            />
          </div>
        </div>
      )}

      <RequestBrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
        projectName={project.name}
        developer={project.developer}
        community={project.community}
        priceFromAED={project.priceFromAED}
        brochureUrl={project.brochureUrl}
      />
    </motion.div>
  );
}
