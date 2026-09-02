-- ============================================================================
-- Seed: Real bike models with current Bali market pricing (researched 2025/26)
-- ----------------------------------------------------------------------------
-- Models: Honda BeAT, Scoopy, Vario 125, Vario 160, PCX 160,
--         Yamaha NMAX 155, Honda CB150X
-- Prices reflect current Bali scooter-rental market rates (e.g. Scoopy
-- Rp100k/day, Vario Rp150k/day, NMAX Rp200k/day) with weekly & monthly rates.
-- Photos are from Wikimedia Commons (free license), matched to each model.
--
-- NOTE: re-running this script is SAFE — it removes existing rows for these
-- same 7 model names first (so no duplicates), and inserts fresh copies.
-- Admins can freely edit prices/photos afterwards via /admin/bikes.
-- ============================================================================

DELETE FROM public.bikes WHERE name IN (
  'Honda BeAT 110', 'Honda Scoopy 110', 'Honda Vario 125', 'Honda Vario 160',
  'Honda PCX 160', 'Yamaha NMAX 155', 'Honda CB150X'
);

INSERT INTO public.bikes (features, price, image_url, name, terms_id, includes_en, terms_en, includes_id, type, sort_order, capacity, price_weekly, price_monthly, price_note, id, created_date, updated_date, created_by_id, created_by, is_available)
VALUES
  -- Honda BeAT 110
  ('["Helmet Included","Fuel Efficient","Light & Agile","Easy Parking"]', 75000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2020%20Honda%20BeAT%20CBS%20110%20(20200622).jpg?width=800',
   'Honda BeAT 110',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["Helmet","Phone Holder"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["Helm","Tempat HP"]',
   'Automatic', 1, '110cc', 450000, 1200000,
   'Cheapest daily rate — best for short city rides', '6a6700000000000000000001',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Honda Scoopy 110
  ('["Helmet Included","Retro Style","Storage Box","Fuel Efficient"]', 100000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Honda%20Scoopy%20110.jpg?width=800',
   'Honda Scoopy 110',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["2 Helmets","Storage Box","Phone Holder"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["2 Helm","Bagasi","Tempat HP"]',
   'Automatic', 2, '110cc', 600000, 1500000,
   'Stylish retro scooter, great for Canggu & Ubud', '6a6700000000000000000002',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Honda Vario 125
  ('["Helmet Included","CBS Braking","Fuel Efficient","Comfortable Seat"]', 125000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Honda%20Vario%20125%20CBS-ISS%20(20221105).jpg?width=800',
   'Honda Vario 125',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["2 Helmets","Storage Box","Raincoat"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["2 Helm","Bagasi","Jas hujan"]',
   'Automatic', 3, '125cc', 700000, 1600000,
   'Best value all-round city scooter', '6a6700000000000000000003',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Honda Vario 160
  ('["Helmet Included","CBS Braking","Sporty Design","USB Charger"]', 150000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Honda%20Vario%20160%20ABS%20(20221105).jpg?width=800',
   'Honda Vario 160',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["2 Helmets","Storage Box","Phone Holder"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["2 Helm","Bagasi","Tempat HP"]',
   'Automatic', 4, '160cc', 800000, 1700000,
   'Sporty 160cc — most popular with long-stay travellers', '6a6700000000000000000004',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Honda PCX 160
  ('["Helmet Included","ABS Braking","Large Storage","Premium Comfort"]', 175000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Honda%20PCX%20160.jpg?width=800',
   'Honda PCX 160',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["2 Helmets","Large Storage","Phone Holder"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["2 Helm","Bagasi Besar","Tempat HP"]',
   'Automatic', 5, '160cc', 1000000, 2200000,
   'Premium maxi-scooter — most comfortable for 2 riders', '6a6700000000000000000005',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Yamaha NMAX 155
  ('["Helmet Included","ABS Braking","TFT Display","Keyless System"]', 200000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/Yamaha%20NMAX%20155.jpg?width=800',
   'Yamaha NMAX 155',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["2 Helmets","Storage Box","Phone Holder"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["2 Helm","Bagasi","Tempat HP"]',
   'Automatic', 6, '155cc', 1200000, 2500000,
   'Powerful 155cc with ABS — great for longer trips', '6a6700000000000000000006',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true),

  -- Honda CB150X
  ('["Helmet Included","Manual Transmission","Adventure Style","Long Distance"]', 250000,
   'https://commons.wikimedia.org/wiki/Special:FilePath/2021%20Honda%20CB150X%20(20211117).jpg?width=800',
   'Honda CB150X',
   '["Harian (24 jam)","Harga dapat berubah sewaktu-waktu","Bahan bakar tidak termasuk","Wajib menyetor SIM yang sesuai"]',
   '["Helmet","Basic Insurance"]',
   '["Daily (24 hr)","Pricing is subject to change","Fuel not included","Valid driving license required"]',
   '["Helm","Asuransi Dasar"]',
   'Manual', 7, '150cc', 1400000, 3000000,
   'Adventure-style manual bike for off-road & long tours', '6a6700000000000000000007',
   now(), now(), '6a0947b7b4a68dcdea755505', 'arrafahvega@gmail.com', true)
ON CONFLICT (id) DO NOTHING;

