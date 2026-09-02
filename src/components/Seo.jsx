import { useEffect } from 'react';
import { SEO_ROUTES, SITE_URL, OG_IMAGE } from '@/lib/seoRoutes';

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Per-page SEO for the SPA. Sets <title>, meta description, canonical,
 * Open Graph/Twitter tags and injects route JSON-LD.
 *
 * Usage: <Seo path="/bike-rent" /> inside any page component.
 * Falls back to the default (home) tags when path is omitted or unknown.
 */
export default function Seo({ path }) {
  useEffect(() => {
    const key = path || window.location.pathname;
    const meta = SEO_ROUTES[key] || SEO_ROUTES['/'];

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', `${SITE_URL}${key}`);
    upsertMeta('property', 'og:image', OG_IMAGE);
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', OG_IMAGE);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${key}`);

    // Swap the JSON-LD payload for this route
    const existing = document.getElementById('seo-jsonld');
    if (existing) existing.remove();
    if (meta.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-jsonld';
      script.textContent = JSON.stringify(meta.jsonLd);
      document.head.appendChild(script);
    }
  }, [path]);

  return null;
}
