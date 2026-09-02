-- ============================================================================
-- Migration 015: Add weekly & monthly pricing to bikes
-- ----------------------------------------------------------------------------
-- Adds optional price_weekly and price_monthly columns so admins can set
-- three prices per bike. Daily price (price) remains the main price shown
-- on the public Bike Rent page; weekly/monthly are shown as smaller text.
-- ============================================================================

ALTER TABLE public.bikes
  ADD COLUMN IF NOT EXISTS price_weekly integer,
  ADD COLUMN IF NOT EXISTS price_monthly integer;
