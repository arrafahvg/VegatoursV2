-- ============================================================================
-- Setup Admin User for VegatoursV2
-- ============================================================================
-- Run this BEFORE importing CSV data into other tables.
-- It creates the public.users record that all CSV rows reference via created_by_id.
-- auth_user_id is left NULL initially; link it after first admin login if desired.
-- ============================================================================

-- Create the public.users record that satisfies the foreign key in bookings/invoices/etc.
INSERT INTO public.users (
    id,
    email,
    name,
    role,
    created_date,
    updated_date,
    is_sample
) VALUES (
    '6a0947b7b4a68dcdea755505',
    'arrafahvega@gmail.com',
    'Admin User',
    'admin',
    now(),
    now(),
    false
)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, email, name, role, auth_user_id
FROM public.users
WHERE id = '6a0947b7b4a68dcdea755505';
