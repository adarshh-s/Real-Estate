import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { ROICalculator } from '../components/ROICalculator';
import { useCommunities } from '../hooks/useSanityContent';
import { formatNumber } from '../lib/format';

const FAQS = [
  {
    q: 'What is a good ROI for property in Dubai?',
    a: 'Most investors consider a gross rental yield of 6-8% strong for Dubai — well above cities like London or Singapore, where 3-4% is typical. Combined with capital appreciation, total annual returns of 8-12% are common in established communities.',
  },
  {
    q: 'What is the difference between gross yield and net yield?',
    a: 'Gross yield is your annual rental income divided by the property price. Net yield subtracts annual costs — service charges, maintenance and management fees — giving a more realistic picture of what you actually keep.',
  },
  {
    q: 'Do Dubai property investors pay capital gains tax?',
    a: 'The UAE does not levy capital gains tax or annual property tax on individual real estate investors, which is one reason net returns in Dubai often outperform equivalent-yield markets elsewhere.',
  },
  {
    q: 'How accurate is this ROI calculator?',
    a: 'It gives an indicative estimate based on the figures you enter. Actual returns depend on real achieved rent, service charge rates set by the developer, and market-driven appreciation, which is why we recommend speaking with one of our consultants before finalising an investment decision.',
  },
];

export function ROICalculatorPage() {
  const communities = useCommunities();

  useEffect(() => {
    document.title = 'Dubai Real Estate ROI Calculator | S I A Luxe Real Estate';
  }, []);

  const topYields = useMemo(
    () =>
      communities
        .filter((c) => typeof c.avgRentalYield === 'number')
        .sort((a, b) => (b.avgRentalYield ?? 0) - (a.avgRentalYield ?? 0))
        .slice(0, 6),
    [communities],
  );

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'ROI Calculator' }]} />
        <Reveal>
          <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold" /> Investment Tools
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            Dubai Real Estate ROI Calculator
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/60">
            Estimate the rental yield, annual income and total return on any Dubai property in
            seconds. Enter a purchase price and expected rent to see gross yield, net yield and
            projected capital appreciation over your chosen holding period.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-[1fr_400px] lg:px-10">
        <div className="order-2 lg:order-1">
          <Reveal>
            <h2 className="font-display text-2xl text-ink">How Dubai Property ROI Works</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              Return on a Dubai property investment comes from two sources: rental income and
              capital appreciation. Gross rental yield is your annual rent divided by the purchase
              price. Net yield subtracts annual service charges and running costs. Add expected
              appreciation over your holding period and you get a total return — the figure that
              matters most when comparing Dubai to other global property markets.
            </p>
          </Reveal>

          {topYields.length > 0 && (
            <Reveal delay={0.1} className="mt-12">
              <h2 className="font-display text-2xl text-ink">Best Rental Yields by Community</h2>
              <p className="mt-3 max-w-2xl text-sm text-ink/60">
                Estimated average rental yield across the Dubai communities we cover most closely.
              </p>
              <div className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10">
                {topYields.map((c) => (
                  <Link
                    key={c.id}
                    to={`/communities/${c.slug}`}
                    className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-cream-soft"
                  >
                    <div>
                      <p className="font-display text-base text-ink">{c.name}</p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        AED {formatNumber(c.avgPricePerSqft)} / sqft avg.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg text-gold">
                        {c.avgRentalYield?.toFixed(1)}%
                      </span>
                      <ArrowUpRight size={16} className="text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.15} className="mt-12">
            <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
            <div className="mt-6 flex flex-col divide-y divide-ink/10 border-t border-ink/10">
              {FAQS.map((f) => (
                <div key={f.q} className="py-6">
                  <h3 className="font-display text-lg text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-12 rounded-2xl border border-ink/10 bg-cream-soft p-8 text-center">
            <p className="font-display text-xl text-ink">Want a real yield estimate, not a guess?</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
              Speak with a S I A Luxe consultant for achievable rent and service charge figures on
              any property you're considering.
            </p>
            <Button to="/contact" variant="primary" className="mt-6">
              Book a Consultation
            </Button>
          </Reveal>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-28">
            <ROICalculator />
          </div>
        </aside>
      </div>
    </div>
  );
}
