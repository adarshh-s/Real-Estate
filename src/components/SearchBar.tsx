import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { useCommunities } from '../hooks/useSanityContent';

type Mode = 'buy' | 'rent' | 'off-plan';

const MODES: { key: Mode; label: string }[] = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'off-plan', label: 'Off-Plan' },
];

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Mansion'];

export function SearchBar({ light = true }: { light?: boolean }) {
  const communities = useCommunities();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('buy');
  const [community, setCommunity] = useState('');
  const [type, setType] = useState('');

  function handleSearch() {
    if (mode === 'off-plan') {
      const params = new URLSearchParams();
      if (community) params.set('community', community);
      navigate(`/off-plan${params.toString() ? `?${params.toString()}` : ''}`);
      return;
    }
    const params = new URLSearchParams();
    params.set('status', mode === 'buy' ? 'For Sale' : 'For Rent');
    if (community) params.set('community', community);
    if (type) params.set('type', type);
    navigate(`/listings?${params.toString()}`);
  }

  const selectClasses = clsx(
    'w-full appearance-none border-0 border-b bg-transparent py-2 pr-6 text-sm focus:outline-none',
    light ? 'border-cream/30 text-cream' : 'border-ink/20 text-ink',
  );

  return (
    <div className="w-full max-w-3xl">
      <div
        className={clsx(
          'relative mb-4 inline-flex gap-1 rounded-full p-1',
          light ? 'bg-cream/10 backdrop-blur-md' : 'bg-ink/5',
        )}
      >
        {MODES.map(({ key, label }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={clsx(
                'relative z-10 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors duration-300',
                active
                  ? light
                    ? 'text-ink'
                    : 'text-cream'
                  : light
                    ? 'text-cream/60 hover:text-cream'
                    : 'text-ink/50 hover:text-ink',
              )}
            >
              {active && (
                <motion.span
                  layoutId="search-mode-pill"
                  className={clsx('absolute inset-0 -z-10 rounded-full', light ? 'bg-cream' : 'bg-ink')}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-3xl p-5 backdrop-blur-md sm:flex-row sm:items-end sm:gap-6',
          light ? 'bg-ink/40' : 'bg-cream shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
        )}
      >
        <div className="flex-1">
          <label className={clsx('text-[10px] uppercase tracking-[0.16em]', light ? 'text-cream/50' : 'text-ink/40')}>
            Community
          </label>
          <select value={community} onChange={(e) => setCommunity(e.target.value)} className={selectClasses}>
            <option value="">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {mode !== 'off-plan' && (
          <div className="flex-1">
            <label className={clsx('text-[10px] uppercase tracking-[0.16em]', light ? 'text-cream/50' : 'text-ink/40')}>
              Property Type
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClasses}>
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="button"
          onClick={handleSearch}
          className={clsx(
            'flex items-center justify-center gap-2 rounded-full border px-8 py-3 text-xs uppercase tracking-[0.18em] transition-all active:scale-[0.97]',
            light
              ? 'border-cream bg-cream text-ink hover:bg-transparent hover:text-cream'
              : 'border-ink bg-ink text-cream hover:bg-transparent hover:text-ink',
          )}
        >
          <Search size={15} /> Search
        </button>
      </div>
    </div>
  );
}
