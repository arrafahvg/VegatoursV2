# Base44 to Supabase Migration - Complete

## ✅ Migration Summary

All Base44 data operations have been successfully replaced with Supabase across the entire application.

### Files Migrated

**Public Pages (Read-Only):**
- `src/components/landing/FAQs.jsx`
- `src/components/landing/Destinations.jsx`
- `src/components/landing/Gallery.jsx`
- `src/components/landing/Team.jsx`
- `src/components/landing/Testimonials.jsx`
- `src/components/landing/Partners.jsx`
- `src/components/landing/Packages.jsx`

**Public Create Forms:**
- `src/components/landing/Contact.jsx` (Inquiry creation)

**Full Pages:**
- `src/pages/PackagesPage.jsx` (TourPackage + Fleet)
- `src/pages/TeamPage.jsx`

**Admin Pages:**
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminCRM.jsx` (Booking CRUD)
- `src/pages/admin/AdminInquiries.jsx` (Inquiry status updates)
- `src/pages/admin/AdminUsers.jsx` (User management + invitations)
- `src/pages/admin/AdminSettings.jsx` (Site settings)
- `src/pages/admin/AdminPaymentSettings.jsx` (Payment config + QRIS upload)
- `src/components/admin/EntityManager.jsx` (Generic CRUD for all entities)

**Authentication:**
- `src/lib/AuthContext.jsx` (Login/logout, session management)
- `src/components/admin/AdminAuthGuard.jsx` (Admin route protection)
- `src/lib/PageNotFound.jsx` (Auth check for admin note)

**New Files Created:**
- `src/lib/supabase.js` - Centralized Supabase client

## 🔧 Setup Required

### 1. Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

**Important:** The `VITE_` prefix is required for Vite to expose these variables to browser code.

### 2. Supabase Storage Bucket

Create a storage bucket named `public` in your Supabase project:
- Go to Supabase Dashboard → Storage → Create bucket
- Name: `public`
- Set as public bucket
- This is used for file uploads (QRIS images, gallery images, etc.)

### 3. Row Level Security (RLS)

The schema (`supabase/schema.sql`) already includes RLS policies. Make sure they're enabled:

**Public Read Access:**
- `destinations`, `faqs`, `fleet`, `gallery_images`, `team_members`, `testimonials`, `tour_packages`, `site_settings` - Public can SELECT, admins can do all

**Admin Only:**
- `bookings`, `invoices`, `partners` - Admin only

**Public Insert:**
- `inquiries` - Public can INSERT (contact form), admins can manage

**Users:**
- Users can read own profile, admins have full access

### 4. Enable Google OAuth (Optional)

For admin login, enable Google OAuth in Supabase:
- Go to Supabase Dashboard → Authentication → Providers → Google
- Add your Google OAuth credentials
- Update the redirect URLs

## 🧪 Testing

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test the following:
   - Public pages load data from Supabase
   - Contact form creates inquiries
   - Admin pages load with data
   - Admin can create/edit/delete records
   - File uploads work (QRIS, gallery images)
   - Login/logout works (if OAuth configured)

## 📝 Notes

- All Base44 SDK imports have been removed from migrated files
- The old `src/lib/db.js` still exists but is no longer imported anywhere
- Entity names are automatically converted to snake_case table names in `EntityManager`
- File uploads now use Supabase Storage instead of Base44 integrations
- User invitations use Supabase Auth `inviteUserByEmail`

## 🚀 Next Steps

1. Test all pages thoroughly
2. Create the 'public' storage bucket in Supabase
3. Run the schema.sql to create tables (if not already done)
4. Import data from Base44 CSV exports if needed
5. Remove `@base44/sdk` and `@base44/vite-plugin` dependencies when fully confident:
   ```bash
   npm uninstall @base44/sdk @base44/vite-plugin
   ```
6. Delete `src/lib/db.js` and `src/api/base44Client.js` if no longer needed

## ⚠️ Known Differences

- Base44's `list('sort_order')` → Supabase `.select('*').order('sort_order', { ascending: true })`
- Base44's `filter({ field: value }, 'sort_order')` → Supabase `.select('*').eq('field', value).order('sort_order')`
- Base44's `create(data)` → Supabase `.insert(data)`
- Base44's `update(id, data)` → Supabase `.update(data).eq('id', id)`
- Base44's `delete(id)` → Supabase `.delete().eq('id', id)`
- File uploads changed from `db.integrations.Core.UploadFile({ file })` to `supabase.storage.from('public').upload(fileName, file)`

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Ensure RLS policies are correctly configured
4. Check that the storage bucket exists and is public