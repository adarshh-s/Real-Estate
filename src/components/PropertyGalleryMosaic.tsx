import { useState } from 'react';
import { Images } from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

function Tile({
  src,
  alt,
  onClick,
  overlay,
  className = '',
}: {
  src: string;
  alt: string;
  onClick: () => void;
  overlay?: React.ReactNode;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-ink-soft ${className}`}
    >
      <div className={`absolute inset-0 bg-ink-soft transition-opacity duration-500 ${loaded ? 'opacity-0' : 'animate-pulse opacity-100'}`} />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {overlay}
    </button>
  );
}

export function PropertyGalleryMosaic({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  const tiles = images.slice(1, 5);
  const hasTiles = tiles.length > 0;

  return (
    <div>
      <div className={`grid grid-cols-1 gap-2 ${hasTiles ? 'sm:grid-cols-2 sm:items-stretch' : ''}`}>
        {/* No aspect-ratio here on purpose, as the 2x2 grid on the right is
            the one with real (square) proportions, so it decides the row's
            height; this tile just stretches to fill whatever that turns out
            to be, which is what keeps the two sides' bottom edges level. */}
        <Tile
          src={images[0]}
          alt={`${alt}, image 1`}
          onClick={() => openAt(0)}
          className={hasTiles ? 'aspect-[4/3] h-full sm:aspect-auto' : 'aspect-[16/9]'}
        />

        {hasTiles && (
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {tiles.map((img, i) => {
              const isLastVisible = i === tiles.length - 1;
              const showOverlay = isLastVisible && images.length > 1;
              return (
                <Tile
                  key={img + i}
                  src={img}
                  alt={`${alt}, image ${i + 2}`}
                  onClick={() => openAt(i + 1)}
                  className="aspect-square"
                  overlay={
                    showOverlay && (
                      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-105 sm:bottom-3 sm:right-3 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-[13px]">
                        <Images size={13} className="shrink-0 sm:size-[14px]" />
                        <span className="whitespace-nowrap">Show all {images.length}</span>
                      </span>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        alt={alt}
        active={active}
        open={open}
        onClose={() => setOpen(false)}
        onNext={next}
        onPrev={prev}
        onSelect={setActive}
      />
    </div>
  );
}
