const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'kisan_procure_super_secret_jwt_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user details
    const user = db.prepare(`
      SELECT u.id, u.name, u.phone, u.email, u.role, u.centre_id,
             f.id as farmer_db_id, f.farmer_id, f.village, f.district, f.state,
             f.bank_account_masked, f.ifsc_code, f.land_acres
      FROM users u
      LEFT JOIN farmers f ON u.id = f.user_id
      WHERE u.id = ?
    `).get(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${allowedRoles.join(' or ')} role.` });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
