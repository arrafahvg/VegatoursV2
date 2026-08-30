-- ============================================================================
-- Migration 009: Add bilingual columns (quote_en / quote_id) to testimonials so
-- the public section can render quotes in English or Bahasa Indonesia, matching
-- the *_en / *_id pattern already used by FAQs, tour_packages, and team_members.
-- ============================================================================

-- Add the language columns (nullable; quote retained as a legacy fallback)
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS quote_en TEXT,
  ADD COLUMN IF NOT EXISTS quote_id TEXT;

-- Backfill quote_en from the legacy single-language quote column
UPDATE public.testimonials
   SET quote_en = quote
 WHERE quote_en IS NULL AND quote IS NOT NULL;

-- Verify
SELECT id, author_name, quote, quote_en, quote_id FROM public.testimonials ORDER BY sort_order;