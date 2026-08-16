import React, { useEffect, useState } from 'react';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { WHATSAPP_MESSAGE_URL } from '@/lib/constants';
import { ArrowRight, CheckCircle, Info, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import BikeDetailModal from '@/components/landing/BikeDetailModal';

function BikeRentContent() {
  const { lang } = useLang();
  const [selectedBike, setSelectedBike] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const { data: bikes, isLoading } = useQuery({
    queryKey: ['bikes'],
    queryFn: async () => {
      // Prefer filtering available bikes server-side (requires migration 007).
      try {
        const { data, error } = await supabase
          .from('bikes')
          .select('*')
          .eq('is_available', true)
          .order('sort_order', { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.warn('is_available filter failed, falling back to client-side filter:', e.message);
      }
      // Fallback: the is_available column may not exist yet — fetch all and filter now.
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((b) => b.is_available !== false);
    },
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar solid />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {lang === 'id' ? 'Sewa Motor' : 'Bike Rental'}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              {lang === 'id' ? 'Pilih Motor Anda' : 'Choose Your Ride'}
            </h1>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              {lang === 'id'
                ? 'Motor berkualitas, terawat, dan siap menemani perjalanan Bali Anda.'
                : 'Quality, well-maintained motorcycles ready for your Bali adventure.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bike Listings */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-10">
            {lang === 'id' ? 'Motor Tersedia' : 'Available Bikes'}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/50">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : bikes.length === 0 ? (
            <div className="text-center py-12 max-w-lg mx-auto">
              <p className="font-serif text-xl sm:text-2xl font-light text-foreground mb-3">
                {lang === 'id' ? 'Saat ini belum ada motor yang tersedia' : 'No bikes are currently available'}
              </p>
              <p className="text-muted-foreground mb-6">
                {lang === 'id'
                  ? 'Silakan hubungi kami untuk informasi ketersediaan terbaru.'
                  : 'Please contact us for the latest availability.'}
              </p>
              <a
                href={WHATSAPP_MESSAGE_URL("Hi! I'd like to check the current bike availability.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  {lang === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikes.map((bike, i) => {
                const ctaText = lang === 'id' ? 'Sewa Sekarang' : 'Rent Now';
                return (
                  <motion.div
                    key={bike.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {bike.image_url && (
                        <img src={bike.image_url} alt={bike.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        {bike.type && (
                          <span className="text-xs font-semibold text-primary tracking-widest uppercase">{bike.type}</span>
                        )}
                        {bike.capacity && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bike className="w-3.5 h-3.5" /> {bike.capacity}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-medium text-foreground mb-2">{bike.name}</h3>
                      {bike.price && (
                        <p className="text-base font-semibold text-foreground mb-3">
                          {bike.price}
                          <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
                        </p>
                      )}
                      {bike.features?.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {bike.features.slice(0, 2).map((f, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                            </div>
                          ))}
                          {bike.features.length > 2 && <p className="text-xs text-muted-foreground pl-5">+{bike.features.length - 2} more...</p>}
                        </div>
                      )}
                      <div className="pt-4 border-t border-border/50 mt-auto">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBike(bike)}
                            className="rounded-full gap-1.5 flex-shrink-0"
                          >
                            <Info className="w-3.5 h-3.5" />
                            {lang === 'id' ? 'Lihat Detail' : 'See Details'}
                          </Button>
                          <a href={WHATSAPP_MESSAGE_URL(`Hi! I'm interested in renting the ${bike.name} (${bike.type || ''}).`)} target="_blank" rel="noopener noreferrer" className="flex-1">
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
      </section>

      <Footer />
      <WhatsAppButton />

      <BikeDetailModal bike={selectedBike} open={!!selectedBike} onClose={() => setSelectedBike(null)} />
    </div>
  );
}

export default function BikeRentPage() {
  return (
    <LanguageProvider>
      <BikeRentContent />
    </LanguageProvider>
  );
}