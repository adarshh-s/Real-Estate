import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, RotateCcw } from 'lucide-react';
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

  const suggestedProjects = useMemo(() => {
    if (results.length > 0) return [];
    const pool = projects.map((p) => {
      let score = 0;
      const reasons: string[] = [];
      if (community && p.community.toLowerCase() === community.toLowerCase()) {
        score += 8;
        reasons.push(p.community);
      }
      if (status !== 'All' && p.status === status) {
        score += 5;
        reasons.push(p.status);
      }
      if (reasons.length === 0) {
        reasons.push('Featured Launch');
      }
      return { project: p, score, reasons };
    });
    pool.sort((a, b) => b.score - a.score);
    return pool.slice(0, 6);
  }, [results.length, projects, community, status]);

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'New Projects' }]} />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Off-Plan &amp; New Developments</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Priority access to Dubai’s most anticipated launches, with structured payment plans and
          direct developer allocations for S I A Luxe clients.
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
          <div className="mt-12 space-y-12">
            <div className="rounded-3xl border border-dashed border-ink/20 bg-surface/60 p-8 sm:p-12 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Sparkles size={24} />
              </div>
              <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">No Exact Matches Found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                We couldn't find developments matching both your selected community and status. Below are alternative launches you may like.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCommunity('');
                    setStatus('All');
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-medium text-cream transition-colors hover:bg-gold hover:text-ink"
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>

            {suggestedProjects.length > 0 && (
              <div>
                <div className="mb-6 flex flex-col gap-1 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] font-medium text-gold">Recommended Developments</p>
                    <h3 className="mt-1 font-display text-2xl text-ink">Suggested Similar Launches</h3>
                    <p className="mt-1 text-xs text-ink/50">
                      Projects matching either your preferred community or project development stage.
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-ink/40">
                    {suggestedProjects.length} suggested {suggestedProjects.length === 1 ? 'development' : 'developments'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestedProjects.map(({ project, reasons }) => (
                    <div key={project.id} className="flex flex-col">
                      {reasons.length > 0 && (
                        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-[0.12em] font-medium text-ink/40">Matches:</span>
                          {reasons.map((reason) => (
                            <span
                              key={reason}
                              className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] font-medium text-ink"
                            >
                              <span className="h-1 w-1 rounded-full bg-gold" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
