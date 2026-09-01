const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Potential common passwords to try if not explicitly set
const candidatePasswords = [
  process.env.PG_PASSWORD,
  process.env.POSTGRES_PASSWORD,
  'postgres',
  'admin',
  'root',
  '1234',
  '123456',
  'password',
  ''
].filter((p, i, arr) => p !== undefined && arr.indexOf(p) === i);

async function findWorkingPostgresClient() {
  const host = process.env.PG_HOST || 'localhost';
  const port = parseInt(process.env.PG_PORT || '5432');
  const user = process.env.PG_USER || 'postgres';

  for (const password of candidatePasswords) {
    try {
      const client = new Client({
        host,
        port,
        user,
        password,
        database: 'postgres',
        connectionTimeoutMillis: 2000
      });
      await client.connect();
      console.log(`✅ Connected to PostgreSQL as '${user}' with password: '${password ? '******' : '(none)'}'`);
      return { client, config: { host, port, user, password } };
    } catch (err) {
      // Continue trying next candidate
    }
  }

  throw new Error('Could not connect to PostgreSQL with default passwords. Please specify PG_PASSWORD in backend/.env');
}

async function setupPostgresDatabase() {
  console.log('🐘 Initializing PostgreSQL setup for KisanProcure...');

  let client, config;
  try {
    const result = await findWorkingPostgresClient();
    client = result.client;
    config = result.config;
  } catch (err) {
    console.error('❌ PostgreSQL Connection Failed:', err.message);
    console.log('\n💡 Tip: You can set your PostgreSQL credentials in backend/.env:');
    console.log('PG_USER=postgres\nPG_PASSWORD=your_actual_password\nPG_HOST=localhost\nPG_PORT=5432\nPG_DATABASE=kisan_procure\n');
    return;
  }

  // 1. Create Database if not exists
  const dbName = process.env.PG_DATABASE || 'kisan_procure';
  try {
    const checkDb = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (checkDb.rows.length === 0) {
      console.log(`📦 Creating database '${dbName}'...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully.`);
    } else {
      console.log(`📦 Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error('Database creation check error:', err.message);
  } finally {
    await client.end();
  }

  // 2. Connect to the target 'kisan_procure' database
  const targetPool = new Pool({
    ...config,
    database: dbName
  });

  try {
    // 3. Execute Schema DDL
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema_postgres.sql'), 'utf-8');
    console.log('⚙️ Executing PostgreSQL schema DDL...');
    await targetPool.query(schemaSql);
    console.log('✅ PostgreSQL tables & indexes created successfully.');

    // 4. Seed Data if empty
    const countRes = await targetPool.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(countRes.rows[0].count) > 0) {
      console.log('🌱 PostgreSQL database already contains data. Skipping seed.');
    } else {
      console.log('🌱 Seeding PostgreSQL database with realistic demonstration dataset...');

      const passwordHashFarmer = bcrypt.hashSync('farmer123', 10);
      const passwordHashOfficer = bcrypt.hashSync('officer123', 10);
      const passwordHashAdmin = bcrypt.hashSync('admin123', 10);

      // Centres
      const c1Res = await targetPool.query(`
        INSERT INTO procurement_centres (name, code, district, state, address, latitude, longitude, capacity_per_slot, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
      `, ['Muzaffarpur Central Mandi', 'PC-MUZ-01', 'Muzaffarpur', 'Bihar', 'NH-28 Bypass Road, Near KVK, Muzaffarpur', 26.1209, 85.3647, 20, 'active']);
      const c1 = c1Res.rows[0].id;

      await targetPool.query(`
        INSERT INTO procurement_centres (name, code, district, state, address, latitude, longitude, capacity_per_slot, status)
        VALUES 
          ('Kanti Regional APMC Yard', 'PC-MUZ-02', 'Muzaffarpur', 'Bihar', 'Station Road, Kanti Block, Muzaffarpur', 26.1982, 85.3014, 15, 'active'),
          ('Bochahan Kisan Mandi', 'PC-MUZ-03', 'Muzaffarpur', 'Bihar', 'State Highway 52, Bochahan, Muzaffarpur', 26.1550, 85.4890, 15, 'active'),
          ('Patna Grain Terminal', 'PC-PAT-01', 'Patna', 'Bihar', 'Fatuha Industrial Area, Patna', 25.5034, 85.3092, 30, 'active')
      `);

      // Crops
      const wheatRes = await targetPool.query(`
        INSERT INTO crops (name, code, msp_per_quintal, season)
        VALUES ('Wheat (Kalyan Sona / PBW-343)', 'WHEAT', 2425.00, 'Rabi') RETURNING id
      `);
      const wheatId = wheatRes.rows[0].id;

      await targetPool.query(`
        INSERT INTO crops (name, code, msp_per_quintal, season)
        VALUES 
          ('Paddy (Common)', 'PADDY_COM', 2300.00, 'Kharif'),
          ('Paddy (Grade A)', 'PADDY_GRA', 2320.00, 'Kharif'),
          ('Mustard / Rapeseed', 'MUSTARD', 5650.00, 'Rabi'),
          ('Gram (Chana)', 'GRAM', 5440.00, 'Rabi'),
          ('Maize', 'MAIZE', 2090.00, 'Kharif')
      `);

      // Users: Admin & Officer
      await targetPool.query(`
        INSERT INTO users (name, phone, email, password_hash, role, centre_id)
        VALUES ('Dr. Sanjay Meena (Director)', '9999999999', 'admin@kisanprocure.gov.in', $1, 'admin', NULL)
      `, [passwordHashAdmin]);

      const officerRes = await targetPool.query(`
        INSERT INTO users (name, phone, email, password_hash, role, centre_id)
        VALUES ('Rajesh Sharma (Inspector)', '9876543220', 'officer.muz@kisanprocure.gov.in', $1, 'officer', $2) RETURNING id
      `, [passwordHashOfficer, c1]);
      const officerId = officerRes.rows[0].id;

      // Farmers
      const farmersList = [
        { name: 'Ramesh Kumar', phone: '9876543210', fid: 'FARM1001', aadh: 'XXXX-XXXX-4123', village: 'Minapur', dist: 'Muzaffarpur', bank: 'SBI-XXXX-4589', ifsc: 'SBIN0001234', acres: 12.5 },
        { name: 'Suresh Singh', phone: '9876543211', fid: 'FARM1002', aadh: 'XXXX-XXXX-8921', village: 'Minapur', dist: 'Muzaffarpur', bank: 'PNB-XXXX-7721', ifsc: 'PUNB0123400', acres: 8.0 },
        { name: 'Amit Patel', phone: '9876543212', fid: 'FARM1003', aadh: 'XXXX-XXXX-3341', village: 'Kanti', dist: 'Muzaffarpur', bank: 'BOB-XXXX-1934', ifsc: 'BARB0MUZAFF', acres: 15.0 },
        { name: 'Rajendra Yadav', phone: '9876543213', fid: 'FARM1004', aadh: 'XXXX-XXXX-5582', village: 'Bochahan', dist: 'Muzaffarpur', bank: 'UBI-XXXX-9901', ifsc: 'UBIN0532109', acres: 6.5 },
        { name: 'Vikas Sharma', phone: '9876543214', fid: 'FARM1005', aadh: 'XXXX-XXXX-7712', village: 'Motipur', dist: 'Muzaffarpur', bank: 'HDFC-XXXX-6612', ifsc: 'HDFC0004921', acres: 10.0 },
        { name: 'Manoj Paswan', phone: '9876543216', fid: 'FARM1007', aadh: 'XXXX-XXXX-8822', village: 'Minapur', dist: 'Muzaffarpur', bank: 'CBI-XXXX-4421', ifsc: 'CBIN0281234', acres: 14.0 }
      ];

      const createdFarmers = [];
      for (const f of farmersList) {
        const uRes = await targetPool.query(`
          INSERT INTO users (name, phone, email, password_hash, role)
          VALUES ($1, $2, $3, $4, 'farmer') RETURNING id
        `, [f.name, f.phone, `${f.fid.toLowerCase()}@kisan.in`, passwordHashFarmer]);
        const uId = uRes.rows[0].id;

        const fRes = await targetPool.query(`
          INSERT INTO farmers (user_id, farmer_id, aadhaar_masked, village, district, state, bank_account_masked, ifsc_code, land_acres)
          VALUES ($1, $2, $3, $4, $5, 'Bihar', $6, $7, $8) RETURNING id
        `, [uId, f.fid, f.aadh, f.village, f.dist, f.bank, f.ifsc, f.acres]);

        createdFarmers.push({ userId: uId, farmerDbId: fRes.rows[0].id, ...f });
      }

      // Create Today's Slots
      const today = new Date().toISOString().split('T')[0];
      const slot1Res = await targetPool.query(`
        INSERT INTO slots (centre_id, slot_date, start_time, end_time, max_capacity, booked_count)
        VALUES ($1, $2, '09:00:00', '10:00:00', 20, 17) RETURNING id
      `, [c1, today]);
      const slot1Id = slot1Res.rows[0].id;

      const slot2Res = await targetPool.query(`
        INSERT INTO slots (centre_id, slot_date, start_time, end_time, max_capacity, booked_count)
        VALUES ($1, $2, '10:00:00', '11:00:00', 20, 7) RETURNING id
      `, [c1, today]);
      const slot2Id = slot2Res.rows[0].id;

      // Insert Historical Completed Bookings (Tokens 1 to 17)
      for (let t = 1; t <= 17; t++) {
        const bRes = await targetPool.query(`
          INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', $8) RETURNING id
        `, [`BK-2026-${1000 + t}`, createdFarmers[t % createdFarmers.length].farmerDbId, c1, slot1Id, wheatId, 35 + (t % 10), t, today]);
        const bId = bRes.rows[0].id;

        const pRes = await targetPool.query(`
          INSERT INTO procurements (booking_id, officer_id, actual_quantity, quality_grade, moisture_percentage, procurement_status)
          VALUES ($1, $2, $3, 'Grade A', 11.8, 'accepted') RETURNING id
        `, [bId, officerId, 35 + (t % 10) - 0.5]);

        await targetPool.query(`
          INSERT INTO payments (procurement_id, farmer_id, amount, msp_rate, transaction_id, status, disbursed_at)
          VALUES ($1, $2, $3, 2425.00, $4, 'paid', NOW())
        `, [pRes.rows[0].id, createdFarmers[t % createdFarmers.length].farmerDbId, (35 + (t % 10) - 0.5) * 2425.00, `TXN-2026-MUZ-${8000 + t}`]);
      }

      // Live Queue Bookings: Token 18 (Serving)
      const b18Res = await targetPool.query(`
        INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
        VALUES ('BK-2026-1018', $1, $2, $3, $4, 45.0, 18, 'in_progress', $5) RETURNING id
      `, [createdFarmers[5].farmerDbId, c1, slot2Id, wheatId, today]);
      const b18Id = b18Res.rows[0].id;

      // Waiting: 19, 20, 21, 22
      await targetPool.query(`
        INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
        VALUES 
          ('BK-2026-1019', $1, $2, $3, $4, 32.0, 19, 'booked', $5),
          ('BK-2026-1020', $6, $2, $3, $4, 50.0, 20, 'booked', $5),
          ('BK-2026-1021', $7, $2, $3, $4, 25.0, 21, 'booked', $5),
          ('BK-2026-1022', $8, $2, $3, $4, 40.0, 22, 'booked', $5)
      `, [
        createdFarmers[1].farmerDbId, c1, slot2Id, wheatId, today,
        createdFarmers[2].farmerDbId,
        createdFarmers[3].farmerDbId,
        createdFarmers[4].farmerDbId
      ]);

      // Token 23: Ramesh Kumar (Protagonist)
      await targetPool.query(`
        INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
        VALUES ('BK-2026-1023', $1, $2, $3, $4, 40.0, 23, 'booked', $5)
      `, [createdFarmers[0].farmerDbId, c1, slot2Id, wheatId, today]);

      // Queue state
      await targetPool.query(`
        INSERT INTO queue_state (centre_id, current_token, active_booking_id, last_called_at)
        VALUES ($1, 18, $2, NOW())
        ON CONFLICT (centre_id) DO UPDATE SET current_token = 18, active_booking_id = $2
      `, [c1, b18Id]);

      // Notification
      await targetPool.query(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES 
          ($1, 'Slot Booking Confirmed', 'Your slot for 40.0 Quintals of Wheat at Muzaffarpur Central Mandi is confirmed. Token Number: 23.', 'success'),
          ($1, 'Live Queue Active', 'Current serving token at Muzaffarpur Central Mandi is Token 18. 5 farmers are ahead of you.', 'info')
      `, [createdFarmers[0].userId]);

      console.log('✅ PostgreSQL successfully seeded with complete KisanProcure demo data!');
    }

    // Write a .env file with the working config
    const envContent = `
# KisanProcure Environment Configuration
PORT=5000
JWT_SECRET=kisan_procure_super_secret_jwt_key_2026

# PostgreSQL Configuration
USE_POSTGRES=true
PG_HOST=${config.host}
PG_PORT=${config.port}
PG_USER=${config.user}
PG_PASSWORD=${config.password}
PG_DATABASE=${dbName}
DATABASE_URL=postgresql://${config.user}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${dbName}
`.trim();

    fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
    console.log('📝 Updated backend/.env with PostgreSQL configuration.');

  } catch (err) {
    console.error('PostgreSQL execution error:', err);
  } finally {
    await targetPool.end();
  }
}

if (require.main === module) {
  setupPostgresDatabase();
}

module.exports = { setupPostgresDatabase };
