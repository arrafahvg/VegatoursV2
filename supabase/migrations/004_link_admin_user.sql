-- ============================================================================
-- Migration 004: Link arrafahvega@gmail.com as Admin
-- ----------------------------------------------------------------------------
-- Run this AFTER the user has successfully logged in at least once
-- (so their auth.users record exists).
--
-- This script:
--   1. Finds the auth.users record for arrafahvega@gmail.com
--   2. Updates the existing public.users admin row with the correct auth_user_id
--   3. Ensures the role is 'admin'
-- ============================================================================

-- Link the admin user
UPDATE public.users
SET
  auth_user_id = (SELECT id FROM auth.users WHERE email = 'arrafahvega@gmail.com'),
  role = 'admin',
  name = 'Admin User',
  updated_date = now()
WHERE email = 'arrafahvega@gmail.com'
  AND auth_user_id IS NULL;

-- Verify
SELECT
  u.id,
  u.email,
  u.name,
  u.role,
  u.auth_user_id,
  CASE WHEN a.id IS NOT NULL THEN '✅ Linked' ELSE '❌ Not linked' END as status
FROM public.users u
LEFT JOIN auth.users a ON a.id = u.auth_user_id
WHERE u.email = 'arrafahvega@gmail.com';