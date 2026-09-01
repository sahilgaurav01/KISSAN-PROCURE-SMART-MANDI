const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role = 'farmer', village, district, state = 'Bihar', aadhaar, bankAccount, ifsc, landAcres = 5.0, centreId } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and password are required.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const insertUser = db.prepare(`
      INSERT INTO users (name, phone, email, password_hash, role, centre_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertUser.run(name, phone, email || null, passwordHash, role, centreId || null);
    const userId = result.lastInsertRowid;

    let farmerDbId = null;
    let farmerIdCode = null;

    if (role === 'farmer') {
      const countFarmers = db.prepare('SELECT COUNT(*) as c FROM farmers').get().c;
      farmerIdCode = `FARM${1000 + countFarmers + 1}`;
      const maskedAadhaar = aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;
      const maskedBank = bankAccount ? `BANK-XXXX-${bankAccount.slice(-4)}` : `SBI-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;

      const insertFarmer = db.prepare(`
        INSERT INTO farmers (user_id, farmer_id, aadhaar_masked, village, district, state, bank_account_masked, ifsc_code, land_acres)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const farmerRes = insertFarmer.run(
        userId,
        farmerIdCode,
        maskedAadhaar,
        village || 'Central Village',
        district || 'Muzaffarpur',
        state,
        maskedBank,
        ifsc || 'SBIN0001234',
        parseFloat(landAcres) || 5.0
      );
      farmerDbId = farmerRes.lastInsertRowid;
    }

    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: userId,
        name,
        phone,
        email,
        role,
        farmerId: farmerIdCode,
        farmerDbId,
        centreId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password are required.' });
    }

    const user = db.prepare(`
      SELECT u.id, u.name, u.phone, u.email, u.password_hash, u.role, u.centre_id,
             f.id as farmer_db_id, f.farmer_id, f.village, f.district, f.state,
             f.bank_account_masked, f.ifsc_code, f.land_acres,
             pc.name as centre_name, pc.code as centre_code
      FROM users u
      LEFT JOIN farmers f ON u.id = f.user_id
      LEFT JOIN procurement_centres pc ON u.centre_id = pc.id
      WHERE u.phone = ?
    `).get(phone);

    if (!user) {
      return res.status(400).json({ success: false, message: 'No account found with this phone number.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        centreId: user.centre_id,
        centreName: user.centre_name,
        centreCode: user.centre_code,
        farmerId: user.farmer_id,
        farmerDbId: user.farmer_db_id,
        village: user.village,
        district: user.district,
        state: user.state,
        bankAccount: user.bank_account_masked,
        landAcres: user.land_acres
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

exports.getMe = (req, res) => {
  try {
    const unreadNotifs = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.user.id).count;
    
    res.json({
      success: true,
      user: {
        ...req.user,
        unreadNotifications: unreadNotifs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch session' });
  }
};

exports.getDemoAccounts = (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'farmer',
        title: 'Ramesh Kumar (Farmer)',
        badge: 'Protagonist Demo',
        phone: '9876543210',
        password: 'farmer123',
        description: 'Has booked Token 23 for 40 Quintals of Wheat at Muzaffarpur Central Mandi.'
      },
      {
        role: 'officer',
        title: 'Rajesh Sharma (Procurement Officer)',
        badge: 'Desk Control',
        phone: '9876543220',
        password: 'officer123',
        description: 'Managing Desk 1 at Muzaffarpur Central Mandi (PC-MUZ-01). Call next, weigh, verify.'
      },
      {
        role: 'admin',
        title: 'Dr. Sanjay Meena (Director of Procurement)',
        badge: 'Govt Oversight',
        phone: '9999999999',
        password: 'admin123',
        description: 'State-level oversight, Recharts analytics, MSP disbursement approval & centre audit.'
      }
    ]
  });
};
