import type { ReactNode } from 'react';
import clsx from 'clsx';

// A horizontal rail that breaks out of the page's centered max-w-7xl column
// and bleeds to the true right edge of the viewport, so the last visible
// card sits partially cropped by the screen edge — the "there's more, keep
// scrolling" cue, rather than a rail that stops cleanly inside a box.
export function BleedRail({ children, itemClassName }: { children: ReactNode[]; itemClassName?: string }) {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw]">
      <div className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2 pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        {children.map((child, i) => (
          <div key={i} className={clsx('shrink-0', itemClassName)}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
