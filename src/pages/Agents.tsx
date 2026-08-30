import { useAgents } from '../hooks/useSanityContent';
import { AgentCard } from '../components/AgentCard';
import { Breadcrumb } from '../components/Breadcrumb';

export function Agents() {
  const agents = useAgents();
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Agents' }]} />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Our Private Client Team</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Every Providence consultant specialises in a distinct portfolio of communities, giving
          you direct access to the deepest local knowledge in the city.
        </p>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
