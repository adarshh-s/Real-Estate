import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Phone, Mail } from 'lucide-react';
import clsx from 'clsx';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useShortlist } from '../context/ShortlistContext';
import { useSiteSettings } from '../hooks/useSanityContent';

const LINKS = [
  { label: 'Buy', to: '/listings?status=For Sale' },
  { label: 'Rent', to: '/listings?status=For Rent' },
  { label: 'New Projects', to: '/off-plan' },
  { label: 'Communities', to: '/communities' },
  { label: 'Agents', to: '/agents' },
  { label: 'About', to: '/about' },
];

export function Navbar() {
  const settings = useSiteSettings();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { ids } = useShortlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Floating, transparent over the hero video — only ever true on the home
  // page before the visitor scrolls. Everywhere else the nav is solid white.
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        transparent
          ? '[text-shadow:0_1px_6px_rgba(0,0,0,0.45)]'
          : 'bg-white/95 shadow-[0_1px_0_rgba(14,20,32,0.06)] backdrop-blur-xl',
      )}
    >
      <div
        className={clsx(
          'hidden border-b sm:block',
          transparent ? 'border-cream/20' : 'border-ink/8',
        )}
      >
        <div
          className={clsx(
            'mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px] tracking-[0.08em] lg:px-10',
            transparent ? 'text-cream/80' : 'text-ink/55',
          )}
        >
          <div className="flex items-center gap-6">
            <a
              href={`tel:${settings.contactPhone?.replace(/\s/g, '')}`}
              className={clsx('flex items-center gap-1.5', transparent ? 'hover:text-cream' : 'hover:text-ink')}
            >
              <Phone size={12} /> {settings.contactPhone}
            </a>
            <a
              href={`mailto:${settings.contactEmail}`}
              className={clsx('flex items-center gap-1.5', transparent ? 'hover:text-cream' : 'hover:text-ink')}
            >
              <Mail size={12} /> {settings.contactEmail}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span>RERA Licensed Brokerage</span>
            <div className={clsx('h-3 w-px', transparent ? 'bg-cream/25' : 'bg-ink/15')} />
            <CurrencySwitcher light={transparent} />
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-10',
          scrolled && !transparent ? 'py-3.5' : 'py-6',
        )}
      >
        <Link
          to="/"
          className={clsx('font-display text-xl tracking-[0.08em]', transparent ? 'text-cream' : 'text-ink')}
        >
          SIALUXE <span className={transparent ? 'text-gold-soft' : 'text-gold'}>REAL ESTATE</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={clsx(
                'group relative py-1 text-xs uppercase tracking-[0.14em] transition-colors',
                transparent ? 'text-cream/85 hover:text-cream' : 'text-ink/70 hover:text-ink',
              )}
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-soft transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/shortlist"
            aria-label="Shortlist"
            className={clsx('relative', transparent ? 'text-cream/90' : 'text-ink/70 hover:text-ink')}
          >
            <Heart size={18} />
            {ids.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-cream">
                {ids.length}
              </span>
            )}
          </Link>
          <Link
            to="/contact"
            className={clsx(
              'rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-all active:scale-[0.97]',
              transparent
                ? 'border border-cream/50 bg-cream/5 text-cream hover:bg-cream hover:text-ink'
                : 'border border-ink bg-ink text-cream hover:bg-cream hover:text-ink',
            )}
          >
            Book a Consultation
          </Link>
        </div>

        <button
          type="button"
          className={transparent ? 'text-cream lg:hidden' : 'text-ink lg:hidden'}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink/8 bg-white px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm uppercase tracking-[0.14em] text-ink/80">
                {link.label}
              </Link>
            ))}
            <Link to="/sell" className="text-sm uppercase tracking-[0.14em] text-ink/80">
              Sell With Us
            </Link>
            <Link to="/contact" className="text-sm uppercase tracking-[0.14em] text-ink/80">
              Contact
            </Link>
            <Link to="/shortlist" className="text-sm uppercase tracking-[0.14em] text-ink/80">
              Shortlist ({ids.length})
            </Link>
          </nav>
          <div className="mt-6">
            <CurrencySwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
