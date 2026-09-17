/**
 * =========================================================
 * OFFICER: FARMER VERIFICATION (js/officer/farmer-verification.js)
 * Token Pass & Biometric / Aadhar Verification Gate
 * =========================================================
 */

import { supabase } from '../supabase/client.js';

export function verifyFarmerToken(tokenNum) {
  const db = supabase.getLocalDb();
  const booking = db.bookings.find(b => b.tokenNumber === Number(tokenNum));
  if (!booking) return { valid: false, message: 'Invalid token number' };
  return { valid: true, booking };
}
