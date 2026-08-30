-- ============================================================================
-- Migration 013: Add optional discounted price to fleet so admins can show a
-- sale price with the original struck through (e.g. ~~Rp1,500,000,-~~ Rp1,200,000,-).
-- Only applies when the item has a single price (not a price range).
-- ============================================================================

ALTER TABLE public.fleet
  ADD COLUMN IF NOT EXISTS price_discount NUMERIC(12,2);

-- Verify
SELECT id, name, price, price_discount, price_max FROM public.fleet ORDER BY sort_order;