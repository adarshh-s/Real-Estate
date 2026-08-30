import { useMemo, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { convert, formatPrice } from '../lib/format';

export function MortgageCalculator({ priceAED }: { priceAED: number }) {
  const { currency } = useCurrency();
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const { monthly, loanAmount } = useMemo(() => {
    const principal = priceAED * (1 - downPct / 100);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const payment =
      monthlyRate === 0 ? principal / n : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    return { monthly: payment, loanAmount: principal };
  }, [priceAED, downPct, rate, years]);

  return (
    <div className="rounded-2xl border border-ink/10 p-6">
      <h3 className="font-display text-xl text-ink">Mortgage Calculator</h3>
      <p className="mt-1 text-xs text-ink/50">Estimate only — for indicative purposes.</p>

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Down Payment</span>
            <span>{downPct}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Interest Rate</span>
            <span>{rate}%</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Loan Term</span>
            <span>{years} years</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/60">Loan Amount</span>
          <span>{formatPrice(loanAmount, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Est. Monthly Payment</span>
          <span className="font-display text-lg text-gold">
            {currency} {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(convert(monthly, currency))}
          </span>
        </div>
      </div>
    </div>
  );
}
