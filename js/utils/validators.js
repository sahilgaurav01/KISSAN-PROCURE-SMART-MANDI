/**
 * =========================================================
 * UTILS: INPUT VALIDATORS (js/utils/validators.js)
 * Validates Phone numbers, Aadhar masks, quantities & moisture %
 * =========================================================
 */

export function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone).trim());
}

export function validateAadhaar(aadhaar) {
  const cleaned = String(aadhaar).replace(/[^0-9]/g, '');
  return cleaned.length === 12;
}

export function validateQuantity(qty, min = 1, max = 500) {
  const num = Number(qty);
  return !isNaN(num) && num >= min && num <= max;
}

export function validateMoisture(moisture, maxLimit = 12.0) {
  const num = Number(moisture);
  if (isNaN(num) || num <= 0 || num > 30) return { valid: false, message: 'Invalid moisture percentage' };
  if (num > maxLimit) return { valid: true, permissible: false, message: `Moisture (${num}%) exceeds permissible limit of ${maxLimit}%` };
  return { valid: true, permissible: true, message: 'Moisture within permissible limits' };
}
