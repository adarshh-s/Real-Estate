import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Handshake, Award, ChevronDown, BedDouble, Bath, Maximize, Star, Building2, Users } from 'lucide-react';
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
import { GradientMesh } from '../components/GradientMesh';
import { Marquee } from '../components/Marquee';
import { VerticalTicker } from '../components/VerticalTicker';
import { StaggerText } from '../components/StaggerText';
import {
  useProperties,
  useProjects,
  useCommunities,
  useAgents,
  useTestimonials,
  useSiteSettings,
} from '../hooks/useSanityContent';
import { exteriors, interiors } from '../lib/images';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice, formatNumber } from '../lib/format';
import type { Tag } from '../types';

const COLLECTION_BASE: { tag: Tag; title: string; description: string; image: string }[] = [
  { tag: 'Waterfront', title: 'Waterfront Living', description: 'Beachfront villas and marina-facing towers', image: exteriors[1] },
  { tag: 'Sky Villa', title: 'Sky Villas & Penthouses', description: 'Full-floor residences above the skyline', image: interiors[9] },
  { tag: 'Branded Residence', title: 'Branded Residences', description: 'Hotel-branded addresses, five-star service', image: interiors[14] },
  { tag: 'Exclusive', title: 'Exclusive Collection', description: 'Off-market and limited-release listings', image: exteriors[6] },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'RERA Licensed Brokerage' },
  { icon: Star, label: '98% Client Satisfaction' },
  { icon: Building2, label: '140+ Residences Sold' },
  { icon: Users, label: '6 Senior Consultants' },
];

