import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes, MouseEvent } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'outline' | 'ghost' | 'outline-light';

const variantClasses: Record<Variant, string> = {
  primary: 'border border-ink bg-ink text-cream hover:bg-cream hover:text-ink',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-cream',
  'outline-light': 'border border-cream/50 text-cream hover:bg-cream hover:text-ink',
  ghost: 'text-ink/70 hover:text-ink',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-[background-color,color,border-color] duration-300 ease-out whitespace-nowrap active:scale-[0.97]';

const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;
const MotionButton = motion.button;

function useMagnetic(strength = 0.28) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 16, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 16, mass: 0.3 });

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
}

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
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>) {
  const classes = clsx(base, variantClasses[variant], className);
  const magnetic = useMagnetic();
  const magneticProps =
    variant === 'ghost' ? {} : { ...magnetic, whileHover: { scale: 1.04 }, whileTap: { scale: 0.97 } };

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...magneticProps}>
        {children}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <MotionAnchor href={href} className={classes} target="_blank" rel="noreferrer" {...magneticProps}>
        {children}
      </MotionAnchor>
    );
  }
  return (
    <MotionButton className={classes} {...magneticProps} {...rest}>
      {children}
    </MotionButton>
  );
}
