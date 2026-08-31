import { Link } from 'react-router-dom';
import { InstagramIcon, LinkedinIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { Newsletter } from './Newsletter';
import { useCommunities } from '../hooks/useSanityContent';

const EXPLORE = [
  { label: 'Buy', to: '/listings?status=For Sale' },
  { label: 'Rent', to: '/listings?status=For Rent' },
  { label: 'New Projects', to: '/off-plan' },
  { label: 'Communities', to: '/communities' },
];

const COMPANY = [
  { label: 'About Sialuxe', to: '/about' },
  { label: 'Our Agents', to: '/agents' },
  { label: 'Sell With Us', to: '/sell' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const communities = useCommunities();
  const coverage = communities.slice(0, 5).map((c) => c.name);
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-xl tracking-[0.08em]">
              SIALUXE <span className="text-gold-soft">REAL ESTATE</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              A private-client real estate house representing Dubai’s most distinguished
              addresses, built by a senior team with decades of combined experience.
            </p>
            <div className="mt-6 flex gap-4 text-cream/70">
              <InstagramIcon size={18} className="hover:text-gold-soft" />
              <LinkedinIcon size={18} className="hover:text-gold-soft" />
              <FacebookIcon size={18} className="hover:text-gold-soft" />
              <YoutubeIcon size={18} className="hover:text-gold-soft" />
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold-soft">Explore</p>
            <ul className="flex flex-col gap-3 text-sm text-cream/70">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold-soft">Company</p>
            <ul className="flex flex-col gap-3 text-sm text-cream/70">
              {COMPANY.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold-soft">Coverage</p>
            <ul className="flex flex-col gap-3 text-sm text-cream/70">
              {coverage.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-cream/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-soft">
              Market Insights, Direct to You
            </p>
            <Newsletter />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sialuxe Real Estate LLC. RERA ORN 0000000. All rights reserved.</p>
          <p>Regulated by the Real Estate Regulatory Agency (RERA), Dubai Land Department.</p>
        </div>
      </div>
    </footer>
  );
}
