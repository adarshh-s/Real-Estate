import { useEffect, useMemo, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../lib/format';

interface ROICalculatorProps {
  priceAED?: number;
  monthlyRentAED?: number;
}

export function ROICalculator({ priceAED = 2_000_000, monthlyRentAED }: ROICalculatorProps) {
  const { currency } = useCurrency();

  const [price, setPrice] = useState<number | ''>(priceAED);
  const [monthlyRent, setMonthlyRent] = useState<number | ''>(() => {
    if (monthlyRentAED !== undefined) return monthlyRentAED;
    return Math.round((priceAED * 0.065) / 12);
  });

  // Track target gross yield benchmark (Dubai default 6.5%)
  const [yieldBenchmark, setYieldBenchmark] = useState<number>(() => {
    if (monthlyRentAED && priceAED > 0) {
      return Number(((monthlyRentAED * 12 / priceAED) * 100).toFixed(1));
    }
    return 6.5;
  });

  // Flag to know whether user manually customized rent
  const [isCustomRent, setIsCustomRent] = useState<boolean>(monthlyRentAED !== undefined);

  // Dubai service charge typically ranges 0.8% - 1.5% of property value (AED 12-25/sqft/yr)
  const [serviceChargePct, setServiceChargePct] = useState<number>(1.0);
  const [appreciationPct, setAppreciationPct] = useState<number>(5.0);
  const [years, setYears] = useState<number>(5);

  // Sync state if props change (e.g. navigating between listings or async data load)
  useEffect(() => {
    setPrice(priceAED);
    const initialRent = monthlyRentAED !== undefined
      ? monthlyRentAED
      : Math.round((priceAED * 0.065) / 12);
    setMonthlyRent(initialRent);

    if (monthlyRentAED !== undefined && priceAED > 0) {
      setYieldBenchmark(Number(((monthlyRentAED * 12 / priceAED) * 100).toFixed(1)));
      setIsCustomRent(true);
    } else {
      setYieldBenchmark(6.5);
      setIsCustomRent(false);
    }
  }, [priceAED, monthlyRentAED]);

  const numPrice = typeof price === 'number' ? price : 0;
  const numRent = typeof monthlyRent === 'number' ? monthlyRent : 0;

  // Handle price change: auto-scale rent unless user has explicitly customized rent
  const handlePriceChange = (val: string) => {
    if (val === '') {
      setPrice('');
      if (!isCustomRent) setMonthlyRent('');
      return;
    }
    const newPrice = Math.max(0, Number(val));
    setPrice(newPrice);
    if (!isCustomRent) {
      const benchmark = yieldBenchmark > 0 ? yieldBenchmark : 6.5;
      setMonthlyRent(Math.round((newPrice * (benchmark / 100)) / 12));
    }
  };

  // Handle rent change: flag custom rent and update yield benchmark
  const handleRentChange = (val: string) => {
    if (val === '') {
      setMonthlyRent('');
      return;
    }
    const newRent = Math.max(0, Number(val));
    setMonthlyRent(newRent);
    setIsCustomRent(true);
    if (numPrice > 0) {
      const derivedYield = Number(((newRent * 12 / numPrice) * 100).toFixed(1));
      setYieldBenchmark(derivedYield);
    }
  };

  // Preset yields for quick selection
  const handleYieldPreset = (pct: number) => {
    setYieldBenchmark(pct);
    setIsCustomRent(false);
    if (numPrice > 0) {
      setMonthlyRent(Math.round((numPrice * (pct / 100)) / 12));
    }
  };

  const result = useMemo(() => {
    const annualRent = numRent * 12;
    const grossYield = numPrice > 0 ? (annualRent / numPrice) * 100 : 0;

    // Annual service charge & operating expenses
    const annualServiceCharge = numPrice * (serviceChargePct / 100);
    const netAnnualIncome = annualRent - annualServiceCharge;
    const netYield = numPrice > 0 ? (netAnnualIncome / numPrice) * 100 : 0;

    // Capital appreciation over holding period
    const futureValue = numPrice * Math.pow(1 + appreciationPct / 100, years);
    const capitalGain = futureValue - numPrice;

    // Cumulative net rental income over holding period
    const totalRentalIncome = netAnnualIncome * years;

    // Total net return (capital growth + net rental income)
    const totalReturn = capitalGain + totalRentalIncome;
    const totalROIPct = numPrice > 0 ? (totalReturn / numPrice) * 100 : 0;

    // Annualized return (Compound Annual Growth Rate - CAGR)
    const annualizedROIPct =
      numPrice > 0 && years > 0 && 1 + totalReturn / numPrice > 0
        ? (Math.pow(1 + totalReturn / numPrice, 1 / years) - 1) * 100
        : 0;

    // Dubai Acquisition Costs
    const dldFee = numPrice * 0.04; // 4% DLD fee
    const brokerFee = numPrice * 0.021; // 2% agency fee + 5% VAT
    const adminFee = numPrice > 0 ? 4200 : 0; // DLD trustee fee
    const totalAcquisitionCost = numPrice + dldFee + brokerFee + adminFee;

    return {
      grossYield,
      netYield,
      annualRent,
      annualServiceCharge,
      netAnnualIncome,
      futureValue,
      capitalGain,
      totalRentalIncome,
      totalReturn,
      totalROIPct,
      annualizedROIPct,
      dldFee,
      brokerFee,
      adminFee,
      totalAcquisitionCost,
    };
  }, [numPrice, numRent, serviceChargePct, appreciationPct, years]);

  return (
    <div className="rounded-2xl border border-ink/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl text-ink">ROI Calculator</h3>
          <p className="mt-1 text-xs text-ink/50">Estimate returns tailored to Dubai market benchmarks.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {/* Property Price Input */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <label className="text-ink/60">Property Price (AED)</label>
            {currency !== 'AED' && numPrice > 0 && (
              <span className="text-ink/40">≈ {formatPrice(numPrice, currency)}</span>
            )}
          </div>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="e.g. 2,000,000"
            className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        {/* Expected Monthly Rent Input */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <label className="text-ink/60">Expected Monthly Rent (AED)</label>
            {currency !== 'AED' && numRent > 0 && (
              <span className="text-ink/40">≈ {formatPrice(numRent, currency)}/mo</span>
            )}
          </div>
          <input
            type="number"
            min={0}
            value={monthlyRent}
            onChange={(e) => handleRentChange(e.target.value)}
            placeholder="e.g. 11,000"
            className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
          />

          {/* Quick Yield Benchmark Presets */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="text-ink/50">
              Gross Yield: <strong className="font-medium text-ink">{result.grossYield.toFixed(1)}%</strong>
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleYieldPreset(5.5)}
                className={`rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                  Math.abs(result.grossYield - 5.5) < 0.2
                    ? 'bg-gold text-white font-medium'
                    : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
                title="5.5% Prime Dubai Areas (Downtown, Palm)"
              >
                5.5% Prime
              </button>
              <button
                type="button"
                onClick={() => handleYieldPreset(6.5)}
                className={`rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                  Math.abs(result.grossYield - 6.5) < 0.2
                    ? 'bg-gold text-white font-medium'
                    : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
                title="6.5% Dubai Market Average"
              >
                6.5% Benchmark
              </button>
              <button
                type="button"
                onClick={() => handleYieldPreset(8.0)}
                className={`rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                  Math.abs(result.grossYield - 8.0) < 0.2
                    ? 'bg-gold text-white font-medium'
                    : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
                title="8.0% High Yield Communities (JVC, Arjan)"
              >
                8.0% High Yield
              </button>
            </div>
          </div>
        </div>

        {/* Service Charges Slider */}
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Annual Service Charges</span>
            <span>
              {serviceChargePct.toFixed(1)}% ({formatPrice(result.annualServiceCharge, currency)}/yr)
            </span>
          </div>
          <input
            type="range"
            min={0.4}
            max={2.5}
            step={0.1}
            value={serviceChargePct}
            onChange={(e) => setServiceChargePct(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
          <p className="mt-1 text-[11px] text-ink/40">
            Dubai standard: 0.8% to 1.5% of value (approx. AED 12 to 25/sqft)
          </p>
        </div>

        {/* Capital Appreciation Slider */}
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Expected Annual Appreciation</span>
            <span>{appreciationPct.toFixed(1)}% / year</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={appreciationPct}
            onChange={(e) => setAppreciationPct(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
          <p className="mt-1 text-[11px] text-ink/40">
            Dubai prime historical average: 4% to 8% / year
          </p>
        </div>

        {/* Holding Period Slider */}
        <div>
          <div className="flex justify-between text-xs text-ink/60">
            <span>Holding Period</span>
            <span>{years} {years === 1 ? 'year' : 'years'}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-black"
          />
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Gross Rental Yield</span>
          <span className="font-medium text-ink">{result.grossYield.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Net Rental Yield</span>
          <span className="font-medium text-ink">{result.netYield.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Est. Annual Net Income</span>
          <span className="font-medium text-ink">{formatPrice(result.netAnnualIncome, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Est. Value After {years} {years === 1 ? 'Year' : 'Years'}</span>
          <span className="font-medium text-ink">{formatPrice(result.futureValue, currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Total Net Rent ({years} {years === 1 ? 'yr' : 'yrs'})</span>
          <span className="font-medium text-ink">+{formatPrice(result.totalRentalIncome, currency)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-ink/10 pt-3">
          <div>
            <span className="font-medium text-ink">Total ROI ({years} {years === 1 ? 'Year' : 'Years'})</span>
            <p className="text-[11px] text-ink/40">Capital appreciation + net rental income</p>
          </div>
          <span className="font-display text-2xl text-gold">+{result.totalROIPct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink/50">Annualized Return (CAGR)</span>
          <span className="font-medium text-ink/70">{result.annualizedROIPct.toFixed(1)}% / year</span>
        </div>
      </div>

      {/* Dubai Purchase Costs Accordion */}
      {numPrice > 0 && (
        <details className="mt-5 rounded-xl border border-ink/10 bg-cream/40 p-3 text-xs text-ink/70 group">
          <summary className="cursor-pointer font-medium text-ink transition-colors hover:text-gold flex items-center justify-between">
            <span>Dubai Upfront Purchase Fees (4% DLD + 2% Broker)</span>
            <span className="text-[11px] text-ink/40 group-open:hidden">+ View</span>
          </summary>
          <div className="mt-2.5 space-y-1.5 border-t border-ink/10 pt-2 text-[11px]">
            <div className="flex justify-between">
              <span>Dubai Land Dept. (DLD) Fee (4%)</span>
              <span>{formatPrice(result.dldFee, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Agency Commission (2% + VAT)</span>
              <span>{formatPrice(result.brokerFee, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>DLD Admin & Trustee Fee</span>
              <span>{formatPrice(result.adminFee, currency)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-1.5 font-medium text-ink">
              <span>Total Initial Capital Outlay</span>
              <span>{formatPrice(result.totalAcquisitionCost, currency)}</span>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
