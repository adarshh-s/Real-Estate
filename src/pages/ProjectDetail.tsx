import { Navigate, useParams } from 'react-router-dom';
import { MessageCircle, Check } from 'lucide-react';
import { getProjectBySlug } from '../data/projects';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';
import { Gallery } from '../components/Gallery';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const project = getProjectBySlug(slug);
  const { currency } = useCurrency();

  if (!project) return <Navigate to="/off-plan" replace />;

  const whatsappMessage = encodeURIComponent(
    `Hello, I'd like more information on ${project.name} by ${project.developer}.`,
  );

  return (
    <div className="pt-28">
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
            From {formatPrice(project.priceFromAED, currency)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Gallery images={project.images} alt={project.name} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-[1fr_360px] lg:px-10">
        <div>
          <h2 className="font-display text-2xl text-ink">Overview</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">{project.description}</p>

          <h2 className="mt-10 font-display text-2xl text-ink">Payment Plan</h2>
          <div className="mt-4 grid max-w-lg grid-cols-3 gap-4">
            {[
              ['On Booking', project.paymentPlan.onBooking],
              ['During Construction', project.paymentPlan.duringConstruction],
              ['On Handover', project.paymentPlan.onHandover],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl border border-ink/10 p-4 text-center">
                <p className="font-display text-2xl text-gold">{value}%</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-ink/50">{label}</p>
              </div>
            ))}
          </div>
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

        <aside>
          <div className="rounded-2xl border border-ink/10 p-6">
            <p className="font-display text-lg text-ink">Register Your Interest</p>
            <p className="mt-2 text-sm text-ink/60">
              Speak to our new developments desk for floor plans, availability and priority
              allocations.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button href={`https://wa.me/971505550104?text=${whatsappMessage}`} variant="primary">
                <MessageCircle size={14} /> WhatsApp Enquiry
              </Button>
              <Button to="/contact" variant="outline">
                Request Floor Plans
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
