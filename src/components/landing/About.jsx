import React from 'react';
import { useLang } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Check, Package, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ABOUT_IMG = '/images/about.jpg';

export default function About() {
  const { t, lang } = useLang();

  return (
    <section id="about" className="py-20 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <img src={ABOUT_IMG} alt="Bali landscape" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Vega Bali Tours</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-foreground mb-6">{t('about.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg font-light">
              {t('about.text')}
            </p>
            <div className="space-y-3 mb-10">
              {t('about.highlights').map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80 text-sm font-medium">{h}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/packages"
                className="group flex items-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <Package className="w-4 h-4" />
                {lang === 'id' ? 'Lihat Paket Tur' : 'View Tour Packages'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/packages#fleet"
                onClick={() => setTimeout(() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)}
                className="group flex items-center gap-3 px-6 py-3.5 bg-transparent border border-border text-foreground rounded-full font-medium text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <Car className="w-4 h-4" />
                {lang === 'id' ? 'Jelajahi Armada' : 'Explore Our Fleet'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}