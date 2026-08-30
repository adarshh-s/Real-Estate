import type { ReactNode } from 'react';
import clsx from 'clsx';

export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  light = false,
  action,
}: {
  kicker?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        action && 'md:flex-row md:items-end md:justify-between md:text-left',
      )}
    >
      <div className={clsx(align === 'center' && 'flex flex-col items-center')}>
        {kicker && (
          <p
            className={clsx(
              'mb-3 text-xs uppercase tracking-[0.3em]',
              light ? 'text-gold-soft' : 'text-gold',
            )}
          >
            {kicker}
          </p>
        )}
        <h2
          className={clsx(
            'font-display text-3xl leading-[1.1] sm:text-4xl md:text-5xl',
            light ? 'text-cream' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={clsx(
              'mt-4 max-w-xl text-[15px] leading-relaxed',
              align === 'center' && 'mx-auto',
              light ? 'text-cream/70' : 'text-ink/60',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
