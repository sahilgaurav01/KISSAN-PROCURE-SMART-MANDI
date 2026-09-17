-- =========================================================
-- KISANPROCURE ROW LEVEL SECURITY (RLS) (supabase/policies.sql)
-- Fine-grained authorization rules for Farmers, Officers & Admins
-- =========================================================

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weighments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments_dbt ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ ON MANDIS & CROPS
CREATE POLICY "Public centres read" ON procurement_centres FOR SELECT USING (true);
CREATE POLICY "Public crops read" ON crops_master FOR SELECT USING (true);
CREATE POLICY "Public slots read" ON booking_slots FOR SELECT USING (true);

-- 2. FARMER POLICIES
CREATE POLICY "Farmers read own profile" ON users FOR SELECT 
    USING (auth.uid() = id OR role = 'admin' OR role = 'officer');

CREATE POLICY "Farmers read own bookings" ON bookings FOR SELECT 
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('officer', 'admin')));

CREATE POLICY "Farmers create bookings" ON bookings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers read own payments" ON payments_dbt FOR SELECT 
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('officer', 'admin')));

-- 3. OFFICER POLICIES
CREATE POLICY "Officers create weighments" ON weighments FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'officer'));

CREATE POLICY "Officers update bookings status" ON bookings FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('officer', 'admin')));

-- 4. ADMIN POLICIES (Full Clearance & DBT Disbursement)
CREATE POLICY "Admins update DBT payments" ON payments_dbt FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
