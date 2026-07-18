-- ============================================================================
-- Migration 003: Storage RLS policies for the 'public' bucket
-- ----------------------------------------------------------------------------
-- By default, a Supabase Storage bucket with no policies rejects ALL
-- operations (SELECT, INSERT, DELETE). This migration creates the policies
-- needed for the VegatoursV2 app:
--
--   SELECT (read)  → anyone (public images served to the website)
--   INSERT (upload) → authenticated users only (admins uploading via CMS)
--   DELETE          → authenticated users only (admins deleting via CMS)
--
-- The bucket name is 'public' — referenced in:
--   src/components/admin/EntityManager.jsx
--   src/pages/admin/AdminPaymentSettings.jsx
-- ============================================================================

-- Allow anyone to view/download files from the public bucket
CREATE POLICY "public_read_objects"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public');

-- Allow authenticated users to upload files to the public bucket
CREATE POLICY "authenticated_insert_objects"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files from the public bucket
CREATE POLICY "authenticated_delete_objects"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
  );