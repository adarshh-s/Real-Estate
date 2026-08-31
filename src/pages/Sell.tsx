import { useState, type FormEvent } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { useCommunities } from '../hooks/useSanityContent';
import { exteriors } from '../lib/images';

const STEPS = [
  { title: 'Private Consultation', body: 'A partner-level consultant visits your property to understand its story and your objectives.' },
  { title: 'Data-Led Valuation', body: 'We benchmark against verified, real-time comparable transactions to price with precision.' },
  { title: 'Discreet Marketing', body: 'Your listing is placed in front of our verified buyer network before it ever appears publicly.' },
  { title: 'Negotiation & Close', body: 'Your consultant manages every offer, negotiation and closing detail on your behalf.' },
];

export function Sell() {
  const communities = useCommunities();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Sell With Us' }]} />
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
          Request a Complimentary Valuation
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          Whether you’re considering a sale this year or exploring your options, our partners
          provide a discreet, data-backed valuation with no obligation.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-2 lg:px-10">
        <div className="order-2 lg:order-1">
          <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
            <img src={exteriors[6]} alt="Sell with Sialuxe" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {submitted ? (
            <div className="flex h-full flex-col justify-center border border-ink/10 p-8 text-center">
              <p className="font-display text-2xl text-gold">Thank you</p>
              <p className="mt-3 text-sm text-ink/60">
                A Sialuxe partner will contact you within one business day to schedule your
                valuation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" required />
                <Field label="Phone Number" type="tel" required />
              </div>
              <Field label="Email Address" type="email" required />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">
                    Community
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="" disabled>
                      Select community
                    </option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Property Reference (optional)" required={false} />
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Tell us about your property
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-full border border-ink bg-ink py-3.5 text-xs uppercase tracking-[0.16em] text-cream transition-all active:scale-[0.98] hover:bg-cream hover:text-ink"
              >
                Request Valuation
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="bg-cream-soft py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading kicker="How It Works" title="Selling With Sialuxe" align="center" />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <p className="font-display text-3xl text-gold">0{i + 1}</p>
                <h3 className="mt-3 font-display text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  required = true,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">{label}</label>
      <input
        type={type}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
