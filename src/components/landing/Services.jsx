import React from 'react';
import { useLang } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { Map, Compass, Car, Sun, Mountain, Sunset, Palmtree, Handshake } from 'lucide-react';

const icons = [Map, Compass, Car, Sun, Mountain, Sunset, Palmtree, Handshake];

export default function Services() {
  const { t } = useLang();
  const { whatsappUrl } = useSiteSettings();
  const items = t('services.items');

  return (
    <section id="services" className="py-20 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('services.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('services.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <a
                                    href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}