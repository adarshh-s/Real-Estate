import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';
import { Badge } from './Badge';
import clsx from 'clsx';

export function ProjectCard({ project, dark = false }: { project: Project; dark?: boolean }) {
  const { currency } = useCurrency();
  return (
    <Link
      to={`/off-plan/${project.slug}`}
      className={clsx(
        'group flex flex-col overflow-hidden rounded-xl transition-all duration-400 ease-out hover:-translate-y-1.5',
        dark
          ? 'bg-cream/[0.04] ring-1 ring-cream/10 hover:bg-cream/[0.07] hover:ring-cream/20'
          : 'bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-ink/10 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)]',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
        <img
          src={project.images?.[0]}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3.5 top-3.5">
          <Badge tone="gold">{project.status}</Badge>
        </div>
        {project.paymentPlan && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/85 px-3 py-2 text-[9px] uppercase tracking-[0.06em] text-cream backdrop-blur-sm sm:px-4 sm:text-[10px] sm:tracking-[0.16em]">
            <span>Booking {project.paymentPlan.onBooking}%</span>
            <span>Construction {project.paymentPlan.duringConstruction}%</span>
            <span>Handover {project.paymentPlan.onHandover}%</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <p className={`text-xs uppercase tracking-[0.12em] ${dark ? 'text-cream/50' : 'text-ink/50'}`}>
          {project.developer}
        </p>
        <h3 className={`font-display text-lg leading-snug ${dark ? 'text-cream' : 'text-ink'}`}>
          {project.name}
        </h3>
        <p className={`text-xs uppercase tracking-[0.12em] ${dark ? 'text-cream/50' : 'text-ink/50'}`}>
          {project.community}
        </p>
        <div
          className={clsx(
            'flex items-baseline justify-between border-t pt-3 flex-wrap gap-1',
            dark ? 'border-cream/10' : 'border-ink/[0.06]',
          )}
        >
          <p className={clsx('font-display text-xl', dark ? 'text-cream' : 'text-gold')}>
            {project.priceFromAED != null ? `From ${formatPrice(project.priceFromAED, currency)}` : 'Price on request'}
          </p>
          <p className={`text-xs ${dark ? 'text-cream/50' : 'text-ink/50'}`}>
            Handover {project.handover}
          </p>
        </div>
      </div>
    </Link>
  );
}
