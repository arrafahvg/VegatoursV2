-- ============================================================================
-- VegatoursV2 — Supabase / PostgreSQL Schema
-- ----------------------------------------------------------------------------
-- Source: CSV data analysis of 12 Base44 entity exports (see Notes 3.2 / 4.2)
-- Strategy: parents → children, preserve Base44 24-char hex IDs for ETL.
-- This file ONLY creates structure (tables, types, PKs, FKs, indexes,
-- timestamps, RLS). NO data is imported here.
--
-- ID strategy:
--   * All entity `id` columns keep VARCHAR(24) (Base44 24-char hex) so the
--     existing CSV `id` values and `created_by_id` FKs map 1:1 during ETL.
--   * `users` additionally stores `auth_user_id UUID` linked to Supabase
--     Auth (`auth.users.id`) so Row Level Security can use auth.uid().
--     During ETL: create the admin in Supabase Auth, then set
--     users.auth_user_id = that UUID and users.id = '6a0947b7b4a68dcdea755505'.
--
-- Idempotent: safe to re-run (drops existing objects first). No data is
-- present yet, so dropping/recreating is safe.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Drop section (allows safe re-runs)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS
  public.invoices,
  public.bookings,
  public.tour_packages,
  public.testimonials,
  public.team_members,
  public.site_settings,
  public.partners,
  public.inquiries,
  public.gallery_images,
  public.fleet,
  public.faqs,
  public.destinations,
  public.users
CASCADE;

DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.set_updated_date();

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- for gen_random_uuid() if needed later

-- ----------------------------------------------------------------------------
-- 2. Helper functions for Row Level Security
-- ----------------------------------------------------------------------------
-- NOTE: These functions are DEFINED in section 3.4 (after the tables exist),
-- because is_admin() references public.users and PostgreSQL validates the
-- function body at creation time. Defining them before the table exists
-- causes: ERROR: 42P01: relation "public.users" does not exist.

-- ============================================================================
-- 3. TABLES  (creation order: users → standalone → bookings → invoices)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.0  users  (recreated; not in CSV exports — needed for created_by_id FKs)
-- ----------------------------------------------------------------------------
CREATE TABLE public.users (
  id            VARCHAR(24)  PRIMARY KEY,                     -- legacy Base44 id
  auth_user_id  UUID         UNIQUE REFERENCES auth.users(id),-- Supabase Auth link
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255),
  role          VARCHAR(20)  NOT NULL DEFAULT 'user'
                              CHECK (role IN ('user','admin','super_admin')),
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

-- ----------------------------------------------------------------------------
-- 3.0b  Helper functions for Row Level Security
--       (defined here, AFTER public.users exists, to avoid 42P01 errors)
-- ----------------------------------------------------------------------------

-- Returns true if the currently authenticated Supabase user is an admin/super_admin.
-- SECURITY DEFINER so it can read the public.users table regardless of RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- Keeps `updated_date` fresh on every UPDATE.
CREATE OR REPLACE FUNCTION public.set_updated_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_date = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3.1  Standalone reference / lookup tables (no incoming FKs)
-- ----------------------------------------------------------------------------

