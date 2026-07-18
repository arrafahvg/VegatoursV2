# VegatoursV2 — Supabase CSV Import Guide

## Critical: Import Order

Foreign keys require parent records to exist first. Follow this order:

```
1. setup-admin-user.sql     (creates the admin user referenced by all rows)
2. users (if you have a CSV export)
3. destinations
4. faqs
5. fleet
6. gallery_images
7. inquiries
8. partners
9. site_settings
10. team_members
11. testimonials
12. tour_packages
13. bookings                (references partners, tour_packages, users)
14. invoices               (references bookings)
```

## Step 1 — Create the Admin User

Run this **first** in the Supabase SQL Editor:

```sql
-- File: supabase/setup-admin-user.sql
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
```

Verify:
```sql
SELECT id, email, name, role FROM public.users WHERE id = '6a0947b7b4a68dcdea755505';
```

Expected: 1 row with `id = 6a0947b7b4a68dcdea755505`.

## Step 2 — Clean Numeric Fields in CSVs

Some CSVs contain formatted currency strings like `"IDR 600,000"` which cannot be inserted into `NUMERIC` columns. Clean them first using:

```
python supabase/clean_csv.py
```

This generates `clean_Fleet_export.csv`, `clean_TourPackage_export.csv`, and `clean_Booking_export.csv` in `Vegatours_Data/`. Use these cleaned files for import.

### Table CSV Column Mapping

The CSV headers should map directly to these columns. Check your CSV files have these columns:

| Table | Required CSV columns |
|-------|----------------------|
| destinations | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| faqs | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| fleet | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| gallery_images | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| inquiries | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| partners | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| site_settings | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| team_members | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| testimonials | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |
| tour_packages | id, created_date, updated_date, created_by_id, created_by, is_sample, + content columns |

## Step 3 — Import Bookings

After all standalone tables are imported:

1. Import `Booking_export.csv` to `bookings`
2. If you get foreign key errors for `partner_id` or `package_id`, that's expected if those referenced records don't exist in `partners` or `tour_packages` yet. The CSV values in `partner_name` and `package_name` are denormalized fallbacks.

## Common Errors

### `ERROR: 23503: insert or update on table "bookings" violates foreign key constraint "bookings_created_by_id_fkey"`

**Cause:** The `created_by_id` value in the CSV does not exist in `public.users`.

**Fix:** Run the admin user setup script first (Step 1), then re-import.

### `ERROR: 23505: duplicate key value violates unique constraint`

**Cause:** You already imported some rows and are trying again.

**Fix:** Delete existing rows first, or use `ON CONFLICT DO NOTHING` via SQL:
```sql
-- Example: clear and reimport destinations
DELETE FROM public.destinations;
-- Then re-import CSV via dashboard
```

## Step 4 — Import Invoices

Finally import invoices. They reference `bookings(id)`.

1. Import your invoices CSV to `invoices`
2. Verify with:
```sql
SELECT COUNT(*) FROM public.invoices;
```

## Step 5 — Verify RLS is Active

After all imports, verify RLS is still enabled:

```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
    'users','destinations','faqs','fleet','gallery_images',
    'inquiries','partners','site_settings','team_members',
    'testimonials','tour_packages','bookings','invoices'
);
```

Expected: All 13 rows show `rowsecurity = true`.

## Troubleshooting

- **"relation X does not exist"**: Table wasn't created. Run `supabase/schema.sql` first.
- **"column Y does not exist"**: CSV header name doesn't match the column name in the table. Check spelling.
- **Permission denied**: Make sure you're running as the project owner/service role, not anon.

## ETL Notes

- All CSV `id` values are Base44 24-char hex IDs — they map 1:1 to `VARCHAR(24)` columns.
- `created_by_id = 6a0947b7b4a68dcdea755505` in all CSVs refers to the admin user you created in Step 1.
- If your CSVs have different `created_by_id` values, create those users first or update the CSV.
- When using the Supabase Dashboard CSV importer, it imports data directly; no SQL file is generated.