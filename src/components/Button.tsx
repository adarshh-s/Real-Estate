import { Link } from 'react-router-dom';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'outline' | 'ghost' | 'outline-light';

const variantClasses: Record<Variant, string> = {
  primary: 'border border-ink bg-ink text-cream hover:bg-cream hover:text-ink',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-cream',
  'outline-light': 'border border-cream/50 text-cream hover:bg-cream hover:text-ink',
  ghost: 'text-ink/70 hover:text-ink',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 whitespace-nowrap active:scale-[0.97]';

export function Button({
  children,
  variant = 'primary',
  to,
  href,
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = clsx(base, variantClasses[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
