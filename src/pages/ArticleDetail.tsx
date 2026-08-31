import { Navigate, useParams } from 'react-router-dom';
import { useArticleBySlug, useArticles, useAgents } from '../hooks/useSanityContent';
import { ArticleCard } from '../components/ArticleCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { Gallery } from '../components/Gallery';
import { Reveal } from '../components/Reveal';
import { formatDate } from '../lib/format';

export function ArticleDetail() {
  const { slug = '' } = useParams();
  const article = useArticleBySlug(slug);
  const articles = useArticles();
  const agents = useAgents();

  if (!article) return <Navigate to="/journal" replace />;

  const author = agents.find((a) => a.id === article.authorId || a.slug === article.authorId);
  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const paragraphs = article.body.split(/\n{2,}/);

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-3xl px-6 pt-8 lg:px-10">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Journal', to: '/journal' },
            { label: article.title },
          ]}
        />
        <Badge tone="gold" className="mt-6 w-fit">
          {article.category}
        </Badge>
        <h1 className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl">{article.title}</h1>
        <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-ink/45">
          {author && <span className="text-ink">{author.name}</span>}
          {author && <span className="h-1 w-1 rounded-full bg-ink/20" />}
          <span>{formatDate(article.publishedAt)}</span>
          {article.readMinutes && (
            <>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span>{article.readMinutes} min read</span>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <div className="overflow-hidden rounded-2xl">
          <img src={article.coverImage} alt={article.title} className="aspect-[16/9] w-full object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16 lg:px-10">
        <div className="flex flex-col gap-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] leading-[1.8] text-ink/75">
              {p}
            </p>
          ))}
        </div>

        {article.images && article.images.length > 0 && (
          <div className="mt-12">
            <Gallery images={article.images} alt={article.title} />
          </div>
        )}

        {author && (
          <div className="mt-14 flex items-center gap-4 rounded-2xl border border-ink/10 p-6">
            <img src={author.photo} alt={author.name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
            <div>
              <p className="font-display text-base text-ink">{author.name}</p>
              <p className="text-xs uppercase tracking-[0.1em] text-gold">{author.title}</p>
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-cream-soft py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">More in {article.category}</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} author={agents.find((ag) => ag.id === a.authorId || ag.slug === a.authorId)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
