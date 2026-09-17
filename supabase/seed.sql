-- =========================================================
-- KISANPROCURE SEED SCRIPT (supabase/seed.sql)
-- Exact 9-Table Mock Dataset (SIH PS 26032)
-- =========================================================

-- 1. SEED PROFILES
INSERT INTO profiles (id, full_name, phone, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Ramesh Kumar', '9876543210', 'farmer'),
('22222222-2222-2222-2222-222222222222', 'Suresh Singh', '9876543211', 'farmer'),
('33333333-3333-3333-3333-333333333333', 'Manoj Paswan', '9876543216', 'farmer'),
('88888888-8888-8888-8888-888888888888', 'Rajesh Sharma', '9876543200', 'officer'),
('99999999-9999-9999-9999-999999999999', 'Dr. Sanjay Meena', '9876543201', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- 2. SEED FARMERS
INSERT INTO farmers (id, farmer_code, profile_id, address, village, district, state, bank_account_masked) VALUES
('f1111111-1111-1111-1111-111111111111', 'FARM1001', '11111111-1111-1111-1111-111111111111', 'House 42, Ward 3', 'Minapur', 'Muzaffarpur', 'Bihar', 'SBI-XXXX-4589'),
('f2222222-2222-2222-2222-222222222222', 'FARM1002', '22222222-2222-2222-2222-222222222222', 'Main Road', 'Minapur', 'Muzaffarpur', 'Bihar', 'PNB-XXXX-1120'),
('f3333333-3333-3333-3333-333333333333', 'FARM1007', '33333333-3333-3333-3333-333333333333', 'Kisan Tola', 'Minapur', 'Muzaffarpur', 'Bihar', 'SBI-XXXX-9901')
ON CONFLICT (farmer_code) DO NOTHING;

-- 3. SEED MANDIS
INSERT INTO mandis (id, name, address, district, state) VALUES
(1, 'Muzaffarpur Central Mandi', 'NH-28 Bypass Road, Near KVK, Muzaffarpur', 'Muzaffarpur', 'Bihar'),
(2, 'Kanti Regional APMC Yard', 'Station Road, Kanti Block, Muzaffarpur', 'Muzaffarpur', 'Bihar'),
(3, 'Bochahan Kisan Mandi', 'State Highway 52, Bochahan, Muzaffarpur', 'Muzaffarpur', 'Bihar'),
(4, 'Patna Grain Terminal', 'Fatuha Industrial Mandi Area, Patna', 'Patna', 'Bihar')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED CROPS
INSERT INTO crops (id, crop_name, msp_per_quintal, season) VALUES
(1, 'Wheat (PBW-343)', 2425.00, 'Rabi'),
(2, 'Paddy (Grade A)', 2320.00, 'Kharif'),
(3, 'Mustard / Rapeseed', 5650.00, 'Rabi'),
(4, 'Gram (Chana)', 5440.00, 'Rabi'),
(5, 'Maize', 2090.00, 'Kharif')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SLOTS
INSERT INTO slots (id, mandi_id, slot_date, start_time, end_time, max_capacity, available_capacity) VALUES
(1, 1, CURRENT_DATE, '09:00:00', '10:00:00', 20, 3),
(2, 1, CURRENT_DATE, '10:00:00', '11:00:00', 20, 6),
(3, 1, CURRENT_DATE, '11:00:00', '12:00:00', 20, 14),
(4, 1, CURRENT_DATE, '12:00:00', '13:00:00', 20, 11),
(5, 1, CURRENT_DATE, '14:00:00', '15:00:00', 20, 18)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED BOOKINGS
INSERT INTO bookings (id, farmer_id, slot_id, crop_id, declared_quantity, token_number, status) VALUES
('b1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 2, 1, 45.0, 18, 'in_progress'),
('b2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 2, 1, 32.0, 19, 'booked'),
('b3333333-3333-3333-3333-333333333333', 'f1111111-1111-1111-1111-111111111111', 2, 1, 40.0, 23, 'booked')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED QUEUE
INSERT INTO queue (id, booking_id, token_number, status, called_at) VALUES
('q1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 18, 'serving', NOW()),
('q2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 19, 'calling', NULL),
('q3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 23, 'waiting', NULL)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED PROCUREMENTS
INSERT INTO procurements (id, booking_id, actual_quantity, quality_grade, moisture_percentage, msp_rate, total_amount, status) VALUES
('p1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 44.5, 'Grade A', 11.6, 2425.00, 107912.50, 'approved')
ON CONFLICT (id) DO NOTHING;

-- 9. SEED PAYMENTS
INSERT INTO payments (id, procurement_id, farmer_id, transaction_id, amount, payment_status, paid_at) VALUES
('y1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 'TXN-2026-MUZ-8018', 107912.50, 'paid', NOW())
ON CONFLICT (id) DO NOTHING;
