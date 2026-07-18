import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  en: {
    nav: { home: 'Home', services: 'Services', packages: 'Tour Packages', destinations: 'Destinations', gallery: 'Gallery', about: 'About', contact: 'Contact', faq: 'FAQ' },
    hero: {
      headline: 'Explore Your Way',
      subheadline: 'Private tours, custom itineraries, and trusted local travel facilitators helping you experience the best.',
      cta1: 'Explore Packages',
      cta2: 'Plan Custom Trip',
      trust: ['Trusted by 500+ travelers', 'Local Bali experts', '5-star rated'],
    },
    services: {
      title: 'Our Services',
      subtitle: 'Curated experiences designed for the modern traveler',
      items: [
        { title: 'Bali Tour Packages', desc: 'Carefully curated full-day and half-day tours across Bali\'s most stunning locations.' },
        { title: 'Custom Private Tours', desc: 'Design your own itinerary with our local travel facilitators for a personalized adventure.' },
        { title: 'Airport Transfer', desc: 'Comfortable and reliable airport pickup and drop-off services across Bali.' },
        { title: 'Day Trips', desc: 'Explore Bali\'s highlights in a single day with our expertly planned day trip routes.' },
        { title: 'Northern Bali Tour', desc: 'Discover the serene beauty of Lovina, waterfalls, and volcanic lakes.' },
        { title: 'Uluwatu Tour', desc: 'Experience the dramatic cliffs, ancient temples, and breathtaking sunsets of southern Bali.' },
        { title: 'Nusa Penida Tour', desc: 'Visit the iconic beaches and viewpoints of Bali\'s most photogenic island.' },
        { title: 'Travel Facilitation', desc: 'End-to-end travel support from planning to execution with local expertise.' },
      ],
      cta: 'Learn More',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Your journey to Bali starts here',
      steps: [
        { title: 'Choose Your Adventure', desc: 'Pick a curated package or design a custom trip tailored to your preferences.' },
        { title: 'Plan With Our Team', desc: 'Discuss your plans with our friendly travel facilitator for the perfect itinerary.' },
        { title: 'Enjoy Bali Stress-Free', desc: 'Relax and let us handle everything while you experience the magic of Bali.' },
      ],
    },
    destinations: {
      title: 'Featured Destinations',
      subtitle: 'Discover the many faces of Bali',
      items: [
        { name: 'Ubud', desc: 'The cultural heart of Bali — rice terraces, art galleries, and sacred monkey forests.' },
        { name: 'Uluwatu', desc: 'Dramatic cliffside temples, world-class surf, and unforgettable sunsets.' },
        { name: 'Canggu', desc: 'Trendy beach town with vibrant cafés, rice paddies, and laid-back surf culture.' },
        { name: 'Kintamani', desc: 'Volcanic landscapes, hot springs, and panoramic views of Mount Batur.' },
        { name: 'Nusa Penida', desc: 'Untouched island paradise with dramatic cliffs, crystal waters, and hidden beaches.' },
        { name: 'Lovina', desc: 'Peaceful northern coast known for dolphin watching and black sand beaches.' },
      ],
      cta: 'Explore',
    },
    whyUs: {
      title: 'Why Choose Vegatours',
      subtitle: 'What makes us different',
      items: [
        { title: 'Local Bali Expertise', desc: 'Born and raised in Bali — we know every hidden gem and secret spot.' },
        { title: 'Flexible Itineraries', desc: 'Your trip, your rules. We adapt to your pace and preferences.' },
        { title: 'Friendly Facilitators', desc: 'Our team is warm, professional, and passionate about sharing Bali.' },
        { title: 'Comfortable Transport', desc: 'Travel in clean, air-conditioned vehicles with experienced drivers.' },
        { title: 'Personalized Experiences', desc: 'No cookie-cutter tours. Every journey is crafted uniquely for you.' },
        { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. What you see is what you pay.' },
      ],
    },
    about: {
      title: 'About Vegatours',
      text: 'Born and raised in Indonesia with a deep passion for supporting Bali tourism, Vegatours helps travelers experience Bali more personally through curated journeys and local hospitality.',
      highlights: ['Local insights & hidden gems', 'Flexible trip planning', 'Personalized travel support', 'Friendly & fast communication'],
    },
    packages: {
      title: 'Tour Packages',
      subtitle: 'Handcrafted journeys for every type of traveler',
      popular: 'Most Popular',
      startingFrom: 'Starting from',
      bookCta: 'Book This Tour',
    },
    gallery: { title: 'Gallery', subtitle: 'Moments captured across the Island of Gods' },
    team: { title: 'Meet Our Team', subtitle: 'The faces behind your Bali adventure' },
    testimonials: { title: 'What Travelers Say', subtitle: 'Real stories from real travelers' },
    faq: { title: 'Frequently Asked Questions', subtitle: 'Everything you need to know' },
    contact: {
      title: "Let's Plan Your Bali Journey",
      subtitle: 'Tell us your travel dates and destinations. We\'ll help you build the perfect Bali experience.',
      whatsappCta: 'Chat on WhatsApp',
      form: { name: 'Your Name', email: 'Email Address', dates: 'Travel Dates', message: 'Tell us about your dream Bali trip...', send: 'Send Inquiry' },
    },
    footer: {
      tagline: 'Your trusted travel agent',
      quickLinks: 'Quick Links',
      getInTouch: 'Get In Touch',
      copyright: '© 2026 Vegatours. All rights reserved.',
    },
    whatsapp: { cta: 'Chat on WhatsApp', mobileCta: 'Plan My Trip' },
  },
  id: {
    nav: { home: 'Beranda', services: 'Layanan', packages: 'Paket Tur', destinations: 'Destinasi', gallery: 'Galeri', about: 'Tentang', contact: 'Kontak', faq: 'FAQ' },
    hero: {
      headline: 'Jelajahi Sesuai Gayamu',
      subheadline: 'Tur privat, itinerari kustom, dan fasilitator perjalanan lokal terpercaya membantu Anda merasakan yang terbaik.',
      cta1: 'Jelajahi Paket',
      cta2: 'Rencanakan Perjalanan',
      trust: ['Dipercaya 500+ wisatawan', 'Ahli lokal Bali', 'Rating bintang 5'],
    },
    services: {
      title: 'Layanan Kami',
      subtitle: 'Pengalaman terkurasi untuk wisatawan modern',
      items: [
        { title: 'Paket Tur Bali', desc: 'Tur sehari penuh dan setengah hari yang dikurasi dengan cermat ke lokasi-lokasi terindah di Bali.' },
        { title: 'Tur Privat Kustom', desc: 'Rancang itinerari Anda sendiri dengan fasilitator perjalanan lokal kami.' },
        { title: 'Transfer Bandara', desc: 'Layanan antar-jemput bandara yang nyaman dan andal di seluruh Bali.' },
        { title: 'Perjalanan Harian', desc: 'Jelajahi highlight Bali dalam satu hari dengan rute perjalanan yang terencana.' },
        { title: 'Tur Bali Utara', desc: 'Temukan keindahan Lovina, air terjun, dan danau vulkanik yang damai.' },
        { title: 'Tur Uluwatu', desc: 'Nikmati tebing dramatis, pura kuno, dan matahari terbenam yang menakjubkan.' },
        { title: 'Tur Nusa Penida', desc: 'Kunjungi pantai ikonik dan titik pandang pulau paling fotogenik di Bali.' },
        { title: 'Fasilitasi Perjalanan', desc: 'Dukungan perjalanan dari perencanaan hingga pelaksanaan dengan keahlian lokal.' },
      ],
      cta: 'Selengkapnya',
    },
    howItWorks: {
      title: 'Cara Kerjanya',
      subtitle: 'Perjalanan Bali Anda dimulai di sini',
      steps: [
        { title: 'Pilih Petualangan', desc: 'Pilih paket kurasi atau rancang perjalanan kustom sesuai preferensi Anda.' },
        { title: 'Rencanakan Bersama Tim', desc: 'Diskusikan rencana dengan fasilitator perjalanan kami untuk itinerari sempurna.' },
        { title: 'Nikmati Bali Tanpa Stres', desc: 'Santai dan biarkan kami yang mengurus semuanya saat Anda menikmati Bali.' },
      ],
    },
    destinations: {
      title: 'Destinasi Unggulan',
      subtitle: 'Temukan berbagai wajah Bali',
      items: [
        { name: 'Ubud', desc: 'Jantung budaya Bali — sawah terasering, galeri seni, dan hutan monyet suci.' },
        { name: 'Uluwatu', desc: 'Pura di tebing dramatis, ombak kelas dunia, dan matahari terbenam tak terlupakan.' },
        { name: 'Canggu', desc: 'Kota pantai trendi dengan kafe vibran, sawah, dan budaya surfing santai.' },
        { name: 'Kintamani', desc: 'Lanskap vulkanik, pemandian air panas, dan panorama Gunung Batur.' },
        { name: 'Nusa Penida', desc: 'Surga pulau perawan dengan tebing dramatis, air kristal, dan pantai tersembunyi.' },
        { name: 'Lovina', desc: 'Pantai utara yang damai terkenal dengan lumba-lumba dan pantai pasir hitam.' },
      ],
      cta: 'Jelajahi',
    },
    whyUs: {
      title: 'Mengapa Memilih Vegatours',
      subtitle: 'Yang membedakan kami',
      items: [
        { title: 'Keahlian Lokal Bali', desc: 'Lahir dan besar di Bali — kami tahu setiap permata tersembunyi.' },
        { title: 'Itinerari Fleksibel', desc: 'Perjalanan Anda, aturan Anda. Kami menyesuaikan dengan tempo Anda.' },
        { title: 'Fasilitator Ramah', desc: 'Tim kami hangat, profesional, dan antusias berbagi Bali.' },
        { title: 'Transportasi Nyaman', desc: 'Perjalanan dengan kendaraan bersih ber-AC dan pengemudi berpengalaman.' },
        { title: 'Pengalaman Personal', desc: 'Tidak ada tur pasaran. Setiap perjalanan dirancang unik untuk Anda.' },
        { title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi, tanpa kejutan. Yang terlihat adalah yang dibayar.' },
      ],
    },
    about: {
      title: 'Tentang Vegatours',
      text: 'Lahir dan besar di Indonesia dengan semangat mendukung pariwisata Bali, Vegatours membantu wisatawan merasakan Bali secara lebih personal melalui perjalanan terkurasi dan keramahan lokal.',
      highlights: ['Wawasan lokal & tempat tersembunyi', 'Perencanaan perjalanan fleksibel', 'Dukungan perjalanan personal', 'Komunikasi ramah & cepat'],
    },
    packages: {
      title: 'Paket Tur',
      subtitle: 'Perjalanan buatan tangan untuk setiap tipe wisatawan',
      popular: 'Paling Populer',
      startingFrom: 'Mulai dari',
      bookCta: 'Pesan Tur Ini',
    },
    gallery: { title: 'Galeri', subtitle: 'Momen yang terekam di Pulau Dewata' },
    team: { title: 'Tim Kami', subtitle: 'Wajah-wajah di balik petualangan Bali Anda' },
    testimonials: { title: 'Kata Wisatawan', subtitle: 'Cerita nyata dari wisatawan nyata' },
    faq: { title: 'Pertanyaan Umum', subtitle: 'Semua yang perlu Anda ketahui' },
    contact: {
      title: 'Mari Rencanakan Perjalanan Bali Anda',
      subtitle: 'Ceritakan tanggal perjalanan dan destinasi Anda. Kami akan membantu membangun pengalaman Bali yang sempurna.',
      whatsappCta: 'Chat di WhatsApp',
      form: { name: 'Nama Anda', email: 'Alamat Email', dates: 'Tanggal Perjalanan', message: 'Ceritakan tentang perjalanan Bali impian Anda...', send: 'Kirim Pertanyaan' },
    },
    footer: {
      tagline: 'Partner perjalanan terpercaya Anda',
      quickLinks: 'Tautan Cepat',
      getInTouch: 'Hubungi Kami',
      copyright: '© 2026 Vegatours. Hak cipta dilindungi.',
    },
    whatsapp: { cta: 'Chat di WhatsApp', mobileCta: 'Rencanakan Perjalanan' },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggleLang = useCallback(() => setLang(l => l === 'en' ? 'id' : 'en'), []);
  const t = useCallback((path) => {
    const keys = path.split('.');
    let val = translations[lang];
    for (const key of keys) {
      if (val === undefined) return path;
      val = val[key];
    }
    return val || path;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);