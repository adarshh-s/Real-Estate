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
  { icon: ShieldCheck, title: 'Discretion', body: 'We treat client objectives, preferences and decisions with the privacy and professionalism they deserve.' },
  { icon: Award, title: 'Discernment', body: 'We value relevance over volume: every opportunity is assessed against what genuinely fits the brief.' },
  { icon: TrendingUp, title: 'Perspective', body: 'We look beyond the property to location, developer, market context and long-term potential.' },
  { icon: Handshake, title: 'Personal Service', body: 'Every client has a different objective. Our approach begins by understanding the individual.' },
];

const MILESTONES = [
  { year: '2026', label: 'S I A Luxe founded in Dubai by a partnership of senior real estate investment advisors.' },
];

export function About() {
  const agents = useAgents();
  const communities = useCommunities();
  const coverage = communities.slice(0, 6).map((c) => c.name);
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-16">
        <img src={exteriors[4]} alt="S I A Luxe Real Estate" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(26,26,26,0.5)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 lg:px-10">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gold-soft">
            <span className="h-px w-8 bg-gold-soft" /> Est. 2026 · Dubai
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl">
            <StaggerText text="A private real estate" delay={0.1} />
            <br />
            <StaggerText text="investment & advisory partner" delay={0.35} />
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70">
            For clients who expect more than a property transaction, a senior team measuring
            success not by how many listings we show, but by the quality of opportunities we
            bring into focus.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-cream-soft py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <p className="mb-7 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" /> The Name <span className="h-px w-8 bg-gold" />
            </p>
            <img src="/logo-sia-luxe.png" alt="S I A Luxe" className="mx-auto h-14 w-auto sm:h-16" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 divide-y divide-ink/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="pb-8 sm:pb-0 sm:pr-10">
                <p className="font-display text-2xl text-ink">SIA</p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-gold">
                  Strategic Investment Advisory
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">
                  The discipline behind every recommendation: reading location, developer,
                  entry price and long-term potential before an opportunity ever reaches a
                  client.
                </p>
              </div>
              <div className="pt-8 sm:pt-0 sm:pl-10">
                <p className="font-display text-2xl text-ink">LUXE</p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-gold">
                  Luxury Real Estate
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">
                  The standard behind every address: a curated focus on Dubai’s most
                  distinguished properties, for clients who expect nothing less.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:py-24 lg:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal className="relative">
            <span className="pointer-events-none absolute -left-2 -top-14 select-none font-display text-[9rem] leading-none text-ink/[0.05] lg:text-[11rem]">
              “
            </span>
            <p className="relative mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-gold" /> Our Story
            </p>
            <p className="relative font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              Founded in 2026, S I A Luxe was shaped around a different idea: what if real estate
              felt less like searching, and more like being advised?
            </p>
            <p className="relative mt-8 max-w-xl text-[15px] leading-relaxed text-ink/60">
              We begin with the client’s objective, understand the investment or lifestyle
              context, and bring relevant opportunities forward. Location, developer, entry
              price, payment structure, rental demand and long-term potential: we bring these
              together with clarity, discretion and a more personal standard of service.
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

      <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36">
        <GradientMesh />
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading kicker="Our Values" title="What Sets S I A Luxe Apart" align="center" />
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
              alt="S I A Luxe office"
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
              across many. Every consultant lives and breathes Dubai real estate, from the
              Palm to Dubai Hills, so nothing is generic and nothing is guessed.
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

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 md:py-28 lg:py-36 lg:px-10">
        <Reveal>
          <SectionHeading
            kicker="Leadership"
            title="The People Behind S I A Luxe"
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
        <img src={exteriors[5]} alt="Speak with S I A Luxe" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 md:py-28 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-soft">Work With Us</p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
            Speak with a S I A Luxe partner
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
