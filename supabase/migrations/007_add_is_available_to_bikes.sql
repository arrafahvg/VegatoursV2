-- ============================================================================
-- Migration 007: Add "is_available" toggle to bikes so admins can mark a bike
-- as unavailable for rent. Public pages filter out bikes where is_available = false.
-- ============================================================================

-- Add the availability column (default true = available, not null)
ALTER TABLE public.bikes
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;

-- Backfill any legacy rows that were created before this column existed
UPDATE public.bikes SET is_available = true WHERE is_available IS NULL;

-- Index for fast filtering of available bikes on the public page
CREATE INDEX IF NOT EXISTS idx_bikes_is_available ON public.bikes (is_available);

-- Verify
SELECT id, name, is_available FROM public.bikes ORDER BY sort_order;