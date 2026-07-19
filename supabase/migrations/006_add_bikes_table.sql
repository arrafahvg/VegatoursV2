-- ============================================================================
-- Migration 006: Add bikes table for motorcycle rental
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create bikes table (mirrors fleet structure)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bikes (
  features     JSONB,                       -- array of strings
  price        NUMERIC(12,2),               -- parsed from "IDR 200,000" during ETL
  image_url    TEXT,
  name         VARCHAR(255),
  terms_id     JSONB,                       -- array of strings
  includes_en  JSONB,                       -- array of strings
  terms_en     JSONB,                       -- array of strings
  includes_id  JSONB,                       -- array of strings
  type         VARCHAR(50),                 -- Automatic / Manual / Sport
  sort_order   INTEGER,
  capacity     VARCHAR(50),                 -- CC / engine size (e.g. "150cc", "250cc")
  price_note   TEXT,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

-- ----------------------------------------------------------------------------
-- 2. Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bikes_sort ON public.bikes (sort_order);

-- ----------------------------------------------------------------------------
-- 3. Trigger for updated_date
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_set_updated_date ON public.bikes;
CREATE TRIGGER trg_set_updated_date
  BEFORE UPDATE ON public.bikes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_date();

-- ----------------------------------------------------------------------------
-- 4. Row Level Security
-- ----------------------------------------------------------------------------
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "public_read_bikes" ON public.bikes;
CREATE POLICY "public_read_bikes" ON public.bikes
  FOR SELECT USING (true);

-- Admin write access
DROP POLICY IF EXISTS "admin_write_bikes" ON public.bikes;
CREATE POLICY "admin_write_bikes" ON public.bikes
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());