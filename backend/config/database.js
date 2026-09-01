const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'kisan_procure.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('farmer', 'officer', 'admin')),
      centre_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS farmers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      farmer_id TEXT UNIQUE NOT NULL,
      aadhaar_masked TEXT NOT NULL,
      village TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      bank_account_masked TEXT NOT NULL,
      ifsc_code TEXT NOT NULL,
      land_acres REAL DEFAULT 0.0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS procurement_centres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      capacity_per_slot INTEGER DEFAULT 20,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      msp_per_quintal REAL NOT NULL,
      season TEXT
    );

    CREATE TABLE IF NOT EXISTS slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      centre_id INTEGER NOT NULL,
      slot_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      max_capacity INTEGER DEFAULT 20,
      booked_count INTEGER DEFAULT 0,
      UNIQUE(centre_id, slot_date, start_time),
      FOREIGN KEY (centre_id) REFERENCES procurement_centres(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_number TEXT UNIQUE NOT NULL,
      farmer_id INTEGER NOT NULL,
      centre_id INTEGER NOT NULL,
      slot_id INTEGER NOT NULL,
      crop_id INTEGER NOT NULL,
      expected_quantity REAL NOT NULL,
      token_number INTEGER NOT NULL,
      status TEXT DEFAULT 'booked' CHECK(status IN ('booked', 'arrived', 'in_progress', 'completed', 'cancelled', 'rejected')),
      booking_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (centre_id) REFERENCES procurement_centres(id),
      FOREIGN KEY (slot_id) REFERENCES slots(id),
      FOREIGN KEY (crop_id) REFERENCES crops(id)
    );

    CREATE TABLE IF NOT EXISTS queue_state (
      centre_id INTEGER PRIMARY KEY,
      current_token INTEGER DEFAULT 0,
      active_booking_id INTEGER,
      last_called_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (centre_id) REFERENCES procurement_centres(id) ON DELETE CASCADE,
      FOREIGN KEY (active_booking_id) REFERENCES bookings(id)
    );

    CREATE TABLE IF NOT EXISTS procurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER UNIQUE NOT NULL,
      officer_id INTEGER NOT NULL,
      actual_quantity REAL NOT NULL,
      quality_grade TEXT NOT NULL,
      moisture_percentage REAL,
      procurement_status TEXT DEFAULT 'accepted' CHECK(procurement_status IN ('accepted', 'rejected')),
      rejection_reason TEXT,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (officer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      procurement_id INTEGER UNIQUE NOT NULL,
      farmer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      msp_rate REAL NOT NULL,
      transaction_id TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'processing' CHECK(status IN ('initiated', 'processing', 'paid', 'failed')),
      disbursed_at DATETIME,
      FOREIGN KEY (procurement_id) REFERENCES procurements(id) ON DELETE CASCADE,
      FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ SQLite Database tables initialized successfully.');
}

module.exports = {
  db,
  initializeDatabase
};
