import { Navigate, useParams } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { agents } from '../data/agents';
import { properties } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

export function AgentDetail() {
  const { slug = '' } = useParams();
  const agent = agents.find((a) => a.slug === slug);

  if (!agent) return <Navigate to="/agents" replace />;

  const listings = properties.filter((p) => p.agentId === agent.id);
  const whatsappMessage = encodeURIComponent(`Hello ${agent.name}, I'd like to speak with you about a property.`);

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Agents', to: '/agents' }, { label: agent.name }]} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-10 lg:grid-cols-[320px_1fr] lg:px-10">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-soft">
            <img src={agent.photo} alt={agent.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button href={`https://wa.me/${agent.whatsapp}?text=${whatsappMessage}`} variant="primary">
              <MessageCircle size={14} /> WhatsApp
            </Button>
            <Button href={`tel:${agent.phone}`} variant="outline">
              <Phone size={14} /> {agent.phone}
            </Button>
            <Button href={`mailto:${agent.email}`} variant="ghost" className="justify-start px-0">
              <Mail size={14} /> {agent.email}
            </Button>
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl text-ink">{agent.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-[0.14em] text-gold">{agent.title}</p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/70">{agent.bio}</p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-ink/40">Languages</p>
              <p className="mt-1 text-sm text-ink">{agent.languages.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-ink/40">Specialties</p>
              <p className="mt-1 text-sm text-ink">{agent.specialties.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-ink/40">Active Listings</p>
              <p className="mt-1 text-sm text-ink">{agent.listingsCount}</p>
            </div>
          </div>

          {listings.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl text-ink">Current Listings</h2>
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
                {listings.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
