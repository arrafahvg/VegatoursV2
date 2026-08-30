-- ============================================================================
-- Migration 014: Add optional price range / discount to tour_packages so admins
-- can show a price range (Rp420,000,- – Rp820,000,-) or a discounted price with
-- the original struck through (~~Rp1,500,000,-~~ Rp1,200,000,-).
-- Mirrors the fleet pricing system.
-- ============================================================================

ALTER TABLE public.tour_packages
  ADD COLUMN IF NOT EXISTS price_max      NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS price_discount NUMERIC(12,2);

-- Verify
SELECT id, title_en, price, price_max, price_discount FROM public.tour_packages ORDER BY sort_order;