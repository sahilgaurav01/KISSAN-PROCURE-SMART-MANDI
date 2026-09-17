-- =========================================================
-- KISANPROCURE DATABASE SCHEMA (supabase/schema.sql)
-- PostgreSQL / Supabase Relational DDL (SIH PS 26032)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Farmers, Officers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    farmer_code VARCHAR(20) UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    aadhaar_masked VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'officer', 'admin')),
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(50) DEFAULT 'Bihar',
    bank_account_mask VARCHAR(30),
    ifsc_code VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROCUREMENT CENTRES (Mandis)
CREATE TABLE IF NOT EXISTS procurement_centres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    centre_code VARCHAR(20) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    daily_capacity INT DEFAULT 100,
    active_tokens INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

-- 3. CROPS & MSP MASTER
CREATE TABLE IF NOT EXISTS crops_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    msp_per_quintal NUMERIC(10, 2) NOT NULL,
    season VARCHAR(20) NOT NULL,
    max_moisture_percentage NUMERIC(4, 2) DEFAULT 12.0
);

-- 4. BOOKING SLOTS
CREATE TABLE IF NOT EXISTS booking_slots (
    id SERIAL PRIMARY KEY,
    centre_id INT REFERENCES procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time VARCHAR(30) NOT NULL,
    total_capacity INT DEFAULT 20,
    booked_count INT DEFAULT 0,
    is_recommended BOOLEAN DEFAULT FALSE,
    UNIQUE(centre_id, slot_date, slot_time)
);

-- 5. FARMER BOOKINGS & DIGITAL TOKENS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(30) UNIQUE NOT NULL,
    token_number INT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    centre_id INT REFERENCES procurement_centres(id),
    crop_id INT REFERENCES crops_master(id),
    slot_id INT REFERENCES booking_slots(id),
    expected_quantity_quintals NUMERIC(8, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'booked' CHECK (status IN ('booked', 'in_progress', 'weighed', 'completed', 'cancelled')),
    booking_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. WEIGHMENT & QUALITY INSPECTIONS
CREATE TABLE IF NOT EXISTS weighments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES users(id),
    actual_quantity_quintals NUMERIC(8, 2) NOT NULL,
    quality_grade VARCHAR(20) DEFAULT 'Grade A',
    moisture_percentage NUMERIC(4, 2) NOT NULL,
    msp_applied NUMERIC(10, 2) NOT NULL,
    total_payout_amount NUMERIC(12, 2) NOT NULL,
    weighment_slip_number VARCHAR(40) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DIRECT BENEFIT TRANSFER (DBT) PAYMENTS
CREATE TABLE IF NOT EXISTS payments_dbt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weighment_id UUID REFERENCES weighments(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    transaction_reference VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    bank_account_mask VARCHAR(30),
    ifsc_code VARCHAR(15),
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'paid', 'failed')),
    disbursed_at TIMESTAMP WITH TIME ZONE
);

-- 8. REAL-TIME NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast live queue queries
CREATE INDEX IF NOT EXISTS idx_bookings_centre_status ON bookings(centre_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(token_number);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments_dbt(user_id);