export function Home() {
  const { currency } = useCurrency();
  const settings = useSiteSettings();
  const properties = useProperties();
  const projects = useProjects();
  const communities = useCommunities();
  const agents = useAgents();
  const testimonials = useTestimonials();

  const featured = useMemo(() => properties.filter((p) => p.featured).slice(0, 6), [properties]);
  const tickerProperties = useMemo(() => properties.slice(0, 8), [properties]);
  const spotlightProjects = useMemo(() => projects.slice(0, 3), [projects]);
  const spotlightCommunities = useMemo(() => communities.slice(0, 6), [communities]);
  const heroFeaturedProperty = featured[0] ?? properties[0];
  const COLLECTIONS = useMemo(
    () =>
      COLLECTION_BASE.map((c) => ({
        ...c,
        count: properties.filter((p) => p.tags?.includes(c.tag)).length,
      })),
    [properties],
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100vh] flex-col justify-end overflow-hidden bg-ink">
        <video
          key={settings.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={settings.heroPosterUrl}
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
        >
          <source src={settings.heroVideoUrl} type="video/mp4" />
        </video>
        {/* corner vignette so a bright, top-down shot still reads as premium/cinematic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(14,20,32,0.55)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-ink/25" />
        <div className="grain-overlay" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-44 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
              <span className="h-px w-8 bg-gold-soft" /> {settings.heroKicker}
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              <StaggerText text={settings.heroHeadlineLine1 ?? ''} delay={0.15} />
              <br />
              <StaggerText text={settings.heroHeadlineLine2 ?? ''} delay={0.4} />
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-cream/70">{settings.heroSubtitle}</p>
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

      {/* Trust strip — floats over the seam between hero and stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto hidden -mt-9 w-full max-w-5xl px-6 lg:block"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full border border-cream/15 bg-ink/70 px-8 py-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:flex-nowrap lg:justify-between">
          {TRUST_ITEMS.map((t) => (
            <div key={t.label} className="flex items-center gap-2.5 text-cream/85">
              <t.icon size={15} className="shrink-0 text-gold-soft" strokeWidth={1.6} />
              <span className="text-[11px] uppercase tracking-[0.14em] whitespace-nowrap">{t.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="-mt-px">
          <StatStrip light={false} />
        </div>
      </div>

      <Marquee items={communities.map((c) => c.name)} />

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

      {/* Live activity */}
      <section className="border-t border-ink/10 py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" /> Always In Motion
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              Live portfolio activity
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              New listings, price updates and offers move quickly across our portfolio. This is a
              live edit of what our consultants are working on right now.
            </p>
            <Button to="/listings" variant="outline" className="mt-8">
              View All Listings
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <VerticalTicker properties={tickerProperties} />
          </Reveal>
        </div>
      </section>

      {/* Curated collections */}
      <section className="border-t border-ink/10 bg-cream-soft py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              kicker="Curated Collections"
              title="Shop By What Matters To You"
              description="Every Sialuxe listing is tagged and verified by our research desk — start with the collection that fits your brief."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((c, i) => (
              <Reveal key={c.tag} delay={i * 0.06}>
                <Link
                  to={`/listings?tag=${encodeURIComponent(c.tag)}`}
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.35)]"
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute right-5 top-5 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-cream/15 text-cream opacity-0 backdrop-blur-sm transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight size={16} className="-rotate-45" />
                  </div>
                  <div className="relative z-10 p-6 text-cream">
                    <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                      {c.count} Residences
                    </p>
                    <h3 className="font-display text-xl leading-tight">{c.title}</h3>
                    <p className="mt-1 text-xs text-cream/60">{c.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Off-plan spotlight */}
      <section className="bg-ink py-28 md:py-36 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              kicker="Priority Access"
              title="New Developments"
              description="Off-market launches and structured payment plans, released to Sialuxe clients ahead of the public market."
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

      {/* Cinematic interstitial */}
      <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-ink">
        <video
          key={settings.interstitialVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/twilight-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={settings.interstitialVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="grain-overlay" />
        <Reveal className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
            <span className="h-px w-8 bg-gold-soft" /> The Sialuxe Standard
          </p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">
            {settings.interstitialHeadline}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-cream/70">{settings.interstitialBody}</p>
          <Link
            to="/listings"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-cream/50 px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-cream hover:text-ink active:scale-[0.97]"
          >
            Explore The Portfolio
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

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
        <div className="mt-12 space-y-4">
          <Reveal>
            <CommunityCard community={spotlightCommunities[0]} featured />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {spotlightCommunities.slice(1, 5).map((c, i) => (
              <Reveal key={c.id} delay={0.06 + i * 0.06}>
                <CommunityCard community={c} index={i + 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial feature */}
      <section className="border-y border-ink/10 bg-cream-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-0 lg:grid-cols-2">
          <Reveal className="group relative order-2 aspect-[4/5] overflow-hidden lg:order-1 lg:aspect-auto lg:h-full">
            <img
              src={interiors[6]}
              alt="Editorial feature"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
            <span className="absolute left-6 top-6 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cream backdrop-blur-md">
              Market Insight
            </span>
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur-md sm:right-auto sm:w-72">
              <p className="font-display text-2xl text-ink">AED 1.2B+</p>
              <p className="text-[11px] uppercase leading-tight tracking-[0.1em] text-ink/55">
                In prime Dubai property transacted through Sialuxe
              </p>
            </div>
          </Reveal>
          <Reveal className="relative order-1 overflow-hidden px-6 py-16 lg:order-2 lg:px-20">
            <span className="pointer-events-none absolute -top-10 left-4 select-none font-display text-[9rem] leading-none text-ink/[0.05] lg:left-14 lg:text-[11rem]">
              “
            </span>
            <p className="relative mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" /> The Sialuxe Journal
            </p>
            <h2 className="relative font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Inside Dubai’s billion-dirham skyline
            </h2>
            <p className="relative mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              From the Palm’s new frond extensions to the branded residences reshaping Downtown,
              our editorial desk tracks the developments, data and design stories defining the
              city’s ultra-prime market.
            </p>

            <div className="relative mt-9 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ink/10 pt-6">
              <div>
                <p className="font-display text-xl text-ink">140+</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45">Transactions Closed</p>
              </div>
              <div>
                <p className="font-display text-xl text-ink">6</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45">Senior Consultants</p>
              </div>
              <div>
                <p className="font-display text-xl text-ink">60+ Yrs</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45">Combined Experience</p>
              </div>
            </div>

            <Link
              to="/about"
              className="group/link relative mt-9 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink"
            >
              Read Our Perspective
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1.5" />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why Sialuxe */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <GradientMesh />
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading kicker="Why Sialuxe" title="A Private Office, Not a Portal" align="center" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                stat: '100%',
                title: 'Absolute Discretion',
                body: 'Off-market listings and confidential negotiations for clients who value their privacy above all.',
              },
              {
                icon: Handshake,
                stat: '1:1',
                title: 'Boutique By Design',
                body: 'Every client works directly with a senior partner — never a rotating desk of coordinators.',
              },
              {
                icon: Award,
                stat: '60+ Yrs',
                title: 'Senior Team',
                body: 'Our founding consultants bring a combined six decades of experience from Dubai’s leading agencies — now under one roof.',
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream/90 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.18)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-cream transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110">
                    <f.icon size={20} strokeWidth={1.5} />
                  </div>
                  <p className="mt-8 font-display text-4xl text-ink">{f.stat}</p>
                  <h3 className="mt-2 font-display text-lg text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
        <img src={exteriors[3]} alt="Sell with Sialuxe" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-soft">Thinking Of Selling?</p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
            Let’s find the right buyer for your property
          </h2>
          <p className="mt-5 max-w-lg text-[15px] text-cream/70">
            Request a complimentary valuation and a discreet marketing strategy from a Sialuxe
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
