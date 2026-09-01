import { useCommunities } from '../hooks/useSanityContent';
import { CommunityCard } from '../components/CommunityCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

export function Communities() {
  const communities = useCommunities();
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Communities' }]} />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">Dubai’s Signature Communities</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
              Every neighbourhood tells a different story — from the private beaches of the Palm to
              the fairways of Jumeirah Golf Estates. Explore the addresses our clients call home.
            </p>
          </div>
          <Button to="/communities/compare" variant="outline" className="shrink-0">
            Compare Communities
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
