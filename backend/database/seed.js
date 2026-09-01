const bcrypt = require('bcryptjs');
const { db, initializeDatabase } = require('../config/database');

async function seedDatabase() {
  initializeDatabase();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('🌱 Database already contains data. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding KisanProcure Database with realistic demo data...');

  const passwordHashFarmer = bcrypt.hashSync('farmer123', 10);
  const passwordHashOfficer = bcrypt.hashSync('officer123', 10);
  const passwordHashAdmin = bcrypt.hashSync('admin123', 10);

  // 1. Insert Procurement Centres
  const insertCentre = db.prepare(`
    INSERT INTO procurement_centres (name, code, district, state, address, latitude, longitude, capacity_per_slot, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const c1 = insertCentre.run(
    'Muzaffarpur Central Mandi',
    'PC-MUZ-01',
    'Muzaffarpur',
    'Bihar',
    'NH-28 Bypass Road, Near Krishi Vigyan Kendra, Muzaffarpur, Bihar 842001',
    26.1209,
    85.3647,
    20,
    'active'
  ).lastInsertRowid;

  const c2 = insertCentre.run(
    'Kanti Regional APMC Yard',
    'PC-MUZ-02',
    'Muzaffarpur',
    'Bihar',
    'Station Road, Kanti Block, Muzaffarpur, Bihar 843109',
    26.1982,
    85.3014,
    15,
    'active'
  ).lastInsertRowid;

  const c3 = insertCentre.run(
    'Bochahan Kisan Mandi',
    'PC-MUZ-03',
    'Muzaffarpur',
    'Bihar',
    'State Highway 52, Bochahan, Muzaffarpur, Bihar 843103',
    26.1550,
    85.4890,
    15,
    'active'
  ).lastInsertRowid;

  const c4 = insertCentre.run(
    'Patna Grain Terminal',
    'PC-PAT-01',
    'Patna',
    'Bihar',
    'Fatuha Industrial Area, Patna, Bihar 803201',
    25.5034,
    85.3092,
    30,
    'active'
  ).lastInsertRowid;

  // 2. Insert Crops & MSP
  const insertCrop = db.prepare(`
    INSERT INTO crops (name, code, msp_per_quintal, season)
    VALUES (?, ?, ?, ?)
  `);

  const wheatId = insertCrop.run('Wheat (Kalyan Sona / PBW-343)', 'WHEAT', 2425.00, 'Rabi').lastInsertRowid;
  const paddyCommonId = insertCrop.run('Paddy (Common)', 'PADDY_COM', 2300.00, 'Kharif').lastInsertRowid;
  const paddyGradeAId = insertCrop.run('Paddy (Grade A)', 'PADDY_GRA', 2320.00, 'Kharif').lastInsertRowid;
  const mustardId = insertCrop.run('Mustard / Rapeseed', 'MUSTARD', 5650.00, 'Rabi').lastInsertRowid;
  const gramId = insertCrop.run('Gram (Chana)', 'GRAM', 5440.00, 'Rabi').lastInsertRowid;
  const maizeId = insertCrop.run('Maize', 'MAIZE', 2090.00, 'Kharif').lastInsertRowid;

  // 3. Insert Users & Profiles
  const insertUser = db.prepare(`
    INSERT INTO users (name, phone, email, password_hash, role, centre_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertFarmer = db.prepare(`
    INSERT INTO farmers (user_id, farmer_id, aadhaar_masked, village, district, state, bank_account_masked, ifsc_code, land_acres)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Admin
  insertUser.run('Dr. Sanjay Meena (Director)', '9999999999', 'admin@kisanprocure.gov.in', passwordHashAdmin, 'admin', null);

  // Officer
  const officerUser = insertUser.run('Rajesh Sharma (Inspector)', '9876543220', 'officer.muz@kisanprocure.gov.in', passwordHashOfficer, 'officer', c1).lastInsertRowid;

  // Farmers
  const farmersList = [
    { name: 'Ramesh Kumar', phone: '9876543210', fid: 'FARM1001', aadh: 'XXXX-XXXX-4123', village: 'Minapur', dist: 'Muzaffarpur', bank: 'SBI-XXXX-4589', ifsc: 'SBIN0001234', acres: 12.5 },
    { name: 'Suresh Singh', phone: '9876543211', fid: 'FARM1002', aadh: 'XXXX-XXXX-8921', village: 'Minapur', dist: 'Muzaffarpur', bank: 'PNB-XXXX-7721', ifsc: 'PUNB0123400', acres: 8.0 },
    { name: 'Amit Patel', phone: '9876543212', fid: 'FARM1003', aadh: 'XXXX-XXXX-3341', village: 'Kanti', dist: 'Muzaffarpur', bank: 'BOB-XXXX-1934', ifsc: 'BARB0MUZAFF', acres: 15.0 },
    { name: 'Rajendra Yadav', phone: '9876543213', fid: 'FARM1004', aadh: 'XXXX-XXXX-5582', village: 'Bochahan', dist: 'Muzaffarpur', bank: 'UBI-XXXX-9901', ifsc: 'UBIN0532109', acres: 6.5 },
    { name: 'Vikas Sharma', phone: '9876543214', fid: 'FARM1005', aadh: 'XXXX-XXXX-7712', village: 'Motipur', dist: 'Muzaffarpur', bank: 'HDFC-XXXX-6612', ifsc: 'HDFC0004921', acres: 10.0 },
    { name: 'Sunil Mahto', phone: '9876543215', fid: 'FARM1006', aadh: 'XXXX-XXXX-1190', village: 'Sahebganj', dist: 'Muzaffarpur', bank: 'SBI-XXXX-3310', ifsc: 'SBIN0005432', acres: 9.5 },
    { name: 'Manoj Paswan', phone: '9876543216', fid: 'FARM1007', aadh: 'XXXX-XXXX-8822', village: 'Minapur', dist: 'Muzaffarpur', bank: 'CBI-XXXX-4421', ifsc: 'CBIN0281234', acres: 14.0 }
  ];

  const createdFarmers = [];
  for (const f of farmersList) {
    const uId = insertUser.run(f.name, f.phone, `${f.fid.toLowerCase()}@kisan.in`, passwordHashFarmer, 'farmer', null).lastInsertRowid;
    const fId = insertFarmer.run(uId, f.fid, f.aadh, f.village, f.dist, 'Bihar', f.bank, f.ifsc, f.acres).lastInsertRowid;
    createdFarmers.push({ userId: uId, farmerDbId: fId, ...f });
  }

  // 4. Create Slots for Today & Next 3 Days
  const today = new Date().toISOString().split('T')[0];
  const timeSlots = [
    { start: '09:00:00', end: '10:00:00' },
    { start: '10:00:00', end: '11:00:00' },
    { start: '11:00:00', end: '12:00:00' },
    { start: '12:00:00', end: '13:00:00' },
    { start: '14:00:00', end: '15:00:00' },
    { start: '15:00:00', end: '16:00:00' },
  ];

  const insertSlot = db.prepare(`
    INSERT INTO slots (centre_id, slot_date, start_time, end_time, max_capacity, booked_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const createdSlots = {};
  const centres = [c1, c2, c3, c4];

  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().split('T')[0];

    for (const cId of centres) {
      for (const s of timeSlots) {
        const slotId = insertSlot.run(cId, dateStr, s.start, s.end, 20, 0).lastInsertRowid;
        if (!createdSlots[cId]) createdSlots[cId] = {};
        if (!createdSlots[cId][dateStr]) createdSlots[cId][dateStr] = [];
        createdSlots[cId][dateStr].push({ id: slotId, ...s });
      }
    }
  }

  // 5. Populate Active & Completed Bookings for Today at Centre 1
  const insertBooking = db.prepare(`
    INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProcurement = db.prepare(`
    INSERT INTO procurements (booking_id, officer_id, actual_quantity, quality_grade, moisture_percentage, procurement_status, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 hours'))
  `);

  const insertPayment = db.prepare(`
    INSERT INTO payments (procurement_id, farmer_id, amount, msp_rate, transaction_id, status, disbursed_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 hours'))
  `);

  const todaySlots = createdSlots[c1][today];
  const slot10to11 = todaySlots[1]; // 10:00 - 11:00

  // Past served tokens (1 to 17)
  for (let t = 1; t <= 17; t++) {
    const bId = insertBooking.run(
      `BK-2026-${1000 + t}`,
      createdFarmers[t % createdFarmers.length].farmerDbId,
      c1,
      todaySlots[0].id,
      wheatId,
      35 + (t % 15),
      t,
      'completed',
      today
    ).lastInsertRowid;

    const actualQty = 35 + (t % 15) - 0.5;
    const pId = insertProcurement.run(bId, officerUser, actualQty, 'Grade A', 11.8, 'accepted').lastInsertRowid;
    const totalAmount = actualQty * 2425.00;
    insertPayment.run(pId, createdFarmers[t % createdFarmers.length].farmerDbId, totalAmount, 2425.00, `TXN-2026-MUZ-${8000 + t}`, 'paid');
  }

  // Active Live Queue: Current serving is Token 18
  const activeBooking18 = insertBooking.run(
    'BK-2026-1018',
    createdFarmers[6].farmerDbId, // Manoj Paswan
    c1,
    slot10to11.id,
    wheatId,
    45.0,
    18,
    'in_progress',
    today
  ).lastInsertRowid;

  // Waiting in queue:
  // Token 19: Suresh Singh
  insertBooking.run('BK-2026-1019', createdFarmers[1].farmerDbId, c1, slot10to11.id, wheatId, 32.0, 19, 'booked', today);
  // Token 20: Amit Patel
  insertBooking.run('BK-2026-1020', createdFarmers[2].farmerDbId, c1, slot10to11.id, wheatId, 50.0, 20, 'booked', today);
  // Token 21: Rajendra Yadav
  insertBooking.run('BK-2026-1021', createdFarmers[3].farmerDbId, c1, slot10to11.id, wheatId, 25.0, 21, 'booked', today);
  // Token 22: Vikas Sharma
  insertBooking.run('BK-2026-1022', createdFarmers[4].farmerDbId, c1, slot10to11.id, wheatId, 40.0, 22, 'booked', today);
  
  // Token 23: Ramesh Kumar (Our protagonist)
  const rameshBookingId = insertBooking.run(
    'BK-2026-1023',
    createdFarmers[0].farmerDbId, // Ramesh Kumar
    c1,
    slot10to11.id,
    wheatId,
    40.0,
    23,
    'booked',
    today
  ).lastInsertRowid;

  // Token 24: Sunil Mahto
  insertBooking.run('BK-2026-1024', createdFarmers[5].farmerDbId, c1, slot10to11.id, wheatId, 38.0, 24, 'booked', today);

  // Update Slot Booked Counts
  db.prepare('UPDATE slots SET booked_count = 17 WHERE id = ?').run(todaySlots[0].id);
  db.prepare('UPDATE slots SET booked_count = 7 WHERE id = ?').run(todaySlots[1].id);

  // 6. Set Live Queue State: Current Token = 18
  db.prepare(`
    INSERT INTO queue_state (centre_id, current_token, active_booking_id, last_called_at)
    VALUES (?, 18, ?, datetime('now'))
  `).run(c1, activeBooking18);

  for (const c of [c2, c3, c4]) {
    db.prepare(`
      INSERT INTO queue_state (centre_id, current_token, active_booking_id, last_called_at)
      VALUES (?, 0, NULL, datetime('now'))
    `).run(c);
  }

  // 7. Add In-App Notifications for Ramesh Kumar
  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', '-30 minutes'))
  `);

  insertNotif.run(
    createdFarmers[0].userId,
    'Slot Booking Confirmed',
    'Your slot for 40.0 Quintals of Wheat at Muzaffarpur Central Mandi is confirmed. Token Number: 23 (Slot: 10:00 AM - 11:00 AM).',
    'success',
    0
  );

  insertNotif.run(
    createdFarmers[0].userId,
    'Live Queue Active',
    'Current serving token at Muzaffarpur Central Mandi is Token 18. 5 farmers are ahead of you.',
    'info',
    0
  );

  console.log('✅ Database seeded with complete demonstration dataset.');
  console.log('👨‍🌾 Ramesh Kumar (Farmer): Phone 9876543210 | Pass: farmer123 | Token: 23');
  console.log('👮 Rajesh Sharma (Officer): Phone 9876543220 | Pass: officer123 | Centre: PC-MUZ-01');
  console.log('🏛️ Dr. Sanjay Meena (Admin): Phone 9999999999 | Pass: admin123');
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase();
}
