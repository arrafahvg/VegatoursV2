import React from 'react';
import { useLang } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Car, ArrowRight } from 'lucide-react';

export default function PackagesCTA() {
  const { lang } = useLang();

  return (
    <section id="packages" className="py-20 lg:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {lang === 'id' ? 'Paket & Armada' : 'Packages & Fleet'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              {lang === 'id' ? 'Pilih Perjalanan Anda' : 'Plan Your Journey'}
            </h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {lang === 'id'
                ? 'Jelajahi paket tur pilihan tangan kami dan armada kendaraan nyaman yang dirancang untuk pengalaman terbaik.'
                : 'Explore our handcrafted tour packages and comfortable vehicle fleet designed for the best experience.'}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <Link
            to="/packages#packages"
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                {lang === 'id' ? 'Lihat Paket' : 'See Packages'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'id' ? 'Paket tur terkurasi untuk setiap gaya wisata' : 'Curated tours for every travel style'}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider group-hover:gap-2 transition-all">
              {lang === 'id' ? 'Jelajahi' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/packages#fleet"
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                {lang === 'id' ? 'Lihat Armada' : 'See Fleet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'id' ? 'Kendaraan nyaman & pengemudi berpengalaman' : 'Comfortable vehicles & experienced drivers'}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider group-hover:gap-2 transition-all">
              {lang === 'id' ? 'Jelajahi' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}