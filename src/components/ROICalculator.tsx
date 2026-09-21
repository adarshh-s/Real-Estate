import { useMemo, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { convert } from '../lib/format';

function fmt(currency: string, n: number) {
  return `${currency} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
}

export function ROICalculator({ priceAED = 2_000_000, monthlyRentAED }: { priceAED?: number; monthlyRentAED?: number }) {
  const { currency } = useCurrency();
  const [price, setPrice] = useState(priceAED);
  const [monthlyRent, setMonthlyRent] = useState(monthlyRentAED ?? Math.round((priceAED * 0.06) / 12));
  const [serviceChargePct, setServiceChargePct] = useState(3);
  const [appreciationPct, setAppreciationPct] = useState(5);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
    const annualServiceCharge = price * (serviceChargePct / 100);
    const netAnnualIncome = annualRent - annualServiceCharge;
    const netYield = price > 0 ? (netAnnualIncome / price) * 100 : 0;
    const futureValue = price * Math.pow(1 + appreciationPct / 100, years);
    const capitalGain = futureValue - price;
    const totalRentalIncome = netAnnualIncome * years;
    const totalReturn = capitalGain + totalRentalIncome;
    const totalROIPct = price > 0 ? (totalReturn / price) * 100 : 0;
    const avgAnnualROIPct = totalROIPct / years;
    return { grossYield, netYield, netAnnualIncome, futureValue, totalReturn, totalROIPct, avgAnnualROIPct };
  }, [price, monthlyRent, serviceChargePct, appreciationPct, years]);

  return (
    <div className="rounded-2xl border border-ink/10 p-6">
      <h3 className="font-display text-xl text-ink">ROI Calculator</h3>
      <p className="mt-1 text-xs text-ink/50">Estimate only — actual returns vary with market conditions.</p>

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-xs text-ink/60">Property Price (AED)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink/60">Expected Monthly Rent (AED)</label>
          <input
            type="number"
            min={0}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Annual Service Charges</span>
            <span>{serviceChargePct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={6}
            step={0.5}
            value={serviceChargePct}
            onChange={(e) => setServiceChargePct(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Expected Annual Appreciation</span>
            <span>{appreciationPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={appreciationPct}
            onChange={(e) => setAppreciationPct(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Holding Period</span>
            <span>{years} {years === 1 ? 'year' : 'years'}</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/60">Gross Rental Yield</span>
          <span>{result.grossYield.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Net Rental Yield</span>
          <span>{result.netYield.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Est. Annual Net Income</span>
          <span>{fmt(currency, convert(result.netAnnualIncome, currency))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Est. Value After {years} {years === 1 ? 'Year' : 'Years'}</span>
          <span>{fmt(currency, convert(result.futureValue, currency))}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-ink/60">Total ROI Over {years} {years === 1 ? 'Year' : 'Years'}</span>
          <span className="font-display text-lg text-gold">{result.totalROIPct.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-ink/40">Avg. Annual Return</span>
          <span className="text-ink/40">{result.avgAnnualROIPct.toFixed(1)}% / year</span>
        </div>
      </div>
    </div>
  );
}
