import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Full-screen image viewer shared by the carousel Gallery and the mosaic
// property gallery, so both get the same keyboard/touch/scroll-lock
// behaviour without duplicating it.
export function ImageLightbox({
  images,
  alt,
  active,
  open,
  onClose,
  onNext,
  onPrev,
  onSelect,
}: {
  images: string[];
  alt: string;
  active: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) (delta < 0 ? onNext : onPrev)();
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}, full-screen gallery`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95"
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-6 py-5 text-cream">
            <span className="text-xs uppercase tracking-[0.14em] text-cream/60">
              {active + 1} / {images.length}
            </span>
            <button type="button" aria-label="Close" className="transition-transform hover:scale-110" onClick={onClose}>
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
                    onPrev();
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
                    onNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream transition-transform hover:scale-110 sm:right-6"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="rail flex gap-2 overflow-x-auto px-6 pb-6" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => onSelect(i)}
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
  );
}
