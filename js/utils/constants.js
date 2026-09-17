/**
 * =========================================================
 * UTILS: APPLICATION CONSTANTS (js/utils/constants.js)
 * =========================================================
 */

export const ROLES = {
  FARMER: 'farmer',
  OFFICER: 'officer',
  ADMIN: 'admin'
};

export const BOOKING_STATUS = {
  BOOKED: 'booked',
  IN_PROGRESS: 'in_progress',
  WEIGHED: 'weighed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed'
};

export const DEFAULT_CROPS = [
  { id: 1, name: 'Wheat (PBW-343)', code: 'WHEAT', msp: 2425.00, season: 'Rabi' },
  { id: 2, name: 'Paddy (Grade A)', code: 'PADDY_GRA', msp: 2320.00, season: 'Kharif' },
  { id: 3, name: 'Mustard / Rapeseed', code: 'MUSTARD', msp: 5650.00, season: 'Rabi' },
  { id: 4, name: 'Gram (Chana)', code: 'GRAM', msp: 5440.00, season: 'Rabi' },
  { id: 5, name: 'Maize', code: 'MAIZE', msp: 2090.00, season: 'Kharif' }
];

export const DEFAULT_CENTRES = [
  { id: 1, name: 'Muzaffarpur Central Mandi', code: 'PC-MUZ-01', district: 'Muzaffarpur', capacity: 20 },
  { id: 2, name: 'Kanti Regional APMC Yard', code: 'PC-MUZ-02', district: 'Muzaffarpur', capacity: 15 },
  { id: 3, name: 'Bochahan Kisan Mandi', code: 'PC-MUZ-03', district: 'Muzaffarpur', capacity: 15 },
  { id: 4, name: 'Patna Grain Terminal', code: 'PC-PAT-01', district: 'Patna', capacity: 30 }
];
