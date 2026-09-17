-- =========================================================
-- KISANPROCURE ROW LEVEL SECURITY POLICIES (supabase/policies.sql)
-- Fine-grained RLS Rules for the 9 Tables (SIH PS 26032)
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (Master Lookups)
CREATE POLICY "Public mandis read" ON mandis FOR SELECT USING (true);
CREATE POLICY "Public crops read" ON crops FOR SELECT USING (true);
CREATE POLICY "Public slots read" ON slots FOR SELECT USING (true);
CREATE POLICY "Public queue view" ON queue FOR SELECT USING (true);

-- 2. PROFILES & FARMERS POLICIES
CREATE POLICY "Users read own profile" ON profiles FOR SELECT 
    USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'admin')));

CREATE POLICY "Users read own farmer profile" ON farmers FOR SELECT 
    USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'admin')));

-- 3. BOOKINGS POLICIES
CREATE POLICY "Farmers create bookings" ON bookings FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM farmers WHERE id = farmer_id AND profile_id = auth.uid()));

CREATE POLICY "Farmers read own bookings" ON bookings FOR SELECT 
    USING (EXISTS (SELECT 1 FROM farmers WHERE id = farmer_id AND profile_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'admin')));

-- 4. OFFICER & PROCUREMENTS POLICIES
CREATE POLICY "Officers insert procurements" ON procurements FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'officer'));

CREATE POLICY "Officers update queue" ON queue FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'admin')));

-- 5. ADMIN / TREASURY PAYMENTS POLICIES
CREATE POLICY "Admins update payments" ON payments FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Farmers read own payments" ON payments FOR SELECT 
    USING (EXISTS (SELECT 1 FROM farmers WHERE id = farmer_id AND profile_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'admin')));
