-- ============================================================================
-- Migration 011: Create the 'public' storage bucket.
-- Migration 003 only created RLS policies for this bucket — the bucket itself
-- was never created, so admin image uploads failed with "Bucket not found".
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, name, public FROM storage.buckets;