import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import PriceDisplay from '@/components/PriceDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ArrowLeft, MapPin, Users, Bike, Car, Compass, Info } from 'lucide-react';
import PackageDetailModal from '@/components/landing/PackageDetailModal';
import FleetDetailModal from '@/components/landing/FleetDetailModal';
import BikeDetailModal from '@/components/landing/BikeDetailModal';

const FEATURED_LIMIT = 5;

function FallbackImage({ alt, className }) {
  return (
    <div className={`${className} bg-muted flex items-center justify-center`}>
      <Compass className="w-8 h-8 text-muted-foreground/40" aria-label={alt} />
    </div>
  );
}

function SeeMoreCard({ to, label }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center gap-3 min-h-[260px] h-full rounded-2xl border border-dashed border-border bg-card/50 hover:bg-card hover:border-primary/40 transition-colors"
    >
      <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
        <ArrowRight className="w-5 h-5" />
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </Link>
  );
}

function Card({ onDetails, ctaHref, ctaLabel, image, imageAlt, badge, badgeIcon: BadgeIcon, title, subtitle, price, priceMax, priceDiscount, note }) {
  return (
    <div
      onClick={onDetails}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col h-full"
    >
      {image ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <FallbackImage alt={imageAlt} className="h-40" />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
          {badge && (
            <span className="text-[11px] font-semibold text-primary tracking-widest uppercase">{badge}</span>
          )}
        </div>
        <h3 className="font-serif text-base font-medium text-foreground leading-snug">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground flex items-center gap-1">{subtitle}</p>}
        <div className="mt-auto pt-2">
          {price != null && price !== '' ? (
            <PriceDisplay price={price} priceMax={priceMax} priceDiscount={priceDiscount} className="text-sm" />
          ) : null}
          {note && <p className="text-[10px] text-muted-foreground italic mt-0.5">{note}</p>}
          <div className="flex gap-2 pt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={onDetails}
              className="rounded-full gap-1.5 font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0"
            >
              <Info className="w-3.5 h-3.5" />
              See Details
            </Button>
            <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full group/btn">
                {ctaLabel}
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function useCarouselControls() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    emblaRef,
    canPrev,
    canNext,
    scrollPrev: () => emblaApi?.scrollPrev(),
    scrollNext: () => emblaApi?.scrollNext(),
  };
}

function Group({ title, icon: Icon, isLoading, children }) {
  const { emblaRef, canPrev, canNext, scrollPrev, scrollNext } = useCarouselControls();

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
        <div className="flex-1 h-px bg-border/60 ml-2" />
        {!isLoading && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous"
              className="rounded-full h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Next"
              className="rounded-full h-8 w-8"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/50">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ml-4 touch-pan-y">
            {React.Children.map(children, (child) => (
              <div className="pl-4 min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeaturedCollections() {
  const { lang } = useLang();
  const isId = lang === 'id';
  const { getWhatsappMessageUrl } = useSiteSettings();

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);

  const { data: packages = [], isLoading: loadingPkgs } = useQuery({
    queryKey: ['tourPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(FEATURED_LIMIT);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: fleet = [], isLoading: loadingFleet } = useQuery({
    queryKey: ['fleet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(FEATURED_LIMIT);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: bikes = [], isLoading: loadingBikes } = useQuery({
    queryKey: ['bikes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(FEATURED_LIMIT);
      if (error) throw error;
      return data || [];
    },
  });

  // Hide the whole section when there is nothing to show at all
  const empty = !loadingPkgs && !loadingFleet && !loadingBikes
    && packages.length === 0 && fleet.length === 0 && bikes.length === 0;
  if (empty) return null;

  const seeMoreLabel = isId ? 'Lihat Semua' : 'See More';
  const rentLabel = isId ? 'Sewa Sekarang' : 'Rent Now';
  const bookLabel = (pkg) =>
    (isId && pkg.cta_text_id) || pkg.cta_text_en || (isId ? 'Pesan Tur Ini' : 'Book This Tour');

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            {isId ? 'Produk Kami' : 'Our Products'}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-foreground">
            {isId ? 'Jelajahi Pilihan Terbaik Kami' : 'Explore Our Featured Selection'}
          </h2>
          <div className="mt-4 w-16 h-px bg-primary mx-auto" />
        </div>

        {/* Tour Packages */}
        <Group title={isId ? 'Paket Tur' : 'Tour Packages'} icon={MapPin} isLoading={loadingPkgs}>
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              onDetails={() => setSelectedPkg(pkg)}
              ctaHref={getWhatsappMessageUrl(`Hi! I'm interested in the ${pkg.title_en} package.`)}
              ctaLabel={bookLabel(pkg)}
              image={pkg.image_url}
              imageAlt={pkg.title_en}
              title={isId && pkg.title_id ? pkg.title_id : pkg.title_en}
              badge={isId && pkg.duration_id ? pkg.duration_id : pkg.duration_en}
              price={pkg.price}
              priceMax={pkg.price_max}
              priceDiscount={pkg.price_discount}
            />
          ))}
          <SeeMoreCard to="/packages#packages" label={seeMoreLabel} />
        </Group>

        {/* Car Rent / Fleet */}
        <Group title={isId ? 'Sewa Mobil' : 'Car Rent'} icon={Car} isLoading={loadingFleet}>
          {fleet.map((v) => (
            <Card
              key={v.id}
              onDetails={() => setSelectedVehicle(v)}
              ctaHref={getWhatsappMessageUrl(`Hi! I'd like to rent the ${v.name}.`)}
              ctaLabel={rentLabel}
              image={v.image_url}
              imageAlt={v.name}
              title={v.name}
              badge={v.type}
              badgeIcon={Users}
              subtitle={v.capacity ? `${v.capacity} pax` : null}
              price={v.price}
              priceMax={v.price_max}
              priceDiscount={v.price_discount}
            />
          ))}
          <SeeMoreCard to="/packages#fleet" label={seeMoreLabel} />
        </Group>

        {/* Bike Rent */}
        <Group title={isId ? 'Sewa Motor' : 'Bike Rent'} icon={Bike} isLoading={loadingBikes}>
          {bikes.map((bike) => (
            <Card
              key={bike.id}
              onDetails={() => setSelectedBike(bike)}
              ctaHref={getWhatsappMessageUrl(`Hi! I'd like to rent the ${bike.name}.`)}
              ctaLabel={rentLabel}
              image={bike.image_url}
              imageAlt={bike.name}
              title={bike.name}
              badge={bike.type}
              badgeIcon={Bike}
              subtitle={bike.capacity || null}
              price={bike.price}
              priceMax={bike.price_max}
              priceDiscount={bike.price_discount}
              note={bike.is_available === false ? (isId ? 'Tidak Tersedia' : 'Not Available') : null}
            />
          ))}
          <SeeMoreCard to="/bike-rent" label={seeMoreLabel} />
        </Group>
      </div>

      {/* Detail modals — shared, rendered outside the carousels */}
      <PackageDetailModal
        pkg={selectedPkg}
        open={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
      />
      <FleetDetailModal
        vehicle={selectedVehicle}
        open={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
      <BikeDetailModal
        bike={selectedBike}
        open={!!selectedBike}
        onClose={() => setSelectedBike(null)}
      />
    </section>
  );
}

