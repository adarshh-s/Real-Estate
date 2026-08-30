import { Link } from 'react-router-dom';
import type { Agent } from '../types';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link to={`/agents/${agent.slug}`} className="group flex flex-col">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-ink-soft shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-ink/10 transition-all duration-400 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)]">
        <img
          src={agent.photo}
          alt={agent.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div className="pt-4">
        <h3 className="font-display text-lg text-ink">{agent.name}</h3>
        <p className="text-xs uppercase tracking-[0.12em] text-gold">{agent.title}</p>
        <p className="mt-2 text-xs text-ink/50">{agent.specialties.slice(0, 2).join(' · ')}</p>
      </div>
    </Link>
  );
}
