import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_URL, LOGO_URL } from '@/lib/constants';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = ['services', 'packages', 'destinations', 'gallery', 'about', 'contact'];

export default function Navbar({ solid = false }) {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSolid = solid || scrolled;

  const navigate = useNavigate();

  const scrollTo = (id) => {
    setMobileOpen(false);
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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={LOGO_URL}
                alt="Vegatours"
                className={`h-14 lg:h-16 w-auto object-contain rounded-lg transition-all duration-300 ${isSolid ? '' : 'brightness-0 invert'}`}
              />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link === 'packages' ? (
                  <Link
                    key={link}
                    to="/packages"
                    className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                      isSolid ? 'text-foreground/70' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t(`nav.${link}`)}
                  </Link>
                ) : (
                  <button
                    key={link}
                    onClick={() => scrollTo(link)}
                    className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                      isSolid ? 'text-foreground/70' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t(`nav.${link}`)}
                  </button>
                )
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLang}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                  isSolid
                    ? 'border-border text-foreground hover:bg-secondary'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'en' ? 'ID' : 'EN'}
              </button>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hidden lg:block">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 font-medium text-sm">
                  {t('whatsapp.cta')}
                </Button>
              </a>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 ${isSolid ? 'text-foreground' : 'text-white'}`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 lg:hidden bg-card/98 backdrop-blur-lg pt-20"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {navLinks.map((link) => (
                link === 'packages' ? (
                  <Link
                    key={link}
                    to="/packages"
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    {t(`nav.${link}`)}
                  </Link>
                ) : (
                  <button
                    key={link}
                    onClick={() => scrollTo(link)}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    {t(`nav.${link}`)}
                  </button>
                )
              ))}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-4">
                <Button className="bg-primary text-primary-foreground rounded-full px-8 py-3 text-base">
                  {t('whatsapp.cta')}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}