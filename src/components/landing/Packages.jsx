import React, { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { WHATSAPP_MESSAGE_URL } from '@/lib/constants';
import { Clock, MapPin, Star, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PriceDisplay from '@/components/PriceDisplay';
import ImageViewer from '@/components/ImageViewer';
import { Skeleton } from '@/components/ui/skeleton';
import PackageDetailModal from './PackageDetailModal';

export default function Packages() {
  const { t, lang } = useLang();
  const [selectedPkg, setSelectedPkg] = useState(null);

  const { data: packages, isLoading } = useQuery({
    queryKey: ['tourPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  return (
    <section id="packages" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('packages.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('packages.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/50">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              const title = lang === 'id' && pkg.title_id ? pkg.title_id : pkg.title_en;
              const duration = lang === 'id' && pkg.duration_id ? pkg.duration_id : pkg.duration_en;
              const highlights = lang === 'id' && pkg.highlights_id?.length ? pkg.highlights_id : (pkg.highlights_en || []);
              const ctaText = lang === 'id' && pkg.cta_text_id ? pkg.cta_text_id : (pkg.cta_text_en || t('packages.bookCta'));

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    {pkg.image_url && (
                      <ImageViewer
                        src={pkg.image_url}
                        alt={title}
                        imgClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    {pkg.is_popular && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 rounded-full px-3 py-1">
                        <Star className="w-3 h-3 mr-1" /> {t('packages.popular')}
                      </Badge>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2">{title}</h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {duration}
                        </span>
                      )}
                    </div>

                    {highlights.slice(0, 3).length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {highlights.slice(0, 3).map((h, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                        {highlights.length > 3 && (
                          <p className="text-xs text-muted-foreground pl-5">+{highlights.length - 3} more...</p>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-border/50 mt-auto">
                      <p className="text-xs text-muted-foreground mb-1">{t('packages.startingFrom')}</p>
                      <PriceDisplay price={pkg.price} priceMax={pkg.price_max} priceDiscount={pkg.price_discount} className="text-lg mb-4" />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => setSelectedPkg(pkg)}
                          className="rounded-full gap-1.5 font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0"
                        >
                          <Info className="w-4 h-4" />
                          {lang === 'id' ? 'Lihat Detail' : 'See Details'}
                        </Button>
                        <a
                          href={WHATSAPP_MESSAGE_URL(`Hi! I'm interested in the ${pkg.title_en} package.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full group/btn">
                            {ctaText}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <PackageDetailModal
        pkg={selectedPkg}
        open={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
      />
    </section>
  );
}