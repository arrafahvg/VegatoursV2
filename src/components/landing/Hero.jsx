import React from 'react';
import { useLang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { WHATSAPP_URL } from '@/lib/constants';
import { ArrowRight, Star, MapPin, Users, Car, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_IMG = '/images/hero.jpg';

export default function Hero() {
  const { t } = useLang();
  const trustIcons = [Star, MapPin, Users];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Bali rice terraces at golden hour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase">Vegatours</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-wide">
            {t('hero.headline')}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            {t('hero.subheadline')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/packages">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium tracking-wide group"
              >
                {t('hero.cta1')}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-white/30 text-white hover:bg-white/10 hover:text-white font-medium tracking-wide"
              >
                {t('hero.cta2')}
              </Button>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Link to="/packages#fleet">
              <Button
                variant="ghost"
                className="rounded-full px-6 py-4 text-sm border border-white/20 text-white/80 hover:bg-white/10 hover:text-white font-medium tracking-wide"
              >
                {t('hero.cta3')}
                <Car className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/bike-rent">
              <Button
                variant="ghost"
                className="rounded-full px-6 py-4 text-sm border border-white/20 text-white/80 hover:bg-white/10 hover:text-white font-medium tracking-wide"
              >
                {t('hero.cta4')}
                <Bike className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {t('hero.trust').map((text, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  );
}