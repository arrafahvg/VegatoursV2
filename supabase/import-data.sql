-- ============================================================================
-- VegatoursV2 — Data Import Script
-- ============================================================================
-- Run after supabase/schema.sql and supabase/setup-admin-user.sql
-- This imports all CSV data in foreign-key-safe order.
-- ============================================================================

-- ============================================================================
-- 1. ADMIN USER (already created by setup-admin-user.sql, but included for idempotency)
-- ============================================================================
INSERT INTO public.users (
    id, email, name, role, created_date, updated_date, is_sample
) VALUES (
    '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', 'Admin User', 'admin', now(), now(), false
) ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 2. DESTINATIONS (from clean_Destination_export.csv)
-- ============================================================================
INSERT INTO public.destinations (desc_id, desc_en, name_id, sort_order, image_url, name_en, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Jantung budaya Bali — sawah terasering, galeri seni, dan hutan monyet suci.','The cultural heart of Bali — rice terraces, art galleries, and sacred monkey forests.','Ubud','1','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/1fe8cf542_generated_084a8e86.png','Ubud','6a52e8ce2a9dfa0db91ff031','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Pura di tebing dramatis, ombak kelas dunia, dan matahari terbenam tak terlupakan.','Dramatic cliffside temples, world-class surf, and unforgettable sunsets.','Uluwatu','2','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/28104aa99_generated_e7144566.png','Uluwatu','6a52e8ce2a9dfa0db91ff032','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Kota pantai trendi dengan kafe vibran, sawah, dan budaya surfing santai.','Trendy beach town with vibrant cafés, rice paddies, and laid-back surf culture.','Canggu','3','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/ccce4275a_generated_33e66145.png','Canggu','6a52e8ce2a9dfa0db91ff033','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Lanskap vulkanik, pemandian air panas, dan panorama Gunung Batur.','Volcanic landscapes, hot springs, and panoramic views of Mount Batur.','Kintamani','4','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/9898ff6d6_generated_6d2746a6.png','Kintamani','6a52e8ce2a9dfa0db91ff034','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Surga pulau perawan dengan tebing dramatis, air kristal, dan pantai tersembunyi.','Untouched island paradise with dramatic cliffs, crystal waters, and hidden beaches.','Nusa Penida','5','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/e0056c408_generated_c2f898cb.png','Nusa Penida','6a52e8ce2a9dfa0db91ff035','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Pantai utara yang damai terkenal dengan lumba-lumba dan pantai pasir hitam.','Peaceful northern coast known for dolphin watching and black sand beaches.','Lovina','6','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/6eea12b69_generated_7471fe55.png','Lovina','6a52e8ce2a9dfa0db91ff036','2026-07-12T01:07:26.023000','2026-07-12T01:07:26.023000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 3. FAQS (from clean_FAQ_export.csv)
-- ============================================================================
INSERT INTO public.faqs (question_en, answer_en, question_id, answer_id, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('What is included in the tour price?','Our tour prices include a private driver, air-conditioned vehicle, and fuel. Parking fees, entrance tickets to attractions, meals, and driver tips are not included unless stated otherwise.','Apa saja yang termasuk dalam harga tur?','Harga tur kami termasuk pengemudi privat, kendaraan ber-AC, dan bahan bakar. Biaya parkir, tiket masuk atraksi, makanan, dan tip pengemudi tidak termasuk kecuali dinyatakan lain.','6','6a52e8ce2a9dfa0db91ff030','2026-07-12T01:07:26.017000','2026-07-12T01:07:26.017000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('What areas of Bali do you cover?','We cover all areas of Bali including Ubud, Uluwatu, Canggu, Kintamani, Nusa Penida, Lovina, and more. Our tours can be customized to visit any destination on the island.','Area Bali mana saja yang Anda layani?','Kami melayani seluruh area Bali termasuk Ubud, Uluwatu, Canggu, Kintamani, Nusa Penida, Lovina, dan lainnya. Tur kami dapat disesuaikan untuk mengunjungi destinasi mana pun di pulau ini.','1','6a0949a0b4a68dcdea75552d','2026-05-17T04:52:48.446000','2026-05-17T04:52:48.446000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Can I customize my itinerary?','Absolutely! We specialize in custom private tours. Simply share your preferences and our travel facilitator will design the perfect itinerary for you.','Bisakah saya menyesuaikan itinerari saya?','Tentu saja! Kami ahli dalam tur privat kustom. Cukup bagikan preferensi Anda dan fasilitator perjalanan kami akan merancang itinerari sempurna untuk Anda.','2','6a0949a0b4a68dcdea75552e','2026-05-17T04:52:48.446000','2026-05-17T04:52:48.446000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Do you provide airport transfer?','Yes, we provide comfortable airport pickup and drop-off services. Our driver will be waiting for you at the airport with a name sign.','Apakah Anda menyediakan transfer bandara?','Ya, kami menyediakan layanan antar-jemput bandara yang nyaman. Pengemudi kami akan menunggu Anda di bandara dengan papan nama.','3','6a0949a0b4a68dcdea75552f','2026-05-17T04:52:48.446000','2026-05-17T04:52:48.446000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Are the tours private?','Yes, all our tours are private. You will have your own dedicated driver and vehicle, giving you complete flexibility throughout the day.','Apakah turnya privat?','Ya, semua tur kami bersifat privat. Anda akan memiliki pengemudi dan kendaraan khusus sendiri, memberikan Anda fleksibilitas penuh sepanjang hari.','4','6a0949a0b4a68dcdea755530','2026-05-17T04:52:48.446000','2026-05-17T04:52:48.446000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('How do I book a tour?','Simply click the WhatsApp button on our website or contact us directly. Share your travel dates, preferred destinations, and group size, and we''ll arrange everything for you.','Bagaimana cara memesan tur?','Cukup klik tombol WhatsApp di website kami atau hubungi kami langsung. Bagikan tanggal perjalanan, destinasi pilihan, dan ukuran grup Anda, dan kami akan mengatur semuanya untuk Anda.','5','6a0949a0b4a68dcdea755531','2026-05-17T04:52:48.446000','2026-05-17T04:52:48.446000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 4. FLEET (from clean_Fleet_export.csv)
-- ============================================================================
INSERT INTO public.fleet (features, price, image_url, name, terms_id, includes_en, terms_en, includes_id, type, sort_order, capacity, price_note, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('["Air Conditioned","Private Driver","Comfortable Seats"]',600000,'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80','Toyota Avanza','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','MPV','2','6','Excludes parking, toll, and driver tips','6a52e8ce2a9dfa0db91ff037','2026-07-12T01:07:26.043000','2026-07-12T01:07:26.043000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Air Conditioned","Private Driver","Spacious Luggage","Premium Design"]',800000,'https://images.unsplash.com/photo-1606152421811-aa911307c6ae?w=800&q=80','Toyota Innova Reborn','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','SUV','3','7','Excludes parking, toll, and driver tips','6a52e8ce2a9dfa0db91ff038','2026-07-12T01:07:26.043000','2026-07-12T01:07:26.043000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Air Conditioned","Private Driver","Premium Leather Seats","Hybrid Engine"]',1000000,'https://images.unsplash.com/photo-1633500301918-89e4c8c8ee9e?w=800&q=80','Toyota Innova Zenix','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','MPV','4','7','Excludes parking, toll, and driver tips','6a52e8ce2a9dfa0db91ff039','2026-07-12T01:07:26.043000','2026-07-12T01:07:26.043000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Air Conditioned","Private Driver","Spacious Cabin","In-Cabin Utility"]',1100000,'https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=800&q=80','Hyundai H-1','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','Minibus','5','10','For trips to Kintamani, Bangli, Singaraja, and Buleleng, an additional fuel surcharge applies','6a52e8ce2a9dfa0db91ff03a','2026-07-12T01:07:26.043000','2026-07-12T01:07:26.043000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Spacious Cabin","Air Conditioned","In-Cabin Utility"]',1200000,'https://base44.app/api/apps/6a0947b7b4a68dcdea755504/files/mp/public/6a0947b7b4a68dcdea755504/380728a57_WhatsAppImage2026-06-02at104850AM.jpeg','Hiace Comuter','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','Minibus','0','14','For trips to Kintamani, Bangli, Singaraja, and Buleleng, an additional fuel surcharge applies','6a1e456b3f61727485bc8f72','2026-06-02T02:52:27.650000','2026-06-02T02:52:27.650000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Air Conditioned","In-Cabin Utility","Spacious Cabin","Premium Design"]',1400000,'https://base44.app/api/apps/6a0947b7b4a68dcdea755504/files/mp/public/6a0947b7b4a68dcdea755504/9c4371e69_2019_Toyota_HiAce_Premio_28_GDH322R_20190722.jpg','Hiace Premio','["Seharian (12 jam)","Harga dapat berubah sewaktu-waktu","Biaya lembur: 10%/jam"]','["Driver","Fuel"]','["Full Day (12 hr)","Pricing is subject to change at any time","Over time charge: 10%/hr"]','["Driver","Bahan Bakar"]','Minibus','0','12','For trips to Kintamani, Bangli, Singaraja, and Buleleng, an additional fuel surcharge applies','6a1e408daf89c1dc339e768f','2026-06-02T02:31:41.695000','2026-06-02T02:55:21.673000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 5. GALLERY IMAGES (from clean_GalleryImage_export.csv)
-- ============================================================================
INSERT INTO public.gallery_images (caption_id, caption_en, sort_order, image_url, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Sawah Terasering Bali','Bali Rice Terraces','1','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/9f1c5356b_generated_3ce0724a.png','6a0949a0b4a68dcdea755539','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Pura Bali','Balinese Temple','2','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/9763c0b98_generated_8d431c3a.png','6a0949a0b4a68dcdea75553a','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Air Terjun Tropis','Tropical Waterfall','3','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/155a4b800_generated_1504293f.png','6a0949a0b4a68dcdea75553b','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Air Terjun Tegenungan','Tegenungan Waterfall','4','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/539ce3bb0_generated_8ca5da63.png','6a0949a0b4a68dcdea75553c','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Pantai Nusa Penida','Nusa Penida Beach','5','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/b0d812535_generated_6dce3060.png','6a0949a0b4a68dcdea75553d','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Matahari Terbenam Uluwatu','Uluwatu Sunset','6','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/211e58426_generated_0819c442.png','6a0949a0b4a68dcdea75553e','2026-05-17T04:52:48.480000','2026-05-17T04:52:48.480000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 6. INQUIRIES (from clean_Inquiry_export.csv)
-- ============================================================================
INSERT INTO public.inquiries (name, travel_dates, message, email, status, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Marcus Weber','September 2026','Hello, I''m planning a 5-day trip to Bali in September with my wife. We''re interested in cultural tours and would love to visit Ubud and surrounding areas. Can you help us plan?','marcus.weber@email.com','new','6a52e8ce2a9dfa0db91ff046','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Priya Sharma','August 10-15, 2026','Hi! We''re a family of 4 (2 adults, 2 kids) looking for a private tour package. Interested in beach destinations and water activities. What do you recommend?','priya.sharma@email.com','new','6a52e8ce2a9dfa0db91ff047','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('David Wilson','October 2026','I need airport transfer from Denpasar to Ubud for 2 people on October 3rd. Flight lands at 2pm. What''s the rate?','david.wilson@email.com','contacted','6a52e8ce2a9dfa0db91ff048','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Yuki Sato','July 25-30, 2026','Hello, I would like to book the Nusa Penida day tour for 3 people. Is it possible to include snorkeling? Thank you!','yuki.sato@email.com','new','6a52e8ce2a9dfa0db91ff049','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Anna Kowalski','December 2026','Planning our honeymoon in Bali for 7 days. We want a mix of adventure and relaxation. Can you create a custom itinerary for us?','anna.kowalski@email.com','new','6a52e8ce2a9dfa0db91ff04a','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Robert Chen','August 2026','Looking for a Hiace rental with driver for a group of 12 for 3 days. Need airport pickup, Ubud tour, and Kintamani. Please send a quote.','robert.chen@email.com','contacted','6a52e8ce2a9dfa0db91ff04b','2026-07-12T01:07:26.066000','2026-07-12T01:07:26.066000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 7. PARTNERS (from clean_Partner_export.csv)
-- ============================================================================
INSERT INTO public.partners (notes, is_active, website_url, pic_phone, logo_url, name, publish_on_website, description, sort_order, email, pic_name, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Reliable partner for water sports packages','true','','6281234567890','','Bali Adventure Tours','true','Adventure tour specialist covering water sports and outdoor activities','2','andi@baliadventure.id','Andi Pratama','6a52e8ce2a9dfa0db91ff02c','2026-07-12T01:07:26.015000','2026-07-12T01:07:26.015000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Refers high-value Singaporean clients','true','','6598765432','','Island Escape Travel','true','Singapore-based travel agency specializing in Bali getaways','3','jennifer@islandescape.sg','Jennifer Lee','6a52e8ce2a9dfa0db91ff02d','2026-07-12T01:07:26.015000','2026-07-12T01:07:26.015000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Handles all Nusa Penida ferry bookings','true','','6285647382910','','Nusa Penida Express','true','Fast boat and island transfer specialist','4','wayan@nusapenidaexpress.com','Wayan Susila','6a52e8ce2a9dfa0db91ff02e','2026-07-12T01:07:26.015000','2026-07-12T01:07:26.015000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Villa guests often book our tours','true','','61412345678','','Premier Bali Stays','true','Australian villa rental and concierge service','5','rachel@premierbali.com.au','Rachel Morgan','6a52e8ce2a9dfa0db91ff02f','2026-07-12T01:07:26.015000','2026-07-12T01:07:26.015000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('','true','','','https://base44.app/api/apps/6a0947b7b4a68dcdea755504/files/mp/public/6a0947b7b4a68dcdea755504/71fbd28a5_LOGO_BS-removebg-preview.png','Blue Swan Bali','true','Bali-based travel partner offering curated tour packages and reliable transport.','1','','Bali-based travel partner offering curated tour packages and reliable transport.','6a1d42fcab6cc523d7054d63','2026-06-01T08:29:48.052000','2026-06-02T02:14:52.978000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Local transport and tour partner serving the Ubud and greater Bali area.','true','','88987540974','https://base44.app/api/apps/6a0947b7b4a68dcdea755504/files/mp/public/6a0947b7b4a68dcdea755504/7602c5f45_BudidharmatransTransparentbg1.png','Budi Dharma Trans','true','Local transport and tour partner serving the Ubud and greater Bali area.','0','','Ludhi','6a1d413d79686ba103af4d5a','2026-06-01T08:22:21.618000','2026-06-06T13:17:59.897000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 8. SITE SETTINGS (from clean_SiteSettings_export.csv)
-- ============================================================================
INSERT INTO public.site_settings (value, key, label, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('62896461000','whatsapp_number','WhatsApp Number','6a094fb98ac415d5665e08f0','2026-05-17T05:18:49.539000','2026-05-17T05:19:38.600000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Chat on WhatsApp','whatsapp_cta_en','WhatsApp CTA Button (English)','6a094fb98ac415d5665e08f1','2026-05-17T05:18:49.539000','2026-05-17T05:19:38.946000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Chat di WhatsApp','whatsapp_cta_id','WhatsApp CTA Button (Bahasa)','6a094fb98ac415d5665e08f2','2026-05-17T05:18:49.539000','2026-05-17T05:19:39.262000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Bali, Indonesia','contact_location','Location (Footer)','6a094fb98ac415d5665e08f3','2026-05-17T05:18:49.539000','2026-05-17T05:19:39.546000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('contact@vegatours.com','contact_email','Email (Footer)','6a094fb98ac415d5665e08f4','2026-05-17T05:18:49.539000','2026-05-17T05:19:39.894000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 9. TEAM MEMBERS (from clean_TeamMember_export.csv)
-- ============================================================================
INSERT INTO public.team_members (role_en, bio_id, role_id, bio_en, name, photo_url, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Founder & Lead Travel Facilitator','Lahir dan besar di Bali, Ketut memiliki pengalaman lebih dari 15 tahun di industri pariwisata. Ia mendirikan Vegatours untuk berbagi cintanya pada pulau ini dengan dunia.','Pendiri & Fasilitator Perjalanan Utama','Born and raised in Bali, Ketut has over 15 years of experience in the travel industry. He founded Vegatours to share his love for the island with the world.','Ketut Wijaya','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80','1','6a52e8ce2a9dfa0db91ff040','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Senior Tour Driver','Dengan pengetahuan mendalam tentang jalan dan tempat tersembunyi di Bali, Made memastikan setiap perjalanan lancar, aman, dan berkesan.','Pengemudi Tur Senior','With a deep knowledge of Bali''s roads and hidden gems, Made ensures every journey is smooth, safe, and memorable.','Made Suartama','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','2','6a52e8ce2a9dfa0db91ff041','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Customer Experience Manager','Wayan berdedikasi memastikan setiap wisatawan merasa terurus dari pertanyaan pertama hingga pengantaran terakhir.','Manajer Pengalaman Pelanggan','Wayan is dedicated to making sure every traveler feels cared for from the first inquiry to the final drop-off.','Wayan Putri','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','3','6a52e8ce2a9dfa0db91ff042','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Fleet Coordinator','Nyoman menjaga armada kami dalam kondisi prima, memastikan setiap kendaraan bersih, nyaman, dan siap jalan.','Koordinator Armada','Nyoman keeps our fleet in pristine condition, ensuring every vehicle is clean, comfortable, and road-ready.','Nyoman Adi','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80','4','6a52e8ce2a9dfa0db91ff043','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Itinerary Specialist','Dewi merancang itinerari personal yang menyeimbangkan landmark ikonik dengan harta karun tersembunyi.','Spesialis Itinerari','Dewi crafts personalized itineraries that balance iconic landmarks with off-the-beaten-path treasures.','Dewi Anggraini','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','5','6a52e8ce2a9dfa0db91ff044','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Operations & Partnerships','Putu mengelola jaringan mitra kami di seluruh Bali, memastikan koordinasi yang mulus untuk setiap pemesanan.','Operasional & Kemitraan','Putu manages our partner network across Bali, ensuring seamless coordination for every booking.','Putu Arisana','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','6','6a52e8ce2a9dfa0db91ff045','2026-07-12T01:07:26.062000','2026-07-12T01:07:26.062000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 10. TESTIMONIALS (from clean_Testimonial_export.csv)
-- ============================================================================
INSERT INTO public.testimonials (author_name, rating, quote, author_location, author_photo, sort_order, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('Emma Thompson','5','Absolutely fantastic service! Our driver was punctual, friendly, and knew all the best spots. The Ubud tour exceeded our expectations.','Australia','','5','6a52e8ce2a9dfa0db91ff04c','2026-07-12T01:07:26.072000','2026-07-12T01:07:26.072000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Liam Chen','5','Booked the Nusa Penida tour and it was a dream come true. Crystal clear waters, stunning cliffs, and a seamless experience from start to finish.','Singapore','','6','6a52e8ce2a9dfa0db91ff04d','2026-07-12T01:07:26.072000','2026-07-12T01:07:26.072000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Sarah','5','Such a smooth and enjoyable trip! Everything was well arranged and our driver was very friendly.','Australia','','1','6a0949a0b4a68dcdea75553f','2026-05-17T04:52:48.484000','2026-05-17T04:52:48.484000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Michael','5','We booked a custom Bali trip and the itinerary was perfect. Great communication and service.','Singapore','','2','6a0949a0b4a68dcdea755540','2026-05-17T04:52:48.484000','2026-05-17T04:52:48.484000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('Diana','5','Excellent experience from start to finish. Very responsive and professional.','Indonesia','','3','6a0949a0b4a68dcdea755541','2026-05-17T04:52:48.484000','2026-05-17T04:52:48.484000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('James','5','The northern Bali tour was amazing. Beautiful views and great hospitality.','United Kingdom','','4','6a0949a0b4a68dcdea755542','2026-05-17T04:52:48.484000','2026-05-17T04:52:48.484000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 11. TOUR PACKAGES (from clean_TourPackage_export.csv)
-- ============================================================================
INSERT INTO public.tour_packages (highlights_id, image_url, duration_id, description_en, title_id, cta_text_id, highlights_en, duration_en, description_id, is_popular, price, title_en, currency, sort_order, cta_text_en, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('["Titik Pandang Gunung Batur","Pura Tirta Empul","Perkebunan Kopi","Sawah Terasering Tegallalang"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/3881b5277_generated_5a6ba6f5.png','Sehari Penuh (10 Jam)','Experience the breathtaking views of Mount Batur and the cultural heritage of Kintamani highlands.','Tur Gunung Berapi Kintamani','Pesan Tur Ini','["Mount Batur Viewpoint","Tirta Empul Temple","Coffee Plantation","Tegallalang Rice Terrace"]','Full Day (10 Hours)','Rasakan pemandangan menakjubkan Gunung Batur dan warisan budaya dataran tinggi Kintamani.','true',950000,'Kintamani Volcano Tour','IDR','6','Book This Tour','6a52e8ce2a9dfa0db91ff04e','2026-07-12T01:07:26.074000','2026-07-12T01:07:26.074000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Air Terjun Tegenungan","Sawah Terasering Tegallalang","Monkey Forest","Perkebunan Kopi"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/539ce3bb0_generated_8ca5da63.png','Sehari Penuh (10 Jam)','Discover Ubud''s iconic waterfall, sacred monkey forest, scenic rice terraces, and a relaxing coffee plantation visit.','Tur Highlight Ubud','Pesan Tur Ini','["Tegenungan Waterfall","Tegallalang Rice Terrace","Monkey Forest","Coffee Plantation"]','Full Day (10 Hours)','Rasakan ikon air terjun Ubud, hutan monyet suci, sawah terasering, dan kunjungan perkebunan kopi.','true',850000,'Ubud Highlight Tour','IDR','1','Book This Tour','6a0949a0b4a68dcdea755532','2026-05-17T04:52:48.468000','2026-05-17T05:59:42.808000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Pura Uluwatu","Pantai Melasti","Pertunjukan Kecak"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/211e58426_generated_0819c442.png','Setengah Hari','','Tur Matahari Terbenam Uluwatu','Pesan Tur Ini','["Uluwatu Temple","Melasti Beach","Kecak Show"]','Half Day','','false',750000,'Uluwatu Sunset Tour','IDR','2','Book This Tour','6a0949a0b4a68dcdea755533','2026-05-17T04:52:48.468000','2026-05-17T05:44:21.258000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Pantai Broken","Pantai Kelingking","Air Terjun Peguyangan"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/b0d812535_generated_6dce3060.png','Sehari Penuh','','Tur Nusa Penida','Pesan Tur Ini','["Broken Beach","Kelingking Beach","Peguyangan Waterfall"]','Full Day','','false',1450000,'Nusa Penida Tour','IDR','3','Book This Tour','6a0949a0b4a68dcdea755534','2026-05-17T04:52:48.468000','2026-05-17T07:11:56.942000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Lovina","Air Terjun Banyumala","Pura Ulun Danu"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/3881b5277_generated_5a6ba6f5.png','Sehari Penuh','','Pelarian Bali Utara','Pesan Tur Ini','["Lovina","Banyumala Waterfall","Ulun Danu Temple"]','Full Day','','false',1100000,'Northern Bali Escape','IDR','4','Book This Tour','6a0949a0b4a68dcdea755535','2026-05-17T04:52:48.468000','2026-05-17T04:52:48.468000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('["Itinerari fleksibel","Rekomendasi personal"]','https://media.base44.com/images/public/6a0947b7b4a68dcdea755504/6548558f5_generated_c64c4bb8.png','Fleksibel','','Tur Privat Kustom Bali','Rencanakan Perjalanan','["Flexible itinerary","Personalized recommendations"]','Flexible','','false',700000,'Bali Custom Private Tour','IDR','5','Plan Custom Trip','6a0949a0b4a68dcdea755536','2026-05-17T04:52:48.468000','2026-05-17T04:52:48.468000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 12. BOOKINGS (from clean_Booking_export.csv)
-- ============================================================================
INSERT INTO public.bookings (end_date, invoice_notes, booking_code, customer_country, pax, partner_name, customer_phone, service_notes, itinerary, invoice_paid, invoice_amount, pic_name, pic_email, internal_notes, pic_phone, customer_email, package_name, tour_date, customer_name, invoice_currency, status, partner_id, package_id, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('2026-07-20','','VBT-100001','Australia','2','Island Escape Travel','61412345678','Vegetarian lunch preferred','Tegenungan Waterfall
Tegallalang Rice Terrace
Monkey Forest
Coffee Plantation','true',850000,'Jennifer Lee','jennifer@islandescape.sg','VIP client — ensure premium vehicle','6598765432','john.anderson@email.com','Ubud Highlight Tour','2026-07-20','John Anderson','IDR','confirmed','6a52e8ce2a9dfa0db91ff02d','6a0949a0b4a68dcdea755532','6a52e8ce2a9dfa0db91ff03b','2026-07-12T01:07:26.055000','2026-07-12T01:11:33.703000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('2026-08-05','','VBT-100002','France','4','','33612345678','Interested in Kecak show','Uluwatu Temple
Melasti Beach
Kecak Show','false',750000,'','','Awaiting confirmation','','sophie.martin@email.com','Uluwatu Sunset Tour','2026-08-05','Sophie Martin','IDR','lead',NULL,'6a0949a0b4a68dcdea755533','6a52e8ce2a9dfa0db91ff03c','2026-07-12T01:07:26.055000','2026-07-12T01:12:16.881000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('2026-07-14','','VBT-100003','Singapore','3','Premier Bali Stays','65912345678','3-day custom itinerary','Day 1: Ubud
Day 2: Nusa Penida
Day 3: Uluwatu & Seminyak','true',3500000,'Rachel Morgan','','Multi-day booking','61412345678','weiming.tan@email.com','Bali Custom Private Tour','2026-07-12','Tan Wei Ming','IDR','ongoing','6a52e8ce2a9dfa0db91ff02f','6a0949a0b4a68dcdea755536','6a52e8ce2a9dfa0db91ff03d','2026-07-12T01:07:26.055000','2026-07-12T01:07:26.055000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('2026-08-15','','VBT-100004','United Kingdom','2','','447123456789','Snorkeling preferred','Broken Beach
Kelingking Beach
Peguyangan Waterfall','false',1450000,'','','DP 50% received','','olivia.brown@email.com','Nusa Penida Tour','2026-08-15','Olivia Brown','IDR','confirmed',NULL,'6a0949a0b4a68dcdea755534','6a52e8ce2a9dfa0db91ff03e','2026-07-12T01:07:26.055000','2026-07-12T01:07:26.055000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('2026-06-28','','VBT-100005','Japan','5','Bali Adventure Tours','819012345678','Family with elderly — easy walking','Mount Batur Viewpoint
Tirta Empul Temple
Coffee Plantation
Tegallalang Rice Terrace','true',950000,'Andi Pratama','','Left 5-star review','6281234567890','h.tanaka@email.com','Kintamani Volcano Tour','2026-06-28','Hiroshi Tanaka','IDR','completed','6a52e8ce2a9dfa0db91ff02c','6a52e8ce2a9dfa0db91ff04e','6a52e8ce2a9dfa0db91ff03f','2026-07-12T01:07:26.055000','2026-07-12T01:07:26.055000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('2026-06-11','','VBT-540411','Indonesia','1','Budi Dharma Trans','6289527643283','','Ubud
Kintamani
Monkey Forest
','false',NULL,'Ludhi','','','88987540974','daningprastiwi@gmail.com','Ubud Highlight Tour','2026-06-11','Daning','IDR','lead','6a1d413d79686ba103af4d5a','6a0949a0b4a68dcdea755532','6a21905cd1a898ffba287068','2026-06-04T14:49:00.157000','2026-06-06T13:18:20.640000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 13. INVOICES (from clean_Invoice_export.csv)
-- ============================================================================
INSERT INTO public.invoices (booking_id, amount, notes, tax_percentage, due_date, currency, label, line_items, invoice_number, payment_method, status, id, created_date, updated_date, created_by_id, created_by, is_sample)
VALUES
('6a52e8ce2a9dfa0db91ff03c',2188000,'','9.4',NULL,'IDR','Down Payment','[{"description":"Tour Package","amount":2000000}]','INV-VBT-100002-1285','bank_transfer','unpaid','6a52ea3b575b5215e5ecf81b','2026-07-12T01:13:31.850000','2026-07-12T01:13:31.850000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false'),
('6a21905cd1a898ffba287068',1110000,'','11','2026-07-10','IDR','Final Payment','[{"description":"Tour Package Ubud","amount":1000000}]','INV-VBT-540411-4373','bank_transfer','unpaid','6a4cadf4efb071444bb81dd6','2026-07-07T07:42:44.892000','2026-07-07T07:42:56.034000','6a0947b7b4a68dcdea755505','arrafahvega@gmail.com','false')
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 14. VERIFY RLS STILL ACTIVE
-- ============================================================================
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
    'users','destinations','faqs','fleet','gallery_images',
    'inquiries','partners','site_settings','team_members',
    'testimonials','tour_packages','bookings','invoices'
);

-- Expected: all 13 rows with rowsecurity = true