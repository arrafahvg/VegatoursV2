import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

function PartnerCard({ partner }) {
  const Wrapper = partner.website_url ? 'a' : 'div';
  const wrapperProps = partner.website_url
    ? { href: partner.website_url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex flex-col items-center gap-5 p-10 bg-background/5 border border-background/10 rounded-3xl hover:border-primary/40 hover:bg-background/10 transition-all duration-300 h-full"
    >
      {partner.logo_url ? (
        <img
          src={partner.logo_url}
          alt={partner.name}
          className="h-28 w-auto max-w-[220px] object-contain"
        />
      ) : (
        <div className="h-28 flex items-center justify-center">
          <span className="font-serif text-3xl font-semibold text-background text-center leading-tight">
            {partner.name}
          </span>
        </div>
      )}
      <div className="text-center">
        <p className="font-semibold text-background text-lg">{partner.name}</p>
        {partner.description && (
          <p className="text-sm text-background/60 mt-1 leading-relaxed">{partner.description}</p>
        )}
      </div>
      {partner.website_url && (
        <ExternalLink className="w-4 h-4 text-background/30 group-hover:text-primary transition-colors" />
      )}
    </Wrapper>
  );
}

export default function Partners() {
  const { lang } = useLang();
  const [current, setCurrent] = useState(0);

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('publish_on_website', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  if (isLoading || partners.length === 0) return null;

  const count = partners.length;
  const useCarousel = count > 3;
  const VISIBLE = 3;

  const prev = () => setCurrent(c => (c - 1 + count) % count);
  const next = () => setCurrent(c => (c + 1) % count);

  // For carousel: get up to VISIBLE items starting from current, no wrap-around duplication
  const visiblePartners = useCarousel
    ? Array.from({ length: Math.min(VISIBLE, count) }, (_, i) => partners[(current + i) % count])
    : partners;

  // Grid cols based on count (max 3)
  const gridCols =
    count === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
    count === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-20 lg:py-28 bg-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {lang === 'id' ? 'Mitra Kami' : 'Our Partners'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-background">
              {lang === 'id' ? 'Mitra Terpercaya' : 'Trusted Partners'}
            </h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <div className="relative">
          {/* Arrows — only when carousel is active */}
          {useCarousel && (
            <>
              <button
                onClick={prev}
                className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-colors border border-background/20"
              >
                <ChevronLeft className="w-5 h-5 text-background" />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-colors border border-background/20"
              >
                <ChevronRight className="w-5 h-5 text-background" />
              </button>
            </>
          )}

          {/* Cards grid */}
          <div className={`grid gap-8 px-4 lg:px-0 ${gridCols}`}>
            {visiblePartners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <PartnerCard partner={partner} />
              </motion.div>
            ))}
          </div>

          {/* Dots — only when carousel is active */}
          {useCarousel && (
            <div className="flex justify-center gap-2 mt-10">
              {partners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-primary w-6' : 'bg-background/30 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}