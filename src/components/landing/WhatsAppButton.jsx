import React from 'react';
import { WHATSAPP_URL } from '@/lib/constants';
import { useLang } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const { t } = useLang();

  return (
    <>
      {/* Desktop floating button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
          <MessageCircle className="w-5 h-5 relative z-10" />
        </div>
        <span className="text-sm font-medium">{t('whatsapp.cta')}</span>
      </a>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-md border-t border-border/50 px-4 py-3 flex items-center gap-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full font-medium text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          {t('whatsapp.mobileCta')}
        </a>
      </div>
    </>
  );
}