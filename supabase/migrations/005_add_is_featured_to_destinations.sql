-- ============================================================================
-- Migration 005: Add is_featured column to destinations table
-- ----------------------------------------------------------------------------
-- Allows admins to mark specific destinations as "featured" so the landing
-- page can filter to show only featured destinations.
-- ============================================================================

-- Add the is_featured column (default false, not null)
ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Mark the existing 6 destinations as featured (they were the original set)
UPDATE public.destinations
  SET is_featured = true
  WHERE name_en IN ('Ubud', 'Uluwatu', 'Canggu', 'Kintamani', 'Nusa Penida', 'Lovina');

-- Verify
SELECT name_en, is_featured FROM public.destinations ORDER BY sort_order;