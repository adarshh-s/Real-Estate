import type { Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, number> = {
  AED: 1,
  USD: 0.2723,
  GBP: 0.2143,
  EUR: 0.2508,
  INR: 22.9,
};

export const CURRENCY_LOCALE: Record<Currency, string> = {
  AED: 'en-AE',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
  INR: 'en-IN',
};

export function convert(amountAED: number, currency: Currency): number {
  return amountAED * CURRENCY_RATES[currency];
}

export function formatPrice(amountAED: number, currency: Currency = 'AED'): string {
  const value = convert(amountAED, currency);
  const formatted = new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    maximumFractionDigits: 0,
  }).format(value);
  return `${currency} ${formatted}`;
}

export function formatCompactAED(amountAED: number): string {
  if (amountAED >= 1_000_000) {
    return `AED ${(amountAED / 1_000_000).toFixed(amountAED % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (amountAED >= 1_000) {
    return `AED ${Math.round(amountAED / 1000)}K`;
  }
  return `AED ${amountAED}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
