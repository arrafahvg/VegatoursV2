-- ============================================================================
-- VegatoursV2 — Delete Customer Seed Data
-- ============================================================================
-- Removes all demo/sample customer-related data while preserving the admin user.
-- Tables affected: inquiries, bookings, invoices
-- Admin user (6a0947b7b4a68dcdea755505) is preserved.
-- ============================================================================

-- Delete all invoices (references bookings via booking_id)
DELETE FROM public.invoices;

-- Delete all bookings (customer tour bookings)
DELETE FROM public.bookings;

-- Delete all inquiries (contact form submissions)
DELETE FROM public.inquiries;

-- Delete all non-admin users (preserve admin account)
DELETE FROM public.users WHERE id != '6a0947b7b4a68dcdea755505';

-- ============================================================================
-- VERIFICATION — Confirm deletion
-- ============================================================================
SELECT 'inquiries' AS table_name, COUNT(*) AS row_count FROM public.inquiries
UNION ALL SELECT 'bookings', COUNT(*) FROM public.bookings
UNION ALL SELECT 'invoices', COUNT(*) FROM public.invoices
UNION ALL SELECT 'users (total)', COUNT(*) FROM public.users
UNION ALL SELECT 'users (admin)', COUNT(*) FROM public.users WHERE role = 'admin'
ORDER BY table_name;