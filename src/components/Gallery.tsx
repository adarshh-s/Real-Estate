import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

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

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-6"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-6 top-6 text-cream transition-transform hover:scale-110"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
          <img
            src={images[active]}
            alt={alt}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-cream transition-transform hover:scale-110"
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
                className="absolute right-6 top-1/2 -translate-y-1/2 text-cream transition-transform hover:scale-110"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
