import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import PriceDisplay from '@/components/PriceDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, MapPin, Users, Bike, Car, Compass } from 'lucide-react';

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
      className="group flex flex-col items-center justify-center gap-3 min-h-[220px] rounded-2xl border border-dashed border-border bg-card/50 hover:bg-card hover:border-primary/40 transition-colors"
    >
      <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
        <ArrowRight className="w-5 h-5" />
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </Link>
  );
}

function Card({ to, image, imageAlt, badge, badgeIcon: BadgeIcon, title, subtitle, price, priceMax, priceDiscount, note }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col"
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
        </div>
      </div>
    </Link>
  );
}

function Group({ title, icon: Icon, isLoading, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
        <div className="flex-1 h-px bg-border/60 ml-2" />
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
      )}
    </div>

export default function FeaturedCollections() {
  const { lang } = useLang();
  const isId = lang === 'id';

  const { data: packages = [], isLoading: loadingPkgs } = useQuery({
    queryKey: ['tourPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(3);
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
        .limit(3);
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
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  // Hide the whole section when there is nothing to show at all
  const empty = !loadingPkgs && !loadingFleet && !loadingBikes
    && packages.length === 0 && fleet.length === 0 && bikes.length === 0;
  if (empty) return null;

  const seeMoreLabel = isId ? 'Lihat Semua' : 'See More';

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
              to="/packages#packages"
              image={pkg.image_url}
              imageAlt={pkg.name}
              title={pkg.name}
              badge={pkg.duration}
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
              to="/packages#fleet"
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
              to="/bike-rent"
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
    </section>
  );
}

