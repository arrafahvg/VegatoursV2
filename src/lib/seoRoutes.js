// Per-route SEO metadata (titles, descriptions, JSON-LD).
// IMPORTANT: keep this file dependency-free (no imports) so that
// scripts/prerender.mjs can import it directly in Node during builds.

export const SITE_URL = 'https://vegatours.id';
export const SITE_NAME = 'Vegatours';
// Bali hero image used as the default Open Graph / social share image.
export const OG_IMAGE = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Vegatours',
  url: SITE_URL,
  image: OG_IMAGE,
  description:
    'Private Bali tours, custom travel experiences, car rental and bike rental in Bali, Indonesia. Trusted local travel facilitator with 5-star rated service.',
  areaServed: { '@type': 'Place', name: 'Bali, Indonesia' },
  priceRange: 'Rp75.000 - Rp3.000.000',
  knowsLanguage: ['en', 'id'],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Bali Tours' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tour Packages' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental with Driver' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Motorbike / Bike Rental' } },
  ],
};

const bikeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Bike Rental Bali — Motorbike & Scooter Rental',
  url: `${SITE_URL}/bike-rent`,
  itemListElement: [
    ['Honda BeAT 110', 75000], ['Honda Scoopy 110', 100000], ['Honda Vario 125', 125000],
    ['Honda Vario 160', 150000], ['Honda PCX 160', 175000], ['Yamaha NMAX 155', 200000],
    ['Honda CB150X', 250000],
  ].map(([name, price]) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Product', name: `${name} Rental Bali` },
    price,
    priceCurrency: 'IDR',
    availability: 'https://schema.org/InStock',
  })),
};

const packagesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Bali Tour Packages',
  url: `${SITE_URL}/packages`,
  provider: { '@type': 'TravelAgency', name: 'Vegatours' },
  areaServed: { '@type': 'Place', name: 'Bali, Indonesia' },
  description:
    'Private Bali tour packages with driver and air-conditioned vehicle. Custom itineraries, day tours and car charter across Bali.',
};

export const SEO_ROUTES = {
  '/': {
    title: 'Vegatours — Bali Private Tours, Car Rental & Bike Rental',
    description:
      'Explore your way with Vegatours: private Bali tours, custom itineraries, car rental with driver, and motorbike rental from Rp75.000/day. Trusted local Bali experts.',
    jsonLd: orgJsonLd,
  },
  '/packages': {
    title: 'Bali Tour Packages — Private Day Tours & Car Charter | Vegatours',
    description:
      'Private Bali tour packages with driver and AC vehicle. Ubud, Uluwatu, Nusa Penida & custom itineraries. Transparent pricing, no hidden fees.',
    jsonLd: packagesJsonLd,
  },
  '/bike-rent': {
    title: 'Sewa Motor Bali — Bike & Scooter Rental from Rp75.000/day | Vegatours',
    description:
      'Rent a motorbike in Bali: Honda Scoopy, Vario, PCX, Yamaha NMAX and more. Daily, weekly and monthly rates. Helmets included, delivery available. Book via WhatsApp.',
    jsonLd: bikeJsonLd,
  },
  '/team': {
    title: 'Meet the Team — Vegatours Bali Travel Facilitators',
    description:
      'Meet the local Bali travel facilitators behind Vegatours. Private drivers and tour planners trusted by 500+ travelers.',
    jsonLd: orgJsonLd,
  },
};
