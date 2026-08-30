-- ============================================================================
-- Migration 010: Add location / business-info columns to partners so admins can
-- match partners to client locations and contact them quickly. Also records the
-- rental category, rating and review count from the business data export.
-- ============================================================================

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS category     VARCHAR(50),
  ADD COLUMN IF NOT EXISTS address      TEXT,
  ADD COLUMN IF NOT EXISTS city         VARCHAR(100),
  ADD COLUMN IF NOT EXISTS maps_url     TEXT,
  ADD COLUMN IF NOT EXISTS rating       NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS reviews_count INTEGER;

-- Verify
SELECT id, name, category, city, rating FROM public.partners ORDER BY sort_order;