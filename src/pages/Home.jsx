import React from 'react';
import { LanguageProvider } from '@/lib/i18n';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import FeaturedCollections from '@/components/landing/FeaturedCollections';
import HowItWorks from '@/components/landing/HowItWorks';
import Destinations from '@/components/landing/Destinations';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import About from '@/components/landing/About';
import Gallery from '@/components/landing/Gallery';
import Partners from '@/components/landing/Partners';
import Testimonials from '@/components/landing/Testimonials';
import FAQs from '@/components/landing/FAQs';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import WhatsAppButton from '@/components/landing/WhatsAppButton';

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Services />
        <FeaturedCollections />
        <HowItWorks />
        <Destinations />
        <WhyChooseUs />
        <About />
        <Gallery />
        <Testimonials />
        <FAQs />
        <Contact />
        <Partners />
        <Footer />
        <WhatsAppButton />
        {/* Bottom padding for mobile sticky bar */}
        <div className="h-16 md:hidden" />
      </div>
    </LanguageProvider>
  );
}