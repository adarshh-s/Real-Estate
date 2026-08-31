import { motion, type Variants } from 'framer-motion';
import { Plane, ShoppingBag, Landmark as LandmarkIcon, Waves, School, Building2 } from 'lucide-react';
import { nearestLandmarks } from '../lib/landmarks';
import { Reveal } from './Reveal';

const CATEGORY_ICON: Record<string, typeof Plane> = {
  Airport: Plane,
  Shopping: ShoppingBag,
  Landmark: LandmarkIcon,
  Beach: Waves,
  School: School,
  'Business District': Building2,
  Waterfront: Waves,
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function PropertyMap({
  location,
  address,
}: {
  location: { lat: number; lng: number };
  address: string;
}) {
  const nearby = nearestLandmarks(location, 5);
  const embedSrc = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Reveal className="overflow-hidden rounded-3xl border border-ink/10">
        <iframe
          title="Property location"
          src={embedSrc}
          className="h-[360px] w-full lg:h-[420px]"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>

      <Reveal delay={0.1} className="rounded-3xl border border-ink/10 bg-cream-soft p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/50">{address}</p>
        <p className="mt-4 mb-3 text-xs uppercase tracking-[0.16em] text-gold">Nearby</p>
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-col gap-4"
        >
          {nearby.map((l) => {
            const Icon = CATEGORY_ICON[l.category] ?? LandmarkIcon;
            return (
              <motion.li
                key={l.name}
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-gold">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{l.name}</p>
                  <p className="text-xs text-ink/50">
                    {l.distanceKm.toFixed(1)} km · ~{l.driveMinutes} min drive
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </Reveal>
    </div>
  );
}
