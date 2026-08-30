import type { ReactNode } from 'react';

export function Marquee({ items, dark = false }: { items: ReactNode[]; dark?: boolean }) {
  const track = [...items, ...items];

  return (
    <div
      className={`group relative flex overflow-hidden border-y py-5 ${
        dark ? 'border-cream/10 bg-ink' : 'border-ink/10 bg-cream'
      }`}
    >
      <div className="flex shrink-0 animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10">
            <span
              className={`whitespace-nowrap text-sm uppercase tracking-[0.3em] ${
                dark ? 'text-cream/70' : 'text-ink/60'
              }`}
            >
              {item}
            </span>
            <span className={dark ? 'text-cream/25' : 'text-ink/20'}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
