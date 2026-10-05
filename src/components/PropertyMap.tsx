import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Plane,
  ShoppingBag,
  Landmark as LandmarkIcon,
  Waves,
  School,
  Building2,
  Compass,
  Navigation,
  ExternalLink,
  Plus,
  Minus,
  MapPin,
} from 'lucide-react';
import { nearestLandmarks, type NearbyLandmark } from '../lib/landmarks';
import { Reveal } from './Reveal';
import { Button } from './Button';

declare global {
  interface Window {
    L?: any;
  }
}

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

export interface PropertyMapProps {
  location: { lat: number; lng: number };
  address: string;
}

// Dynamically load public Leaflet library (zero API key needed)
function loadLeafletLib(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve) => {
    // 1. Ensure Leaflet CSS is present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    // 2. Ensure Leaflet JS is loaded
    if (document.getElementById('leaflet-js-script')) {
      const interval = setInterval(() => {
        if (window.L) {
          clearInterval(interval);
          resolve(window.L);
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => {
      // Fallback CDN if needed
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      fallbackScript.onload = () => resolve(window.L);
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
  });
}

export function PropertyMap({ location, address }: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const landmarkMarkersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState<string | null>(null);

  const nearby = nearestLandmarks(location, 5);

  // Initialize Public Map (CartoDB Voyager / OpenStreetMap via Leaflet - 100% Free & 0 API Key Needed)
  useEffect(() => {
    let isCancelled = false;

    loadLeafletLib().then((L) => {
      if (isCancelled || !mapContainerRef.current || mapInstanceRef.current || !L) return;

      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Public Google Maps tiles (zero API key needed, exactly matching reference image)
      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; Google',
      }).addTo(map);

      // Minimal luxury property pin matching S I A Luxe theme (ink + gold accent)
      const propertyPin = L.divIcon({
        className: 'sia-property-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: absolute; top: -3px; left: -3px; width: 44px; height: 44px; border-radius: 9999px; background: rgba(26, 26, 26, 0.15); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
            <div style="position: relative; width: 38px; height: 38px; border-radius: 9999px; background: #1a1a1a; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; color: #ffffff;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div style="width: 10px; height: 10px; background: #1a1a1a; transform: rotate(45deg); margin-top: -5px; border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;"></div>
          </div>
        `,
        iconSize: [38, 44],
        iconAnchor: [19, 44],
        popupAnchor: [0, -46],
      });

      const propMarker = L.marker([location.lat, location.lng], { icon: propertyPin }).addTo(map);
      propMarker.bindPopup(
        `<div style="font-family: inherit; padding: 6px 10px; font-size: 12px; font-weight: 600; color: #1a1a1a;">${address}</div>`,
        { closeButton: false }
      );

      // Add nearby landmark markers to the map
      nearby.forEach((l) => {
        const landmarkPin = L.divIcon({
          className: 'sia-landmark-marker',
          html: `
            <div style="width: 24px; height: 24px; border-radius: 9999px; background: #ffffff; border: 2px solid #1a1a1a; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; color: #8a8a8a; cursor: pointer;">
              <div style="width: 7px; height: 7px; border-radius: 9999px; background: #8a8a8a;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([l.lat, l.lng], { icon: landmarkPin }).addTo(map);
        marker.bindPopup(
          `<div style="font-family: inherit; padding: 6px 10px; font-size: 11px; color: #1a1a1a;">
            <strong>${l.name}</strong><br/>
            <span style="color: #6e6e6e;">${l.distanceKm.toFixed(1)} km &middot; ~${l.driveMinutes} min drive</span>
          </div>`,
          { closeButton: false }
        );
        landmarkMarkersRef.current.push({ name: l.name, marker, lat: l.lat, lng: l.lng });
      });

      map.on('focus', () => map.scrollWheelZoom.enable());
      setMapLoaded(true);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, address, nearby]);

  // Recenter back to property
  function handleRecenter() {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([location.lat, location.lng], 14, { duration: 0.8 });
      setActiveLandmark(null);
    }
  }

  // Focus a specific landmark on map when clicked in list
  function handleFocusLandmark(l: NearbyLandmark) {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([l.lat, l.lng], 15, { duration: 0.8 });
      setActiveLandmark(l.name);
      const found = landmarkMarkersRef.current.find((m) => m.name === l.name);
      if (found) found.marker.openPopup();
    }
  }

  // Zoom controls
  function handleZoomIn() {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  }

  function handleZoomOut() {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  }

  // Public directions and maps links (zero API key required)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: Interactive Public Map Card */}
        <Reveal className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative h-[380px] w-full lg:h-[430px]">
            {/* Top-Left Location Pill */}
            <div className="absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-full border border-ink/10 bg-white/95 px-3.5 py-1.5 text-xs text-ink/75 shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
              <MapPin size={13} className="text-gold" />
              <span className="truncate max-w-[240px] sm:max-w-xs">{address}</span>
            </div>

            {/* Bottom-Left Recenter Button */}
            <button
              type="button"
              onClick={handleRecenter}
              className="absolute bottom-4 left-4 z-[400] inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-ink/70 shadow-sm backdrop-blur-sm transition-colors hover:border-ink hover:text-ink sm:bottom-5 sm:left-5"
            >
              <Compass size={13} className="text-gold" />
              Recenter
            </button>

            {/* Bottom-Right Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-[400] flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white/95 shadow-sm backdrop-blur-sm sm:bottom-5 sm:right-5">
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center text-ink/70 hover:bg-cream-soft hover:text-ink transition-colors"
              >
                <Plus size={14} />
              </button>
              <div className="h-px w-full bg-ink/10" />
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center text-ink/70 hover:bg-cream-soft hover:text-ink transition-colors"
              >
                <Minus size={14} />
              </button>
            </div>

            {/* Map Canvas */}
            <div ref={mapContainerRef} className="h-full w-full" style={{ zIndex: 1 }} />

            {/* Loading placeholder while map initializes */}
            {!mapLoaded && (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-cream-soft text-ink/40">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs">
                  <MapPin size={18} className="animate-bounce text-gold" />
                </div>
                <p className="text-[11px] uppercase tracking-wider text-ink/45">Loading map...</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Right: Nearby Landmarks List (Website minimal theme) */}
        <Reveal delay={0.1} className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-cream-soft p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-ink/50">{address}</p>
            <p className="mt-4 mb-3 text-xs uppercase tracking-[0.16em] text-gold">Nearby</p>
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col gap-3"
            >
              {nearby.map((l) => {
                const Icon = CATEGORY_ICON[l.category] ?? LandmarkIcon;
                const isSelected = activeLandmark === l.name;
                return (
                  <motion.li
                    key={l.name}
                    variants={itemVariants}
                    whileHover={{ x: 3 }}
                    onClick={() => handleFocusLandmark(l)}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-colors ${
                      isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/60'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-gold shadow-xs">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{l.name}</p>
                      <p className="text-xs text-ink/50">
                        {l.distanceKm.toFixed(1)} km · ~{l.driveMinutes} min drive
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>

          <p className="mt-4 text-[11px] text-ink/40">
            Click any location to focus it on the map.
          </p>
        </Reveal>
      </div>

      {/* Plan your visit / Directions Bar */}
      <Reveal className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-cream-soft/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gold shadow-xs">
            <Navigation size={15} />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">Plan your visit</p>
            <p className="text-[11px] text-ink/50">
              Open in Google Maps for turn-by-turn navigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            href={directionsUrl}
            variant="primary"
            className="text-xs py-2 px-4"
          >
            <Navigation size={12} />
            Get Directions
          </Button>
          <Button
            href={googleMapsUrl}
            variant="outline"
            className="text-xs py-2 px-4"
          >
            <ExternalLink size={12} />
            Open in Maps
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
