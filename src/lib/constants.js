// Local logo image served from public/images/
export const LOGO_URL = '/images/logo.png';

// Hard-coded fallback WhatsApp number.  The live number is managed in the
// `site_settings` table (key: `whatsapp_number`) via AdminSettings and read
// at runtime through the `useSiteSettings` hook.  These exports remain as a
// fallback so that code that hasn't been migrated yet still works.
export const WHATSAPP_FALLBACK_NUMBER = '62896461000';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_FALLBACK_NUMBER}`;
export const WHATSAPP_MESSAGE_URL = (msg) => `https://wa.me/${WHATSAPP_FALLBACK_NUMBER}?text=${encodeURIComponent(msg)}`;

// Build the canonical wa.me URL for an arbitrary phone number.
export const formatWhatsAppUrl = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.length > 0 && !digits.startsWith('62')) digits = '62' + digits;
  return `https://wa.me/${digits}`;
};

// Build a wa.me URL with an encoded pre-filled message for an arbitrary phone.
export const formatWhatsAppMessageUrl = (phone, msg) => {
  const base = formatWhatsAppUrl(phone);
  return `${base}?text=${encodeURIComponent(msg || '')}`;
};

// Format a phone number for display, e.g. 62896461000 -> +62 896 461 000
export const formatWhatsAppDisplay = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.length > 0 && !digits.startsWith('62')) digits = '62' + digits;
  if (!digits) return '';
  // Insert spaces every 3 digits after the country code
  const code = digits.slice(0, 2);
  const rest = digits.slice(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `+${code} ${rest}`;
};

// Send a WhatsApp message to a specific phone number (customer).
// Normalizes Indonesian formats: 0812... -> 62812..., +62812... -> 62812...
export const whatsappSendTo = (phone, msg) => {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.length > 0 && !digits.startsWith('62')) digits = '62' + digits;
  const text = encodeURIComponent(msg);
  return `https://wa.me/${digits}?text=${text}`;
};