import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CinematicInterstitial({
  videoUrl,
  headline,
  body,
}: {
  videoUrl?: string;
  headline?: string;
  body?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    if (!section || !video || !content) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Slow, scrubbed "arrival": the shot settles from a tighter frame and
      // the copy resolves into place as the section scrolls through view —
      // tied directly to scroll position rather than a one-shot trigger.
      gsap.fromTo(
        video,
        { scale: 1.22, filter: 'brightness(0.75)' },
        {
          scale: 1,
          filter: 'brightness(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 35%',
            scrub: 0.6,
          },
        },
      );

      gsap.fromTo(
        content.children,
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.6,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-ink"
    >
      <video
        ref={videoRef}
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/twilight-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ink/55" />
      <div className="grain-overlay" />
      <div ref={contentRef} className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="mb-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
          <span className="h-px w-8 bg-gold-soft" /> The S I A Luxe Standard
        </p>
        <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">{headline}</h2>
        <p className="mt-5 text-[15px] leading-relaxed text-cream/70">{body}</p>
        <Link
          to="/listings"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-cream/50 px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-cream hover:text-ink active:scale-[0.97]"
        >
          Explore The Portfolio
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
