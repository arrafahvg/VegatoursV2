import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { WHATSAPP_FALLBACK_NUMBER, formatWhatsAppMessageUrl, formatWhatsAppUrl } from '@/lib/constants';

/**
 * Hook that loads site-wide settings from the `site_settings` table.
 *
 * The WhatsApp number is managed by admins via AdminSettings (which writes to
 * the `site_settings` table with key `whatsapp_number`).  Previously the public
 * pages used a hard-coded number from constants.js, so changing the setting in
 * the admin panel never propagated.  This hook bridges that gap: every WhatsApp
 * button / link now reads the live number from Supabase (falling back to the
 * hard-coded constant when the setting is absent or the query fails).
 */
export const useSiteSettings = () => {
  const { data: settingsRows } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
    // The AuthProvider already loads these settings for auth-flow decisions;
    // reuse the same query key so there's a single network request.
    staleTime: 1000 * 60 * 5,
  });

  const settings = {};
  settingsRows.forEach((s) => {
    settings[s.key] = s.value;
  });

  const whatsappNumber = settings.whatsapp_number || WHATSAPP_FALLBACK_NUMBER;

  return {
    settings,
    whatsappNumber,
    whatsappUrl: formatWhatsAppUrl(whatsappNumber),
    // Convenience wrapper – builds the full wa.me URL with encoded message text
    getWhatsappMessageUrl: (msg) => formatWhatsAppMessageUrl(whatsappNumber, msg),
  };
};
