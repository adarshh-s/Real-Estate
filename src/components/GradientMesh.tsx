import clsx from 'clsx';

export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-ink/[0.055] blur-[100px] animate-[drift1_20s_ease-in-out_infinite]" />
      <div className="absolute right-[-10%] top-1/4 h-[380px] w-[380px] rounded-full bg-gold-soft/[0.16] blur-[110px] animate-[drift2_24s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-15%] left-1/3 h-[340px] w-[340px] rounded-full bg-ink/[0.045] blur-[100px] animate-[drift1_28s_ease-in-out_infinite_reverse]" />
    </div>
  );
}
