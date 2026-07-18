-- ============================================================================
-- Migration 002: Auto-create public.users row on auth.users insert
-- ----------------------------------------------------------------------------
-- When an admin invites a user via supabase.auth.admin.inviteUserByEmail(),
-- a record is created in auth.users but no corresponding row is created in
-- public.users. This trigger fills that gap automatically.
--
-- The trigger:
--   1. Fires AFTER INSERT on auth.users
--   2. Creates a matching public.users row with:
--      - id: 24-char hex string (compatible with existing VARCHAR(24) PK)
--      - auth_user_id: the auth.users UUID
--      - email: from the auth.users record
--      - name: from raw_user_meta_data->>'full_name' if present, else email
--      - role: from raw_user_meta_data->>'role' if present, defaults to 'user'
-- ============================================================================

-- Generate a 24-character hex string (compatible with existing VARCHAR(24) PK)
CREATE OR REPLACE FUNCTION public.generate_24char_id()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT encode(gen_random_bytes(12), 'hex');
$$;

-- Trigger function: insert matching public.users row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, auth_user_id, email, name, role)
  VALUES (
    public.generate_24char_id(),
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();