export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="17" width="5" height="11" />
      <rect x="13.5" y="10" width="5" height="18" />
      <rect x="24" y="3" width="5" height="25" />
    </svg>
  );
}
