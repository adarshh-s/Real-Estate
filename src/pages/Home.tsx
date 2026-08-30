import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe2, Award, ChevronDown, BedDouble, Bath, Maximize } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { SectionHeading } from '../components/SectionHeading';
import { PropertyCard } from '../components/PropertyCard';
import { ProjectCard } from '../components/ProjectCard';
import { CommunityCard } from '../components/CommunityCard';
import { AgentCard } from '../components/AgentCard';
import { StatStrip } from '../components/StatStrip';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { ScrollRail } from '../components/ScrollRail';
import { AccentDivider } from '../components/AccentDivider';
import { DiagonalTransition } from '../components/DiagonalTransition';
import { properties, getPropertyBySlug } from '../data/properties';
import { projects } from '../data/projects';
import { communities } from '../data/communities';
import { agents } from '../data/agents';
import { testimonials } from '../data/testimonials';
import { exteriors, interiors } from '../lib/images';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice, formatNumber } from '../lib/format';

const featured = properties.filter((p) => p.featured).slice(0, 6);
const spotlightProjects = projects.slice(0, 3);
const spotlightCommunities = communities.slice(0, 6);
const heroFeaturedProperty = getPropertyBySlug('park-heights-villa-dubai-hills')!;

export function Home() {
  const { currency } = useCurrency();

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100vh] flex-col justify-end overflow-hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
        >
          <source src="/videos/hero-luxury-home.mp4" type="video/mp4" />
        </video>
        {/* corner vignette so a bright, top-down shot still reads as premium/cinematic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(14,20,32,0.55)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-ink/25" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-44 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
              <span className="h-px w-8 bg-gold-soft" /> Dubai · International Realty
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              Extraordinary addresses,<br /> for an extraordinary city.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-cream/70">
              Providence Estates curates Dubai’s finest waterfront villas, sky residences and
              private estates for a global clientele — with the discretion of a private office.
            </p>
          </motion.div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:flex-1"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/property/${heroFeaturedProperty.slug}`}
                className="group flex w-full max-w-sm items-center gap-4 rounded-3xl border border-cream/15 bg-cream/[0.06] p-4 backdrop-blur-md transition-colors hover:border-gold-soft/50 hover:bg-cream/[0.1] lg:w-[340px]"
              >
                <img
                  src={heroFeaturedProperty.images[0]}
                  alt={heroFeaturedProperty.title}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold-soft">
                    Now Showing
                  </p>
                  <p className="truncate font-display text-base text-cream">
                    {heroFeaturedProperty.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-cream/60">
                    <span className="flex items-center gap-1">
                      <BedDouble size={12} /> {heroFeaturedProperty.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={12} /> {heroFeaturedProperty.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize size={12} /> {formatNumber(heroFeaturedProperty.sizeSqft)} sqft
                    </span>
                  </div>
                  <p className="mt-1 font-display text-sm text-gold-soft">
                    {formatPrice(heroFeaturedProperty.priceAED, currency)}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-cream/50 transition-transform group-hover:translate-x-1 group-hover:text-gold-soft"
                />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 hidden justify-center pb-8 sm:flex">
          <ChevronDown size={20} className="animate-bounce text-cream/50" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="-mt-px">
          <StatStrip light={false} />
        </div>
      </div>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading
            kicker="Curated Portfolio"
            title="Featured Residences"
            description="A hand-selected edit of the addresses our private clients are asking about this month."
            action={
              <Link
                to="/listings"
                className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-gold md:flex"
              >
                View All Listings <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-12">
          <ScrollRail itemClassName="w-[320px] sm:w-[360px]">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </ScrollRail>
        </div>
        <div className="mt-12 text-center md:hidden">
          <Button to="/listings" variant="outline">
            View All Listings
          </Button>
        </div>
      </section>

      {/* Off-plan spotlight */}
      <section className="bg-ink py-28 md:py-36 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              kicker="Priority Access"
              title="New Developments"
              description="Off-market launches and structured payment plans, released to Providence clients ahead of the public market."
              light
              action={
                <Link
                  to="/off-plan"
                  className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-cream/70 hover:text-gold-soft md:flex"
                >
                  Explore Off-Plan <ArrowRight size={14} />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12">
            <ScrollRail itemClassName="w-[320px] sm:w-[380px]" dark>
              {spotlightProjects.map((p) => (
                <ProjectCard key={p.id} project={p} dark />
              ))}
            </ScrollRail>
          </div>
        </div>
      </section>

      <DiagonalTransition fromClassName="bg-ink" toClassName="bg-cream" />

      {/* Communities */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading
            kicker="Where To Live"
            title="Explore Dubai’s Signature Communities"
            description="From the fronds of the Palm to the fairways of Jumeirah Golf Estates — find the address that fits your life."
            action={
              <Link
                to="/communities"
                className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-gold md:flex"
              >
                All Communities <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {spotlightCommunities.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <CommunityCard community={c} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <AccentDivider />
      </div>

      {/* Editorial feature */}
      <section className="border-y border-ink/10 bg-cream-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-0 lg:grid-cols-2">
          <Reveal className="order-2 aspect-[4/5] overflow-hidden lg:order-1 lg:aspect-auto lg:h-full">
            <img src={interiors[6]} alt="Editorial feature" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal className="order-1 px-6 py-16 lg:order-2 lg:px-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">The Providence Journal</p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              Inside Dubai’s billion-dirham skyline
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              From the Palm’s new frond extensions to the branded residences reshaping Downtown,
              our editorial desk tracks the developments, data and design stories defining the
              city’s ultra-prime market.
            </p>
            <Button to="/about" variant="ghost" className="mt-8 px-0">
              Read Our Perspective <ArrowRight size={14} />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Why Providence */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading kicker="Why Providence" title="A Private Office, Not a Portal" align="center" />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Absolute Discretion',
              body: 'Off-market listings and confidential negotiations for clients who value their privacy above all.',
            },
            {
              icon: Globe2,
              title: 'Global Reach',
              body: 'A referral network spanning 25 offices, placing your property in front of qualified buyers worldwide.',
            },
            {
              icon: Award,
              title: 'Market Authority',
              body: 'Two decades advising on Dubai’s most significant transactions, from island villas to sky penthouses.',
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="flex flex-col items-center text-center">
              <f.icon size={28} className="text-gold" strokeWidth={1.3} />
              <h3 className="mt-5 font-display text-xl text-ink">{f.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <AccentDivider />
      </div>

      {/* Agents */}
      <section className="bg-cream-soft py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              kicker="Your Consultants"
              title="Meet Our Private Client Team"
              action={
                <Link
                  to="/agents"
                  className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-gold md:flex"
                >
                  All Consultants <ArrowRight size={14} />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {agents.slice(0, 4).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <AgentCard agent={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading kicker="Client Word" title="Trusted By Discerning Owners" align="center" />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="border-t border-gold pt-6">
              <p className="font-display text-lg italic leading-snug text-ink">“{t.quote}”</p>
              <p className="mt-5 text-xs uppercase tracking-[0.12em] text-ink/50">
                {t.name} — {t.role}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <img src={exteriors[3]} alt="Sell with Providence" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-soft">Thinking Of Selling?</p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
            Let’s find the right buyer for your property
          </h2>
          <p className="mt-5 max-w-lg text-[15px] text-cream/70">
            Request a complimentary valuation and a discreet marketing strategy from a Providence
            partner.
          </p>
          <Button to="/sell" variant="outline-light" className="mt-8">
            Request a Valuation
          </Button>
        </div>
      </section>
    </div>
  );
}
