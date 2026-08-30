import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Badge({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode;
  tone?: 'dark' | 'gold' | 'light' | 'outline';
  className?: string;
}) {
  const tones: Record<string, string> = {
    dark: 'bg-ink text-cream',
    gold: 'border border-ink bg-cream text-ink',
    light: 'bg-cream text-ink',
    outline: 'border border-cream/60 text-cream backdrop-blur-sm',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
