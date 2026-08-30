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

export function generateId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
