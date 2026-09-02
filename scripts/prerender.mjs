/**
 * Static prerender script — runs after `vite build`.
 *
 * For each public route it copies dist/index.html into dist/<route>/index.html
 * with that route's SEO tags (title, description, canonical, OG, JSON-LD)
 * injected into the initial HTML. This guarantees crawlers see correct
 * per-page metadata immediately, even before JavaScript loads.
 *
 * Route metadata is read from src/lib/seoRoutes.js (kept dependency-free
 * specifically so this Node script can import it).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const { SEO_ROUTES, SITE_URL } = await import(
  new URL('../src/lib/seoRoutes.js', import.meta.url)
);

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf8');

for (const [route, meta] of Object.entries(SEO_ROUTES)) {
  let html = baseHtml;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace canonical + og:url
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${SITE_URL}${route}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${SITE_URL}${route}" />`
  );

  // Replace og/twitter titles & descriptions
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${meta.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${meta.description}" />`);

  // Replace JSON-LD payload
  if (meta.jsonLd) {
    html = html.replace(
      /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(meta.jsonLd)}</script>`
    );
  }

  const outDir = route === '/' ? distDir : join(distDir, route.replace(/^\//, ''));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`prerendered: ${route}`);
}

console.log('Prerender complete.');
