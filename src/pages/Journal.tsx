import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ArticleCategory } from '../types';
import { useArticles, useAgents } from '../hooks/useSanityContent';
import { ArticleCard } from '../components/ArticleCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { Reveal } from '../components/Reveal';
import { formatDate } from '../lib/format';
import clsx from 'clsx';

const CATEGORIES: ArticleCategory[] = ['Market Insight', 'Buying Guide', 'Neighborhood Guide', 'Off-Plan', 'Lifestyle'];

export function Journal() {
  const articles = useArticles();
  const agents = useAgents();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const sorted = useMemo(
    () => [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [articles],
  );

  const featured = sorted.find((a) => a.featured) ?? sorted[0];
  const featuredAuthor = agents.find((a) => a.id === featured?.authorId || a.slug === featured?.authorId);

  const rest = useMemo(() => {
    let list = sorted.filter((a) => a.id !== featured?.id);
    if (activeCategory) list = list.filter((a) => a.category === activeCategory);
    return list;
  }, [sorted, featured, activeCategory]);

  function setCategory(category: string) {
    if (!category) {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Journal' }]} />
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-gold">The S I A Luxe Journal</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Market Insight &amp; Perspective</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Notes from our private client desk — market reads, buying guides and neighbourhood
          intelligence, written by the consultants closing the deals.
        </p>
      </div>

      {featured && (
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <Reveal>
            <Link
              to={`/journal/${featured.slug}`}
              className="group grid grid-cols-1 overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10 transition-shadow hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <Badge tone="gold" className="w-fit">
                  {featured.category}
                </Badge>
                <h2 className="mt-5 font-display text-2xl leading-tight text-ink sm:text-3xl">{featured.title}</h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/60">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-ink/45">
                  {featuredAuthor && <span>{featuredAuthor.name}</span>}
                  {featuredAuthor && <span className="h-1 w-1 rounded-full bg-ink/20" />}
                  <span>{formatDate(featured.publishedAt)}</span>
                  {featured.readMinutes && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-ink/20" />
                      <span>{featured.readMinutes} min read</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap gap-2 border-y border-ink/10 py-6">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={clsx(
              'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors',
              !activeCategory ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={clsx(
                'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors',
                activeCategory === c ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} author={agents.find((ag) => ag.id === a.authorId || ag.slug === a.authorId)} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/15 py-24 text-center">
            <p className="font-display text-xl text-ink">No articles in this category yet</p>
            <p className="mt-2 text-sm text-ink/50">Check back soon, or browse another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
