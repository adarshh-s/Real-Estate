import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article, Agent } from '../types';
import { formatDate } from '../lib/format';
import { Badge } from './Badge';

const MotionLink = motion.create(Link);

export function ArticleCard({ article, author }: { article: Article; author?: Agent }) {
  return (
    <MotionLink
      to={`/journal/${article.slug}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-ink/10 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] hover:ring-ink/15"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3.5 top-3.5">
          <Badge tone="dark">{article.category}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="font-display text-lg leading-snug text-ink">{article.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink/60">{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 border-t border-ink/[0.06] pt-3 text-xs text-ink/45">
          {author && <span>{author.name}</span>}
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
    </MotionLink>
  );
}
