import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = window.self !== window.top;

// Format a numeric price as Rp1,500,000,- (falls back to the raw value when
// the stored price is a non-numeric legacy string like "IDR 1,400,000").
export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return '';
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  return `Rp${n.toLocaleString('en-US')},-`;
}

// Format a price with an optional upper bound as a range,
// e.g. "Rp420,000,- – Rp820,000,-". Falls back to a single price.
export function formatPriceRange(price, priceMax) {
  const min = formatPrice(price);
  const hasMax = priceMax !== null && priceMax !== undefined && priceMax !== '';
  const max = hasMax ? formatPrice(priceMax) : '';
  if (min && max && min.startsWith('Rp') && max.startsWith('Rp') && min !== max) {
    return `${min} – ${max}`;
  }
  return min;
}

// Whether a fleet item should show a discounted price with the original struck
// through. Only applies when there's a single price (no range) and the discount
// is a valid, lower numeric value.
export function hasPriceDiscount(price, priceDiscount, priceMax) {
  const hasMax = priceMax !== null && priceMax !== undefined && priceMax !== '';
  if (hasMax) return false;
  const p = Number(price);
  const d = Number(priceDiscount);
  if (Number.isNaN(p) || priceDiscount === null || priceDiscount === undefined || priceDiscount === '') return false;
  if (Number.isNaN(d)) return false;
  return d < p;
}

export function generateId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
