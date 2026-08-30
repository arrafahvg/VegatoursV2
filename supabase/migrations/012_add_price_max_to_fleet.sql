-- ============================================================================
-- Migration 012: Add optional price_max to fleet so admins can display a price
-- range (e.g. Rp420,000,- – Rp820,000,-) instead of a single price.
-- ============================================================================

ALTER TABLE public.fleet
  ADD COLUMN IF NOT EXISTS price_max NUMERIC(12,2);

-- Verify
SELECT id, name, price, price_max FROM public.fleet ORDER BY sort_order;