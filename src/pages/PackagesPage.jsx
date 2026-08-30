import React, { useEffect, useState } from 'react';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { WHATSAPP_MESSAGE_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Clock, MapPin, Star, ArrowRight, Users, CheckCircle, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import PackageDetailModal from '@/components/landing/PackageDetailModal';
import FleetDetailModal from '@/components/landing/FleetDetailModal';

function PackagesContent() {
  const { t, lang } = useLang();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const { data: packages, isLoading: loadingPkgs } = useQuery({
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

  const { data: fleet, isLoading: loadingFleet } = useQuery({
    queryKey: ['fleet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
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
              {lang === 'id' ? 'Paket & Armada' : 'Packages & Fleet'}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              {lang === 'id' ? 'Pilih Perjalanan Anda' : 'Choose Your Journey'}
            </h1>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              {lang === 'id'
                ? 'Paket tur pilihan tangan kami & armada kendaraan nyaman untuk perjalanan Bali yang sempurna.'
                : 'Our handcrafted tour packages & comfortable vehicle fleet for the perfect Bali experience.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-10">
            {lang === 'id' ? 'Paket Tur' : 'Tour Packages'}
          </h2>

          {loadingPkgs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/50">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
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
                        <img src={pkg.image_url} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {pkg.is_popular && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 rounded-full px-3 py-1">
                          <Star className="w-3 h-3 mr-1" /> {t('packages.popular')}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-xl font-medium text-foreground mb-2">{title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>}
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
                        <p className="text-lg font-semibold text-foreground mb-4">
                          {pkg.price}
                          <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPkg(pkg)}
                            className="rounded-full gap-1.5 flex-shrink-0"
                          >
                            <Info className="w-3.5 h-3.5" />
                            {lang === 'id' ? 'Lihat Detail' : 'See Details'}
                          </Button>
                          <a href={WHATSAPP_MESSAGE_URL(`Hi! I'm interested in the ${pkg.title_en} package.`)} target="_blank" rel="noopener noreferrer" className="flex-1">
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

      {/* Fleet */}
      <section id="fleet" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-2">
            {lang === 'id' ? 'Armada Kendaraan' : 'Our Fleet'}
          </h2>
          <p className="text-muted-foreground mb-10">
            {lang === 'id' ? 'Kendaraan bersih, nyaman, dan ber-AC untuk perjalanan Anda' : 'Clean, comfortable, air-conditioned vehicles for your journey'}
          </p>

          {loadingFleet ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : fleet.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Toyota Avanza / Xenia', type: 'MPV', capacity: 6, features: ['AC', 'Private Driver', 'Comfortable Seats'] },
                { name: 'Toyota Innova', type: 'SUV', capacity: 7, features: ['AC', 'Private Driver', 'Spacious Luggage'] },
                { name: 'Hiace / Elf', type: 'Minibus', capacity: 12, features: ['AC', 'Private Driver', 'Group Travel'] },
              ].map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-background border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary tracking-widest uppercase">{v.type}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-3.5 h-3.5" /> {v.capacity} pax</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground mb-4">{v.name}</h3>
                  <div className="space-y-1.5">
                    {v.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleet.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group bg-background border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all flex flex-col">
                  {v.image_url && <img src={v.image_url} alt={v.name} className="w-full h-40 object-cover" />}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      {v.type && <span className="text-xs font-semibold text-primary tracking-widest uppercase">{v.type}</span>}
                      {v.capacity && <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-3.5 h-3.5" /> {v.capacity} pax</span>}
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground mb-2">{v.name}</h3>
                    {v.price && (
                      <p className="text-base font-semibold text-foreground mb-3">
                        {formatPrice(v.price)}
                        <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
                      </p>
                    )}
                    {v.features?.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {v.features.slice(0, 2).map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                          </div>
                        ))}
                        {v.features.length > 2 && <p className="text-xs text-muted-foreground pl-5">+{v.features.length - 2} more...</p>}
                      </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-border/50 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicle(v)}
                        className="rounded-full gap-1.5 w-full"
                      >
                        <Info className="w-3.5 h-3.5" />
                        {lang === 'id' ? 'Lihat Detail' : 'See Details'}
                      </Button>
                      <a
                        href={WHATSAPP_MESSAGE_URL(
                          lang === 'id'
                            ? `Halo, saya ingin memesan armada ${v.name}. Apakah tersedia?`
                            : `Hello, I'd like to book the ${v.name}. Is it available?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="rounded-full gap-1.5 w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {lang === 'id' ? 'Pesan Armada Ini' : 'Book This Fleet'}
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      <PackageDetailModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} />
      <FleetDetailModal vehicle={selectedVehicle} open={!!selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </div>
  );
}

export default function PackagesPage() {
  return (
    <LanguageProvider>
      <PackagesContent />
    </LanguageProvider>
  );
}