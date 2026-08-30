import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

const stats = [
  { prefix: 'AED ', target: 12.4, decimals: 1, suffix: 'B+', label: 'Property Transacted' },
  { prefix: '', target: 1900, decimals: 0, suffix: '+', label: 'Residences Sold or Let' },
  { prefix: '', target: 25, decimals: 0, suffix: '', label: 'Offices Across 4 Continents' },
  { prefix: '', target: 98, decimals: 0, suffix: '%', label: 'Client Retention Rate' },
];

function AnimatedStat({
  prefix,
  target,
  decimals,
  suffix,
}: {
  prefix: string;
  target: number;
  decimals: number;
  suffix: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <p ref={ref} className="font-display text-3xl md:text-4xl">
      {prefix}
      {display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </p>
  );
}

export function StatStrip({ light = true }: { light?: boolean }) {
  return (
    <div
      className={`grid grid-cols-2 gap-8 border-y py-10 sm:grid-cols-4 ${
        light ? 'border-cream/15 text-cream' : 'border-ink/10 text-ink'
      }`}
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center sm:text-left">
          <AnimatedStat prefix={s.prefix} target={s.target} decimals={s.decimals} suffix={s.suffix} />
          <p
            className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${
              light ? 'text-cream/60' : 'text-ink/50'
            }`}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
