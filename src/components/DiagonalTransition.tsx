import clsx from 'clsx';

export function DiagonalTransition({
  fromClassName,
  toClassName,
  height = 96,
}: {
  fromClassName: string;
  toClassName: string;
  height?: number;
}) {
  return (
    <div className={clsx('relative w-full', toClassName)} style={{ height }}>
      <div
        className={clsx('absolute inset-0', fromClassName)}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 45%)' }}
      />
    </div>
  );
}
