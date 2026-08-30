import { useRef, useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function ScrollRail({
  children,
  itemClassName,
  dark = false,
}: {
  children: ReactNode[];
  itemClassName?: string;
  dark?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [children.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="rail no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {children.map((child, i) => (
          <div key={i} className={clsx('shrink-0 snap-start', itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className={clsx(
            'absolute -left-4 top-1/3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:flex',
            dark ? 'bg-cream text-ink' : 'bg-ink text-cream',
          )}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className={clsx(
            'absolute -right-4 top-1/3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:flex',
            dark ? 'bg-cream text-ink' : 'bg-ink text-cream',
          )}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
