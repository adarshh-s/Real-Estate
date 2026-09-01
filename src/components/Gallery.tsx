import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  // Lock background scroll and wire up arrow-key / Escape navigation while
  // the full-screen viewer is open — otherwise the page behind it keeps
  // scrolling and there's no keyboard way to move through the photos.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) (delta < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-ink-soft">
        <img
          src={images[active]}
          alt={`${alt} — image ${active + 1}`}
          className="h-full w-full cursor-zoom-in object-cover"
          onClick={() => setOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink transition-all hover:scale-105 hover:bg-cream"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink transition-all hover:scale-105 hover:bg-cream"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="rail mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — full-screen gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-ink/95"
            onClick={() => setOpen(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex items-center justify-between px-6 py-5 text-cream">
              <span className="text-xs uppercase tracking-[0.14em] text-cream/60">
                {active + 1} / {images.length}
              </span>
              <button
                type="button"
                aria-label="Close"
                className="transition-transform hover:scale-110"
                onClick={() => setOpen(false)}
              >
                <X size={26} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 pb-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={active}
                  src={images[active]}
                  alt={alt}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-full max-w-full select-none object-contain"
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cream transition-transform hover:scale-110 sm:left-6"
                  >
                    <ChevronLeft size={36} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream transition-transform hover:scale-110 sm:right-6"
                  >
                    <ChevronRight size={36} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="rail flex gap-2 overflow-x-auto px-6 pb-6"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      i === active ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
