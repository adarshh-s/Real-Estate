import { Gem } from 'lucide-react';

export function AccentDivider() {
  return (
    <div className="relative py-1">
      <div className="h-[3px] w-full bg-gold" />
      <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border border-gold bg-cream">
        <Gem size={13} className="-rotate-45 text-gold" strokeWidth={1.6} />
      </div>
    </div>
  );
}
