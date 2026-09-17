-- =========================================================
-- KISANPROCURE: SUPABASE / POSTGRESQL RELATIONAL SCHEMA
-- Exact 9-Table Schema Definition (SIH Problem Statement 26032)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('farmer', 'officer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FARMERS
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_code VARCHAR(30) UNIQUE NOT NULL,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    address TEXT,
    village VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Bihar',
    bank_account_masked VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MANDIS (Procurement Centres)
CREATE TABLE IF NOT EXISTS mandis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Bihar'
);

-- 4. CROPS (MSP Master)
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    msp_per_quintal NUMERIC(10, 2) NOT NULL,
    season VARCHAR(30) NOT NULL
);

-- 5. SLOTS
CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    mandi_id INT NOT NULL REFERENCES mandis(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT DEFAULT 20,
    available_capacity INT DEFAULT 20,
    UNIQUE(mandi_id, slot_date, start_time, end_time)
);

-- 6. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    slot_id INT NOT NULL REFERENCES slots(id),
    crop_id INT NOT NULL REFERENCES crops(id),
    declared_quantity NUMERIC(8, 2) NOT NULL,
    token_number INT NOT NULL,
    status VARCHAR(30) DEFAULT 'booked' CHECK (status IN ('booked', 'in_progress', 'weighed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. QUEUE
CREATE TABLE IF NOT EXISTS queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    token_number INT NOT NULL,
    status VARCHAR(30) DEFAULT 'waiting' CHECK (status IN ('waiting', 'calling', 'serving', 'completed', 'skipped')),
    called_at TIMESTAMP WITH TIME ZONE,
    served_at TIMESTAMP WITH TIME ZONE
);

-- 8. PROCUREMENTS
CREATE TABLE IF NOT EXISTS procurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    actual_quantity NUMERIC(8, 2) NOT NULL,
    quality_grade VARCHAR(30) DEFAULT 'Grade A',
    moisture_percentage NUMERIC(4, 2) NOT NULL,
    msp_rate NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'verified' CHECK (status IN ('verified', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procurement_id UUID NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES farmers(id),
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'processing' CHECK (payment_status IN ('processing', 'paid', 'failed')),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farmers_profile ON farmers(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_queue_booking ON queue(booking_id);
CREATE INDEX IF NOT EXISTS idx_queue_token ON queue(token_number);
CREATE INDEX IF NOT EXISTS idx_procurements_booking ON procurements(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_farmer ON payments(farmer_id);
