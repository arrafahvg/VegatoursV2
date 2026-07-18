import React from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function Gallery() {
  const { t, lang } = useLang();
  const { data: images, isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: []
  });

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('gallery.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('gallery.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        {isLoading ?
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div> :
        images.length === 0 ?
        <p className="text-center text-muted-foreground">No gallery images yet.</p> :

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {images.map((img, i) =>
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-square rounded-xl overflow-hidden">
            
                <img
              src={img.image_url}
              alt={lang === 'id' && img.caption_id ? img.caption_id : img.caption_en || 'Bali'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
                {(img.caption_en || img.caption_id) &&
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end rounded">
                    <p className="text-white text-sm px-4 pb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {lang === 'id' && img.caption_id ? img.caption_id : img.caption_en}
                    </p>
                  </div>
            }
              </motion.div>
          )}
          </div>
        }
      </div>
    </section>);

}