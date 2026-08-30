import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-ink/50">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={12} />}
        </span>
      ))}
    </div>
  );
}
