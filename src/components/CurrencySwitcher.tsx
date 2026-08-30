import { useCurrency } from '../context/CurrencyContext';
import type { Currency } from '../types';
import clsx from 'clsx';

const CURRENCIES: Currency[] = ['AED', 'USD', 'GBP', 'EUR', 'INR'];

export function CurrencySwitcher({ light = false }: { light?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      aria-label="Currency"
      className={clsx(
        'cursor-pointer border-none bg-transparent text-xs uppercase tracking-[0.14em] outline-none',
        light ? 'text-cream' : 'text-ink',
      )}
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c} className="text-ink">
          {c}
        </option>
      ))}
    </select>
  );
}
