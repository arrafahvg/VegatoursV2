// Local logo image served from public/images/
export const LOGO_URL = '/images/logo.png';
export const WHATSAPP_URL = 'https://wa.me/62896461000';
export const WHATSAPP_MESSAGE_URL = (msg) => `https://wa.me/62896461000?text=${encodeURIComponent(msg)}`;

// Send a WhatsApp message to a specific phone number (customer).
// Normalizes Indonesian formats: 0812... -> 62812..., +62812... -> 62812...
export const whatsappSendTo = (phone, msg) => {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.length > 0 && !digits.startsWith('62')) digits = '62' + digits;
  const text = encodeURIComponent(msg);
  return `https://wa.me/${digits}?text=${text}`;
};