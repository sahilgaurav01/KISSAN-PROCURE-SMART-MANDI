-- =========================================================
-- KISANPROCURE: POSTGRESQL SCHEMA (SIH PROBLEM STATEMENT 26032)
-- =========================================================

-- 1. Users Table (Role-based auth: farmer, officer, admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(120),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'officer', 'admin')),
    centre_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Procurement Centres Table
CREATE TABLE IF NOT EXISTS procurement_centres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    capacity_per_slot INTEGER DEFAULT 20,
    status VARCHAR(20) DEFAULT 'active'
);

-- Add foreign key constraint to users for centre_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_centre') THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_centre FOREIGN KEY (centre_id) REFERENCES procurement_centres(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Farmer Profiles
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id VARCHAR(30) UNIQUE NOT NULL,
    aadhaar_masked VARCHAR(20) NOT NULL,
    village VARCHAR(120) NOT NULL,
    district VARCHAR(120) NOT NULL,
    state VARCHAR(120) NOT NULL,
    bank_account_masked VARCHAR(30) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    land_acres NUMERIC(6,2) DEFAULT 0.0
);

-- 4. Crops & Minimum Support Price (MSP) Rates
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    msp_per_quintal NUMERIC(10,2) NOT NULL,
    season VARCHAR(40)
);

-- 5. Mandi Slots
CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    centre_id INTEGER NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    booked_count INTEGER DEFAULT 0,
    UNIQUE(centre_id, slot_date, start_time)
);

-- 6. Bookings & Token Allocation
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    centre_id INTEGER NOT NULL REFERENCES procurement_centres(id),
    slot_id INTEGER NOT NULL REFERENCES slots(id),
    crop_id INTEGER NOT NULL REFERENCES crops(id),
    expected_quantity NUMERIC(8,2) NOT NULL,
    token_number INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'booked' CHECK (status IN ('booked', 'arrived', 'in_progress', 'completed', 'cancelled', 'rejected')),
    booking_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Live Queue State
CREATE TABLE IF NOT EXISTS queue_state (
    centre_id INTEGER PRIMARY KEY REFERENCES procurement_centres(id) ON DELETE CASCADE,
    current_token INTEGER DEFAULT 0,
    active_booking_id INTEGER REFERENCES bookings(id),
    last_called_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Physical Procurement & Quality Assessment
CREATE TABLE IF NOT EXISTS procurements (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    officer_id INTEGER NOT NULL REFERENCES users(id),
    actual_quantity NUMERIC(8,2) NOT NULL,
    quality_grade VARCHAR(30) NOT NULL,
    moisture_percentage NUMERIC(4,1),
    procurement_status VARCHAR(20) DEFAULT 'accepted' CHECK (procurement_status IN ('accepted', 'rejected')),
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Direct Benefit Transfer (DBT) Payments
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    procurement_id INTEGER UNIQUE NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    amount NUMERIC(12,2) NOT NULL,
    msp_rate NUMERIC(10,2) NOT NULL,
    transaction_id VARCHAR(60) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('initiated', 'processing', 'paid', 'failed')),
    disbursed_at TIMESTAMP WITH TIME ZONE
);

-- 10. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index optimizations for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_bookings_centre_date ON bookings(centre_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_slots_centre_date ON slots(centre_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
