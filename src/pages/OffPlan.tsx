import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects, useCommunities } from '../hooks/useSanityContent';
import { ProjectCard } from '../components/ProjectCard';
import { Breadcrumb } from '../components/Breadcrumb';

type StatusFilter = 'All' | 'Launching Soon' | 'Presale' | 'Under Construction' | 'Ready';

export function OffPlan() {
  const projects = useProjects();
  const communities = useCommunities();
  const [searchParams] = useSearchParams();
  const [community, setCommunity] = useState(searchParams.get('community') || '');
  const [status, setStatus] = useState<StatusFilter>('All');

  const results = useMemo(
    () =>
      projects.filter((p) => {
        if (community && p.community !== community) return false;
        if (status !== 'All' && p.status !== status) return false;
        return true;
      }),
    [projects, community, status],
  );

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'New Projects' }]} />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Off-Plan &amp; New Developments</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Priority access to Dubai’s most anticipated launches, with structured payment plans and
          direct developer allocations for Providence clients.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-wrap gap-3 border-b border-ink/10 pb-8">
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="rounded-xl border border-ink/15 bg-transparent px-4 py-2.5 text-xs uppercase tracking-[0.12em] focus:border-gold focus:outline-none"
          >
            <option value="">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-xl border border-ink/15 bg-transparent px-4 py-2.5 text-xs uppercase tracking-[0.12em] focus:border-gold focus:outline-none"
          >
            {(['All', 'Launching Soon', 'Presale', 'Under Construction', 'Ready'] as StatusFilter[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {results.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-ink/15 py-24 text-center">
            <p className="font-display text-xl text-ink">No projects match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
