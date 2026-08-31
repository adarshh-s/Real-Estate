import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Award, Handshake, ArrowRight } from 'lucide-react';
import { StatStrip } from '../components/StatStrip';
import { Breadcrumb } from '../components/Breadcrumb';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { StaggerText } from '../components/StaggerText';
import { GradientMesh } from '../components/GradientMesh';
import { AgentCard } from '../components/AgentCard';
import { Button } from '../components/Button';
import { useAgents, useCommunities } from '../hooks/useSanityContent';
import { exteriors, interiors } from '../lib/images';

const PRINCIPLES = [
  { icon: ShieldCheck, title: 'Discretion', body: 'Confidential handling of every transaction, from first enquiry to closing.' },
  { icon: Award, title: 'Senior Expertise', body: 'Our founding consultants bring a combined six decades of experience from Dubai’s leading agencies.' },
  { icon: TrendingUp, title: 'Data-Led', body: 'Every valuation is benchmarked against verified, real-time Dubai transaction data — not guesswork.' },
  { icon: Handshake, title: 'Partnership', body: 'One dedicated consultant sees your transaction through from start to finish.' },
];

const MILESTONES = [
  { year: '2023', label: 'Sialuxe Real Estate founded in Dubai by a partnership of senior luxury consultants.' },
  { year: '2024', label: 'Closed our first AED 100M+ portfolio sale on Palm Jumeirah.' },
  { year: '2025', label: 'Surpassed AED 1B in prime Dubai property transacted.' },
  { year: '2026', label: 'Grew to a team of six senior consultants across Dubai’s key communities.' },
];

export function About() {
  const agents = useAgents();
  const communities = useCommunities();
  const coverage = communities.slice(0, 6).map((c) => c.name);
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-16">
        <img src={exteriors[4]} alt="Sialuxe Real Estate" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(14,20,32,0.5)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 lg:px-10">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
            <span className="h-px w-8 bg-gold-soft" /> Est. 2023 · Dubai
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl">
            <StaggerText text="A private office for" delay={0.1} />
            <br />
            <StaggerText text="Dubai’s finest addresses" delay={0.35} />
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70">
            A senior team with decades of combined experience, a fast-growing portfolio of
            Dubai’s finest addresses, and a single point of contact for every client we serve.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal className="relative">
            <span className="pointer-events-none absolute -left-2 -top-14 select-none font-display text-[9rem] leading-none text-ink/[0.05] lg:text-[11rem]">
              “
            </span>
            <p className="relative mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" /> Our Story
            </p>
            <p className="relative font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              Founded in 2023 by a partnership of Dubai’s most experienced luxury consultants,
              Sialuxe Real Estate was built to bring the discretion of a private office to a
              market that had outgrown the traditional listings portal.
            </p>
            <p className="relative mt-8 max-w-xl text-[15px] leading-relaxed text-ink/60">
              We represent a portfolio of the city’s most significant properties — from Palm
              Jumeirah beachfront villas to Emirates Hills estates — connecting owners with a
              curated, verified network of qualified buyers. Every engagement is handled by a
              dedicated partner, not a call centre.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-8 text-xs uppercase tracking-[0.3em] text-ink/40">Milestones</p>
            <div className="space-y-9 border-l border-ink/15 pl-8">
              {MILESTONES.map((m) => (
                <div key={m.year} className="relative">
                  <span className="absolute -left-[34px] top-1.5 h-2 w-2 rounded-full border-2 border-cream bg-ink ring-1 ring-ink/15" />
                  <p className="font-display text-lg text-ink">{m.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/55">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <StatStrip light={false} />
      </section>

      <section className="relative overflow-hidden py-28 md:py-36">
        <GradientMesh />
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading kicker="Our Principles" title="What Sets Sialuxe Apart" align="center" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream/90 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.18)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-cream transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110">
                    <f.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-7 font-display text-lg text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center lg:grid-cols-2">
          <Reveal className="group relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full">
            <img
              src={interiors[2]}
              alt="Sialuxe office"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <p className="font-display text-2xl text-ink">100%</p>
              <p className="text-[11px] uppercase leading-tight tracking-[0.1em] text-ink/55">
                Dedicated to Dubai real estate
              </p>
            </div>
          </Reveal>
          <Reveal className="px-6 py-16 lg:px-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Dubai-First, By Design</p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              One city. Total focus.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              We made a deliberate choice to specialise in one market rather than spread thin
              across many. Every consultant lives and breathes Dubai real estate — from the
              Palm to Dubai Hills — so nothing is generic and nothing is guessed.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {coverage.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-ink/15 px-4 py-1.5 text-xs uppercase tracking-[0.1em] text-ink/60"
                >
                  {city}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading
            kicker="Leadership"
            title="The People Behind Sialuxe"
            description="A small team of senior consultants, each with a decade or more advising Dubai’s ultra-prime market."
            action={
              <Link
                to="/agents"
                className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-gold md:flex"
              >
                Meet The Full Team <ArrowRight size={14} />
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
        <div className="mt-10 text-center md:hidden">
          <Button to="/agents" variant="outline">
            Meet The Full Team
          </Button>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={exteriors[5]} alt="Speak with Sialuxe" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-soft">Work With Us</p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
            Speak with a Sialuxe partner
          </h2>
          <p className="mt-5 max-w-lg text-[15px] text-cream/70">
            Whether buying, selling or investing, our private office is ready to guide your next
            move in Dubai real estate.
          </p>
          <Button to="/contact" variant="outline-light" className="mt-8">
            Book a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
