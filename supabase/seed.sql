-- =========================================================
-- KISANPROCURE SEED DATA (supabase/seed.sql)
-- Pre-seeds Mandis, MSPs, Ramesh Kumar (#23), and active queue
-- =========================================================

-- 1. SEED PROCUREMENT CENTRES
INSERT INTO procurement_centres (id, name, centre_code, district, address, daily_capacity) VALUES
(1, 'Muzaffarpur Central Mandi', 'PC-MUZ-01', 'Muzaffarpur', 'NH-28 Bypass Road, Near KVK, Muzaffarpur, Bihar', 100),
(2, 'Kanti Regional APMC Yard', 'PC-MUZ-02', 'Muzaffarpur', 'Station Road, Kanti Block, Muzaffarpur, Bihar', 80),
(3, 'Bochahan Kisan Mandi', 'PC-MUZ-03', 'Muzaffarpur', 'State Highway 52, Bochahan, Muzaffarpur, Bihar', 60),
(4, 'Patna Grain Terminal', 'PC-PAT-01', 'Patna', 'Fatuha Industrial Mandi Area, Patna, Bihar', 150)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED CROPS MASTER (MSP 2026 Rates)
INSERT INTO crops_master (id, name, code, msp_per_quintal, season, max_moisture_percentage) VALUES
(1, 'Wheat (PBW-343)', 'WHEAT', 2425.00, 'Rabi', 12.0),
(2, 'Paddy (Grade A)', 'PADDY_GRA', 2320.00, 'Kharif', 14.0),
(3, 'Mustard / Rapeseed', 'MUSTARD', 5650.00, 'Rabi', 8.0),
(4, 'Gram (Chana)', 'GRAM', 5440.00, 'Rabi', 10.0),
(5, 'Maize', 'MAIZE', 2090.00, 'Kharif', 12.0)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED USERS
INSERT INTO users (id, full_name, farmer_code, phone, aadhaar_masked, role, village, district, bank_account_mask, ifsc_code) VALUES
('a0000000-0000-0000-0000-000000000001', 'Ramesh Kumar', 'FARM1001', '9876543210', 'XXXX-XXXX-8921', 'farmer', 'Minapur', 'Muzaffarpur', 'SBI-XXXX-4589', 'SBIN0001234'),
('a0000000-0000-0000-0000-000000000002', 'Rajesh Sharma', 'OFF1001', '9876543200', 'XXXX-XXXX-1100', 'officer', 'Muzaffarpur', 'Muzaffarpur', NULL, NULL),
('a0000000-0000-0000-0000-000000000003', 'Dr. Sanjay Meena', 'ADM1001', '9876543201', 'XXXX-XXXX-9999', 'admin', 'Patna', 'Patna', NULL, NULL)
ON CONFLICT (phone) DO NOTHING;

-- 4. SEED SLOTS
INSERT INTO booking_slots (centre_id, slot_date, slot_time, total_capacity, booked_count, is_recommended) VALUES
(1, CURRENT_DATE, '09:00 - 10:00 AM', 20, 17, FALSE),
(1, CURRENT_DATE, '10:00 - 11:00 AM', 20, 14, FALSE),
(1, CURRENT_DATE, '11:00 - 12:00 PM', 20, 6, TRUE),
(1, CURRENT_DATE, '12:00 - 01:00 PM', 20, 9, FALSE),
(1, CURRENT_DATE, '02:00 - 03:00 PM', 20, 2, FALSE)
ON CONFLICT DO NOTHING;
