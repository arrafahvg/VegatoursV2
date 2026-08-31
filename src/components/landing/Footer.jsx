import React from 'react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { useLang } from '@/lib/i18n';
import { formatWhatsAppDisplay, LOGO_URL } from '@/lib/constants';
import { Globe, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = ['services', 'packages', 'destinations', 'gallery', 'about', 'contact'];

export default function Footer() {
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const { whatsappUrl, whatsappNumber } = useSiteSettings();

  const scrollTo = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img
              src={LOGO_URL}
              alt="Vegatours"
              className="h-20 w-auto object-contain rounded-lg brightness-0 invert"
            />
            <p className="mt-4 text-background/60 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </a>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-4 h-10 rounded-full bg-background/10 hover:bg-primary/20 transition-colors text-xs font-semibold tracking-wider"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Bahasa Indonesia' : 'English'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background text-sm uppercase tracking-widest mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-2.5">
              {navLinks.map(link => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="block text-sm text-background/60 hover:text-primary transition-colors"
                >
                  {t(`nav.${link}`)}
                </button>
              ))}
              <Link
                to="/team"
                className="block text-sm text-background/60 hover:text-primary transition-colors"
              >
                {lang === 'id' ? 'Tim Kami' : 'Meet Our Team'}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background text-sm uppercase tracking-widest mb-4">{t('footer.getInTouch')}</h4>
            <div className="space-y-3 text-sm text-background/60">
              <p>Bali, Indonesia</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                {whatsappNumber ? formatWhatsAppDisplay(whatsappNumber) : '+62 896 461 000'}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/40">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}