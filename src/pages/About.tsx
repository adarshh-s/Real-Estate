import { ShieldCheck, Globe2, Award, Handshake } from 'lucide-react';
import { StatStrip } from '../components/StatStrip';
import { Breadcrumb } from '../components/Breadcrumb';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { exteriors, interiors } from '../lib/images';

export function About() {
  return (
    <div>
      <section className="relative flex h-[60vh] items-end overflow-hidden pt-16">
        <img src={exteriors[4]} alt="Providence Estates" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 lg:px-10">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-cream sm:text-5xl">
            A private office for Dubai’s finest addresses
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
            Founded by a partnership of Dubai’s most experienced luxury consultants, Providence
            Estates was built to bring the discretion of a private office to a market that had
            outgrown the traditional listings portal.
          </p>
          <p className="mt-8 text-[15px] leading-relaxed text-ink/60">
            We represent a portfolio of the city’s most significant properties — from Palm Jumeirah
            beachfront villas to Emirates Hills estates — connecting owners with a curated,
            verified network of qualified buyers across four continents. Every engagement is
            handled by a dedicated partner, not a call centre.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <StatStrip light={false} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-10">
        <Reveal>
          <SectionHeading kicker="Our Principles" title="What Sets Providence Apart" align="center" />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Discretion', body: 'Confidential handling of every transaction, from first enquiry to closing.' },
            { icon: Globe2, title: 'Global Network', body: 'Direct relationships with private banks, family offices and referral partners abroad.' },
            { icon: Award, title: 'Market Depth', body: 'Two decades of transaction data informing every valuation we provide.' },
            { icon: Handshake, title: 'Partnership', body: 'One dedicated consultant sees your transaction through from start to finish.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="flex flex-col items-center text-center">
              <f.icon size={26} className="text-gold" strokeWidth={1.3} />
              <h3 className="mt-4 font-display text-lg text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center lg:grid-cols-2">
          <Reveal className="aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full">
            <img src={interiors[2]} alt="Providence office" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal className="px-6 py-16 lg:px-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Global Presence</p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              25 offices. One standard of service.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
              Our Dubai headquarters is connected to a referral network spanning London, Geneva
              and Singapore — ensuring every listing reaches the right buyer, wherever they are
              in the world.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
