import React from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';

const fallbackImages = [
  '/images/destination-1.jpg',
  '/images/destination-2.jpg',
  '/images/destination-3.jpg',
  '/images/destination-4.jpg',
  '/images/destination-5.jpg',
  '/images/destination-6.jpg',
];

export default function Destinations() {
  const { t, lang } = useLang();

  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      // Try with is_featured filter first (requires migration 005 to be applied)
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('is_featured', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (e) {
        console.warn('is_featured filter failed, falling back to all destinations:', e.message);
      }
      // Fallback: if is_featured column doesn't exist yet, fetch all destinations
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const i18nItems = t('destinations.items');
  const hasManaged = destinations && destinations.length > 0;

  const items = hasManaged
    ? destinations.map((d) => ({
        name: (lang === 'id' && d.name_id) ? d.name_id : d.name_en,
        desc: (lang === 'id' && d.desc_id) ? d.desc_id : d.desc_en,
        image: d.image_url,
      }))
    : i18nItems.map((item, i) => ({ ...item, image: fallbackImages[i] }));

  return (
    <section id="destinations" className="py-20 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('destinations.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('destinations.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="block group relative rounded-2xl overflow-hidden aspect-[3/4]"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white font-light mb-1">{item.name}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}