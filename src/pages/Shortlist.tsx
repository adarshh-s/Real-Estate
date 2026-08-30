import { Heart } from 'lucide-react';
import { useShortlist } from '../context/ShortlistContext';
import { properties } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';

export function Shortlist() {
  const { ids } = useShortlist();
  const saved = properties.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shortlist' }]} />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Your Shortlist</h1>
        <p className="mt-2 text-sm text-ink/50">{saved.length} saved {saved.length === 1 ? 'property' : 'properties'}</p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {saved.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/15 py-24 text-center">
            <Heart size={32} className="text-gold" strokeWidth={1.2} />
            <p className="mt-5 font-display text-xl text-ink">Your shortlist is empty</p>
            <p className="mt-2 max-w-xs text-sm text-ink/50">
              Tap the heart icon on any listing to save it here for later.
            </p>
            <Button to="/listings" variant="outline" className="mt-8">
              Browse Listings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