CREATE TABLE public.destinations (
  desc_id     TEXT,
  desc_en     TEXT,
  name_id     VARCHAR(255),
  name_en     VARCHAR(255),
  sort_order  INTEGER,
  image_url   TEXT,
  is_featured BOOLEAN  NOT NULL DEFAULT false,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.faqs (
  question_en TEXT,
  answer_en   TEXT,
  question_id TEXT,
  answer_id   TEXT,
  sort_order  INTEGER,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.fleet (
  features     JSONB,                       -- array of strings
  price        NUMERIC(12,2),               -- parsed from "IDR 600,000" during ETL
  price_max    NUMERIC(12,2),               -- optional upper bound for price ranges
  image_url    TEXT,
  name         VARCHAR(255),
  terms_id     JSONB,                       -- array of strings
  includes_en  JSONB,                       -- array of strings
  terms_en     JSONB,                       -- array of strings
  includes_id  JSONB,                       -- array of strings
  type         VARCHAR(50),                 -- MPV / SUV / Minibus
  sort_order   INTEGER,
  capacity     INTEGER,
  price_note   TEXT,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.gallery_images (
  caption_id   VARCHAR(255),
  caption_en   VARCHAR(255),
  sort_order   INTEGER,
  image_url    TEXT,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.inquiries (
  name         VARCHAR(255),
  travel_dates VARCHAR(100),                -- free text e.g. "September 2026"
  message      TEXT,
  email        VARCHAR(255),
  status       VARCHAR(20)  DEFAULT 'new',  -- new / contacted
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.partners (
  notes              TEXT,
  is_active          BOOLEAN,
  website_url        TEXT,
  pic_phone          VARCHAR(50),
  logo_url           TEXT,
  name               VARCHAR(255),
  publish_on_website BOOLEAN,
  description        TEXT,
  sort_order         INTEGER,
  email              VARCHAR(255),
  pic_name           VARCHAR(255),
  category           VARCHAR(50),
  address            TEXT,
  city               VARCHAR(100),
  maps_url           TEXT,
  rating             NUMERIC(2,1),
  reviews_count      INTEGER,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.site_settings (
  value   TEXT,
  key     VARCHAR(100) NOT NULL UNIQUE,
  label   VARCHAR(255),
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.team_members (
  role_en    VARCHAR(255),
  bio_id     TEXT,
  role_id    VARCHAR(255),
  bio_en     TEXT,
  name       VARCHAR(255),
  photo_url  TEXT,
  sort_order INTEGER,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.testimonials (
  author_name     VARCHAR(255),
  rating          SMALLINT CHECK (rating >= 1 AND rating <= 5),
  quote           TEXT,
  quote_en        TEXT,
  quote_id        TEXT,
  author_location VARCHAR(100),
  author_photo    TEXT,
  sort_order      INTEGER,
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE public.tour_packages (
  highlights_id  JSONB,                      -- array of strings
  image_url      TEXT,
  duration_id    VARCHAR(255),
  description_en TEXT,
  title_id       VARCHAR(255),
  cta_text_id    VARCHAR(255),
  highlights_en  JSONB,                      -- array of strings
  duration_en    VARCHAR(255),
  description_id TEXT,
  is_popular     BOOLEAN,
  price          NUMERIC(12,2),              -- parsed from "IDR 950,000 / car" during ETL
  title_en       VARCHAR(255),
  currency       VARCHAR(3),
  sort_order     INTEGER,
  cta_text_en    VARCHAR(255),
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

-- ----------------------------------------------------------------------------
-- 3.2  bookings  (child of users via created_by_id;
--                  denormalized partner_name / package_name kept as text +
--                  resolved partner_id / package_id FKs added for integrity)
-- ----------------------------------------------------------------------------
CREATE TABLE public.bookings (
  end_date         DATE,
  invoice_notes    TEXT,
  booking_code     VARCHAR(20) NOT NULL UNIQUE,   -- natural business key VBT-100001
  customer_country VARCHAR(100),
  pax              INTEGER,
  partner_name     VARCHAR(255),                  -- denormalized (fallback)
  customer_phone   VARCHAR(50),
  service_notes    TEXT,
  itinerary        TEXT,
  invoice_paid     BOOLEAN,
  invoice_amount   NUMERIC(12,2),                 -- parsed from "850000"
  pic_name         VARCHAR(255),
  pic_email        VARCHAR(255),
  internal_notes   TEXT,
  pic_phone        VARCHAR(50),
  customer_email   VARCHAR(255),
  package_name     VARCHAR(255),                  -- denormalized (fallback)
  tour_date        DATE,
  customer_name    VARCHAR(255),
  invoice_currency VARCHAR(3),
  status           VARCHAR(20),                   -- confirmed/lead/ongoing/completed
  -- Resolved FKs (populated during ETL by looking up names → ids)
  partner_id       VARCHAR(24) REFERENCES public.partners(id),
  package_id       VARCHAR(24) REFERENCES public.tour_packages(id),
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

-- ----------------------------------------------------------------------------
-- 3.3  invoices  (CHILD of bookings — the only true FK in the dataset)
-- ----------------------------------------------------------------------------
CREATE TABLE public.invoices (
  booking_id     VARCHAR(24) REFERENCES public.bookings(id),
  amount         NUMERIC(12,2),
  notes          TEXT,
  tax_percentage NUMERIC(5,2),
  due_date       DATE,
  currency       VARCHAR(3),
  label          VARCHAR(100),
  line_items     JSONB,                            -- array of {description, amount}
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  payment_method VARCHAR(50),
  status         VARCHAR(20),                      -- unpaid / paid
  -- Base44 metadata
  id            VARCHAR(24)  PRIMARY KEY,
  created_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_by_id VARCHAR(24)  REFERENCES public.users(id),
  created_by    VARCHAR(255),
  is_sample     BOOLEAN      NOT NULL DEFAULT false
);

-- ============================================================================
-- 4. INDEXES  (non-unique, for query performance)
-- ============================================================================

-- users
CREATE INDEX idx_users_role            ON public.users (role);
CREATE INDEX idx_users_auth_user_id    ON public.users (auth_user_id);

-- bookings — FK + common filter columns
CREATE INDEX idx_bookings_created_by   ON public.bookings (created_by_id);
CREATE INDEX idx_bookings_partner_id   ON public.bookings (partner_id);
CREATE INDEX idx_bookings_package_id   ON public.bookings (package_id);
CREATE INDEX idx_bookings_status       ON public.bookings (status);
CREATE INDEX idx_bookings_tour_date    ON public.bookings (tour_date);
CREATE INDEX idx_bookings_partner_name ON public.bookings (partner_name);  -- ETL lookup
CREATE INDEX idx_bookings_package_name ON public.bookings (package_name);  -- ETL lookup

-- invoices — FK + common filter columns
CREATE INDEX idx_invoices_booking_id   ON public.invoices (booking_id);
CREATE INDEX idx_invoices_status       ON public.invoices (status);

-- partners / tour_packages — name lookups used during ETL + public filtering
CREATE INDEX idx_partners_name         ON public.partners (name);
CREATE INDEX idx_partners_is_active    ON public.partners (is_active);
CREATE INDEX idx_tour_packages_title   ON public.tour_packages (title_en);
CREATE INDEX idx_tour_packages_popular ON public.tour_packages (is_popular);

-- generic sort / date indexes on list-heavy tables
CREATE INDEX idx_destinations_sort      ON public.destinations (sort_order);
CREATE INDEX idx_faqs_sort              ON public.faqs (sort_order);
CREATE INDEX idx_gallery_images_sort    ON public.gallery_images (sort_order);
CREATE INDEX idx_team_members_sort      ON public.team_members (sort_order);
CREATE INDEX idx_testimonials_sort      ON public.testimonials (sort_order);
CREATE INDEX idx_tour_packages_sort     ON public.tour_packages (sort_order);
CREATE INDEX idx_inquiries_status       ON public.inquiries (status);
CREATE INDEX idx_inquiries_created_date ON public.inquiries (created_date);

-- ============================================================================
-- 5. updated_date TRIGGERS  (attach to every table that has updated_date)
-- ============================================================================
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type   = 'BASE TABLE'
      AND table_name IN (
        'users','destinations','faqs','fleet','gallery_images','inquiries',
        'partners','site_settings','team_members','testimonials',
        'tour_packages','bookings','invoices'
      )
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_set_updated_date
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_date()',
      t
    );
  END LOOP;
END $$;

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- Public website (Home, Packages, Team, Gallery, FAQs, Destinations,
-- Testimonials, site_settings) needs READ-ONLY public access.
-- Admin section (bookings, invoices, partners, tour_packages, fleet,
-- site_settings, etc.) requires admin write. Inquiries accept public INSERT
-- (lead capture) but are readable/manageable by admins only.
-- ============================================================================

-- 6.0 users — read own row, admins full access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON public.users
  FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "users_admin_all" ON public.users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.1 Public read-only tables
ALTER TABLE public.destinations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_destinations"   ON public.destinations   FOR SELECT USING (true);
CREATE POLICY "public_read_faqs"           ON public.faqs           FOR SELECT USING (true);
CREATE POLICY "public_read_fleet"          ON public.fleet          FOR SELECT USING (true);
CREATE POLICY "public_read_gallery_images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "public_read_team_members"   ON public.team_members   FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"   ON public.testimonials   FOR SELECT USING (true);
CREATE POLICY "public_read_tour_packages"  ON public.tour_packages  FOR SELECT USING (true);
CREATE POLICY "public_read_site_settings"  ON public.site_settings  FOR SELECT USING (true);

-- Admin write on the public-read tables above
CREATE POLICY "admin_write_destinations"   ON public.destinations   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_faqs"           ON public.faqs           FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_fleet"          ON public.fleet          FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_gallery_images" ON public.gallery_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_team_members"   ON public.team_members   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_testimonials"   ON public.testimonials   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_tour_packages"  ON public.tour_packages  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write_site_settings"  ON public.site_settings  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.2 partners — admin-managed (not shown publicly by default)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_partners" ON public.partners
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.3 bookings — admin only (no public read; customers have no auth in this model)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_bookings" ON public.bookings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.4 invoices — admin only
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_invoices" ON public.invoices
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6.5 inquiries — public INSERT (lead capture); admin read/manage
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_inquiries" ON public.inquiries
  FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_update_inquiries" ON public.inquiries
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_inquiries" ON public.inquiries
  FOR DELETE USING (public.is_admin());

-- ============================================================================
-- 7. NOTES FOR NEXT STEP (ETL — NOT performed in this file)
-- ----------------------------------------------------------------------------
-- * Create the admin in Supabase Auth (arrafahvega@gmail.com, role='admin'),
--   then INSERT into public.users (id='6a0947b7b4a68dcdea755505',
--   auth_user_id=<supabase uuid>, email, role='admin').
-- * Import standalone tables in any order.
-- * bookings: resolve partner_name → partners.id (partner_id) and
--   package_name → tour_packages.id (package_id); parse invoice_amount → NUMERIC.
-- * invoices: booking_id already matches bookings.id; parse amount /
--   tax_percentage → NUMERIC; line_items → JSONB.
-- * Decide on is_sample rows (currently all 'false' in exports).
-- * Bilingual _en / _id columns are preserved as separate columns (i18n).
-- ============================================================================