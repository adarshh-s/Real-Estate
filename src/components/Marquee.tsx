import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';

export function Marquee({ items, dark = false }: { items: ReactNode[]; dark?: boolean }) {
  const track = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Base loop matches the site's previous CSS-driven speed (32s per full
    // pass), but here it's a GSAP tween so it can react to how fast the
    // visitor is scrolling — a quick scroll nudges it faster, briefly, then
    // it eases back to its resting pace. Hovering still pauses it outright.
    const tween = gsap.to(el, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });

    let lastY = window.scrollY;
    let idleTimer: number;
    const onScroll = () => {
      const velocity = window.scrollY - lastY;
      lastY = window.scrollY;
      const boost = gsap.utils.clamp(1, 3.5, 1 + Math.abs(velocity) / 45);
      gsap.to(tween, { timeScale: boost, duration: 0.4, ease: 'power2.out', overwrite: true });
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        gsap.to(tween, { timeScale: 1, duration: 0.9, ease: 'power2.out', overwrite: true });
      }, 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onEnter = () => tween.pause();
    const onLeave = () => tween.resume();
    el.parentElement?.addEventListener('mouseenter', onEnter);
    el.parentElement?.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer);
      el.parentElement?.removeEventListener('mouseenter', onEnter);
      el.parentElement?.removeEventListener('mouseleave', onLeave);
      tween.kill();
    };
  }, []);

  return (
    <div
      className={`relative flex overflow-hidden border-y py-5 ${
        dark ? 'border-cream/10 bg-ink' : 'border-ink/10 bg-cream'
      }`}
    >
      <div ref={trackRef} className="flex shrink-0 items-center gap-10">
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
