-- ============================================================================
-- VegatoursV2 — Demo Seed Data
-- ============================================================================
-- This script adds dummy data for demonstration purposes.
-- Run AFTER schema.sql, setup-admin-user.sql, and import-data.sql
-- All tables get at least 4 entries (most already have 5-6 from import-data.sql)
-- ============================================================================

-- ============================================================================
-- 1. BIKES (4 entries — table is currently empty)
-- ============================================================================
INSERT INTO public.bikes (features, price, image_url, name, terms_id, includes_en, terms_en, includes_id, type, sort_order, capacity, price_note, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('["Helmet Included","Phone Holder","Fuel Efficient","Easy Ride"]',150000,'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80','Honda Vario 125','["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk"]','["Helmet","Basic Insurance"]','["Daily (24 hr)","Pricing is subject to change","Fuel not included"]','["Helm","Asuransi Dasar"]','Automatic','1','125cc','Excludes fuel and toll fees','6a6000010000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('["Helmet Included","Phone Holder","Sporty Design","Powerful Engine"]',200000,'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80','Yamaha NMAX 155','["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk"]','["Helmet","Basic Insurance"]','["Daily (24 hr)","Pricing is subject to change","Fuel not included"]','["Helm","Asuransi Dasar"]','Automatic','2','155cc','Excludes fuel and toll fees','6a6000010000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('["Helmet Included","Adventure Style","Durable","Off-Road Ready"]',250000,'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80','Honda CRF150L','["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk"]','["Helmet","Basic Insurance"]','["Daily (24 hr)","Pricing is subject to change","Fuel not included"]','["Helm","Asuransi Dasar"]','Manual','3','150cc','Ideal for off-road adventures','6a6000010000000000000003','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('["Helmet Included","Scooter Style","Storage Box","Easy Parking"]',100000,'https://images.unsplash.com/photo-1572307480818-3149e2b0e8f0?w=800&q=80','Yamaha Mio M3','["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk"]','["Helmet","Basic Insurance"]','["Daily (24 hr)","Pricing is subject to change","Fuel not included"]','["Helm","Asuransi Dasar"]','Automatic','4','125cc','Perfect for city riding','6a6000010000000000000004','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 2. INVOICES (add 3 more — currently has 2)
-- ============================================================================
INSERT INTO public.invoices (booking_id, amount, notes, tax_percentage, due_date, currency, label, line_items, invoice_number, payment_method, status, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('6a52e8ce2a9dfa0db91ff03b',935000,'Full payment received','10','2026-07-15','IDR','Full Payment','[{"description":"Ubud Highlight Tour","amount":850000},{"description":"Additional Insurance","amount":85000}]','INV-VBT-100001-2026','bank_transfer','paid','6a6000020000000000000001','2026-07-12T08:00:00.000000','2026-07-12T08:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('6a52e8ce2a9dfa0db91ff03e',1595000,'Down payment 50% received','10','2026-08-01','IDR','Down Payment','[{"description":"Nusa Penida Tour","amount":1450000},{"description":"Snorkeling Equipment","amount":145000}]','INV-VBT-100004-2026','bank_transfer','paid','6a6000020000000000000002','2026-07-15T10:30:00.000000','2026-07-15T10:30:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('6a52e8ce2a9dfa0db91ff03f',1045000,'','10','2026-06-20','IDR','Full Payment','[{"description":"Kintamani Volcano Tour","amount":950000},{"description":"Lunch Package","amount":95000}]','INV-VBT-100005-2026','cash','paid','6a6000020000000000000003','2026-06-20T09:00:00.000000','2026-06-20T09:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 3. TOUR PACKAGES (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.tour_packages (highlights_id, image_url, duration_id, description_en, title_id, cta_text_id, highlights_en, duration_en, description_id, is_popular, price, title_en, currency, sort_order, cta_text_en, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('["Taman Budaya GWK","Pantai Pandawa","Pura Uluwatu","Jimbaran Bay"]','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','Sehari Penuh (10 Jam)','Explore the stunning southern coast of Bali with its iconic cultural park, pristine beaches, and breathtaking sunset dinner.','Tur Bali Selatan','Pesan Tur Ini','["GWK Cultural Park","Pandawa Beach","Uluwatu Temple","Jimbaran Bay Seafood Dinner"]','Full Day (10 Hours)','Jelajahi pantai selatan Bali yang menakjubkan dengan taman budaya ikonik, pantai indah, dan makan malam matahari terbenam.','true',1050000,'South Bali Discovery','IDR','7','Book This Tour','6a6000030000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('["Pura Tanah Lot","Pura Ulun Danu","Pura Taman Ayun","Pasar Seni Sukawati"]','https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80','Sehari Penuh (10 Jam)','Visit Bali''s most iconic temples in a single day, from the sea temple Tanah Lot to the floating temple Ulun Danu.','Tur Pura Ikonik','Pesan Tur Ini','["Tanah Lot Temple","Ulun Danu Temple","Taman Ayun Temple","Sukawati Art Market"]','Full Day (10 Hours)','Kunjungi pura paling ikonik di Bali dalam satu hari, dari pura laut Tanah Lot hingga pura terapung Ulun Danu.','false',1200000,'Iconic Temples Tour','IDR','8','Book This Tour','6a6000030000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 4. FLEET (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.fleet (features, price, image_url, name, terms_id, includes_en, terms_en, includes_id, type, sort_order, capacity, price_note, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('["Air Conditioned","Private Driver","Luxury Interior","Premium Sound System"]',2000000,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80','Toyota Alphard','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','MPV','6','7','Premium VIP experience','6a6000040000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('["Air Conditioned","Private Driver","Convertible","Beach Ready"]',1500000,'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80','Suzuki Jimny','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','SUV','7','4','Perfect for off-road beach adventures','6a6000040000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 5. BOOKINGS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.bookings (end_date, invoice_notes, booking_code, customer_country, pax, partner_name, customer_phone, service_notes, itinerary, invoice_paid, invoice_amount, pic_name, pic_email, internal_notes, pic_phone, customer_email, package_name, tour_date, customer_name, invoice_currency, status, partner_id, package_id, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('2026-09-10','','VBT-100006','Germany','2','Island Escape Travel','4915123456789','Anniversary trip — please prepare flowers','Ubud Monkey Forest
Tegallalang Rice Terrace
Tirta Empul Temple
Coffee Plantation','false',850000,'Jennifer Lee','jennifer@islandescape.sg','VIP couple — anniversary surprise','6598765432','klaus.mueller@email.com','Ubud Highlight Tour','2026-09-10','Klaus Mueller','IDR','confirmed','6a52e8ce2a9dfa0db91ff02d','6a0949a0b4a68dcdea755532','6a6000050000000000000001','2026-07-18T14:00:00.000000','2026-07-18T14:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('2026-10-05','','VBT-100007','South Korea','6','Bali Adventure Tours','821012345678','Group of friends — need Hiace','Kintamani Volcano View
Tirta Empul Temple
Coffee Plantation
Tegallalang Rice Terrace','true',1200000,'Andi Pratama','andi@baliadventure.id','Group booking — deposit received','6281234567890','park.minjun@email.com','Kintamani Volcano Tour','2026-10-05','Park Min-Jun','IDR','confirmed','6a52e8ce2a9dfa0db91ff02c','6a52e8ce2a9dfa0db91ff04e','6a6000050000000000000002','2026-07-19T09:00:00.000000','2026-07-19T09:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 6. DESTINATIONS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.destinations (desc_id, desc_en, name_id, sort_order, image_url, name_en, is_featured, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Kawasan pantai eksklusif dengan resor mewah, klub pantai, dan kehidupan malam.','Exclusive beach area with luxury resorts, beach clubs, and vibrant nightlife.','Seminyak','7','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80','Seminyak','true','6a6000060000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Pusat budaya dan sejarah Bali dengan istana kerajaan dan pasar seni tradisional.','Bali''s cultural and historical heart with royal palace and traditional art market.','Gianyar','8','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','Gianyar','false','6a6000060000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 7. FAQS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.faqs (question_en, answer_en, question_id, answer_id, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('What happens if my flight is delayed?','No worries! We monitor all flight schedules and adjust pickup times accordingly. There is no extra charge for waiting due to flight delays.','Bagaimana jika penerbangan saya tertunda?','Tidak perlu khawatir! Kami memantau semua jadwal penerbangan dan menyesuaikan waktu penjemputan. Tidak ada biaya tambahan untuk menunggu akibat keterlambatan penerbangan.','7','6a6000070000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Do you offer car seats for children?','Yes, we can provide child car seats upon request. Please inform us at the time of booking so we can prepare one for you.','Apakah Anda menyediakan kursi mobil untuk anak-anak?','Ya, kami dapat menyediakan kursi mobil anak sesuai permintaan. Harap beri tahu kami saat pemesanan agar kami dapat menyiapkannya.','8','6a6000070000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 8. GALLERY IMAGES (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.gallery_images (caption_id, caption_en, sort_order, image_url, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Pantai Seminyak','Seminyak Beach','7','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80','6a6000080000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Pura Tanah Lot','Tanah Lot Temple','8','https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80','6a6000080000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 9. INQUIRIES (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.inquiries (name, travel_dates, message, email, status, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Maria Garcia','November 15-20, 2026','Hola! We are a group of 8 friends looking for a 5-day Bali tour. We want to visit Ubud, Nusa Penida, and Uluwatu. Can you arrange transportation and itinerary for us?','maria.garcia@email.com','new','6a6000090000000000000001','2026-07-18T16:00:00.000000','2026-07-18T16:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Thomas Anderson','January 2027','Looking for a motorcycle rental for 2 weeks in January. I need an automatic scooter. Also interested in a day tour to Kintamani.','thomas.anderson@email.com','new','6a6000090000000000000002','2026-07-19T11:00:00.000000','2026-07-19T11:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 10. PARTNERS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.partners (notes, is_active, website_url, pic_phone, logo_url, name, publish_on_website, description, sort_order, email, pic_name, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Specializes in Japanese market tours','true','81312345678','','','Sakura Bali Tours','true','Japan-focused tour operator bringing quality travelers to Bali','6','tanaka@sakurabali.jp','Kenji Tanaka','6a60000a0000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Handles European market luxury travel','true','33123456789','','','EuroBali Luxe','true','European luxury travel agency specializing in premium Bali experiences','7','claire@eurobaliluxe.fr','Claire Dubois','6a60000a0000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 11. SITE SETTINGS (add 2 more — currently has 5)
-- ============================================================================
INSERT INTO public.site_settings (value, key, label, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Vegatours — Bali Private Tour & Transport','site_title','Site Title (Browser Tab)','6a60000b0000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Your trusted partner for exploring Bali with private tours, fleet rental, and motorcycle hire.','site_description','Site Description (Meta)','6a60000b0000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 12. TEAM MEMBERS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.team_members (role_en, bio_id, role_id, bio_en, name, photo_url, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Marketing & Social Media','Mengelola kehadiran digital Vegatours dan menciptakan konten menarik tentang Bali.','Pemasaran & Media Sosial','Manages Vegatours'' digital presence and creates engaging content about Bali.','Ayu Lestari','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80','7','6a60000c0000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Tour Guide Specialist','Pemandu wisata berpengalaman dengan pengetahuan mendalam tentang sejarah dan budaya Bali.','Spesialis Pemandu Wisata','Experienced tour guide with deep knowledge of Balinese history and culture.','Gede Darmawan','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80','8','6a60000c0000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 13. TESTIMONIALS (add 2 more — currently has 6)
-- ============================================================================
INSERT INTO public.testimonials (author_name, rating, quote, author_location, author_photo, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Sophie Martin','5','We rented a scooter for a week and it was perfect! The bike was in great condition and delivery was on time. Highly recommend!','France','','7','6a60000d0000000000000001','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true'),
('Hiroshi Tanaka','5','Our family of 5 had an amazing Kintamani tour. The driver was very knowledgeable and patient with our children. Thank you Vegatours!','Japan','','8','6a60000d0000000000000002','2026-07-19T00:00:00.000000','2026-07-19T00:00:00.000000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','true')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 14. VERIFICATION — Show row counts for all tables
-- ============================================================================
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM public.users
UNION ALL SELECT 'destinations', COUNT(*) FROM public.destinations
UNION ALL SELECT 'faqs', COUNT(*) FROM public.faqs
UNION ALL SELECT 'fleet', COUNT(*) FROM public.fleet
UNION ALL SELECT 'bikes', COUNT(*) FROM public.bikes
UNION ALL SELECT 'gallery_images', COUNT(*) FROM public.gallery_images
UNION ALL SELECT 'inquiries', COUNT(*) FROM public.inquiries
UNION ALL SELECT 'partners', COUNT(*) FROM public.partners
UNION ALL SELECT 'site_settings', COUNT(*) FROM public.site_settings
UNION ALL SELECT 'team_members', COUNT(*) FROM public.team_members
UNION ALL SELECT 'testimonials', COUNT(*) FROM public.testimonials
UNION ALL SELECT 'tour_packages', COUNT(*) FROM public.tour_packages
UNION ALL SELECT 'bookings', COUNT(*) FROM public.bookings
UNION ALL SELECT 'invoices', COUNT(*) FROM public.invoices
ORDER BY table_name;