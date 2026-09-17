/**
 * =========================================================
 * DATA MODULE: MASTER SEED DATASET (js/data/mockData.js)
 * 9 Relational Entities: profiles, farmers, mandis, crops,
 * slots, bookings, queue, procurements, payments
 * =========================================================
 */

export const MOCK_PROFILES = [
  { id: '11111111-1111-1111-1111-111111111111', full_name: 'Ramesh Kumar', phone: '9876543210', role: 'farmer', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', full_name: 'Suresh Singh', phone: '9876543211', role: 'farmer', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333333', full_name: 'Manoj Paswan', phone: '9876543216', role: 'farmer', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888888', full_name: 'Rajesh Sharma', phone: '9876543200', role: 'officer', created_at: new Date().toISOString() },
  { id: '99999999-9999-9999-9999-999999999999', full_name: 'Dr. Sanjay Meena', phone: '9876543201', role: 'admin', created_at: new Date().toISOString() }
];

export const MOCK_FARMERS = [
  { id: 'f1111111-1111-1111-1111-111111111111', farmer_code: 'FARM1001', profile_id: '11111111-1111-1111-1111-111111111111', address: 'Ward 3', village: 'Minapur', district: 'Muzaffarpur', state: 'Bihar', bank_account_masked: 'SBI-XXXX-4589', created_at: new Date().toISOString() },
  { id: 'f2222222-2222-2222-2222-222222222222', farmer_code: 'FARM1002', profile_id: '22222222-2222-2222-2222-222222222222', address: 'Main Road', village: 'Minapur', district: 'Muzaffarpur', state: 'Bihar', bank_account_masked: 'PNB-XXXX-1120', created_at: new Date().toISOString() },
  { id: 'f3333333-3333-3333-3333-333333333333', farmer_code: 'FARM1007', profile_id: '33333333-3333-3333-3333-333333333333', address: 'Kisan Tola', village: 'Minapur', district: 'Muzaffarpur', state: 'Bihar', bank_account_masked: 'SBI-XXXX-9901', created_at: new Date().toISOString() }
];

export const MOCK_MANDIS = [
  { id: 1, name: 'Muzaffarpur Central Mandi', address: 'NH-28 Bypass Road, Near KVK, Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar' },
  { id: 2, name: 'Kanti Regional APMC Yard', address: 'Station Road, Kanti Block, Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar' },
  { id: 3, name: 'Bochahan Kisan Mandi', address: 'State Highway 52, Bochahan, Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar' },
  { id: 4, name: 'Patna Grain Terminal', address: 'Fatuha Industrial Mandi Area, Patna', district: 'Patna', state: 'Bihar' }
];

export const MOCK_CROPS = [
  { id: 1, crop_name: 'Wheat (PBW-343)', msp_per_quintal: 2425.00, season: 'Rabi' },
  { id: 2, crop_name: 'Paddy (Grade A)', msp_per_quintal: 2320.00, season: 'Kharif' },
  { id: 3, crop_name: 'Mustard / Rapeseed', msp_per_quintal: 5650.00, season: 'Rabi' },
  { id: 4, crop_name: 'Gram (Chana)', msp_per_quintal: 5440.00, season: 'Rabi' },
  { id: 5, crop_name: 'Maize', msp_per_quintal: 2090.00, season: 'Kharif' }
];

export const MOCK_SLOTS = [
  { id: 1, mandi_id: 1, slot_date: 'Today', start_time: '09:00 AM', end_time: '10:00 AM', max_capacity: 20, available_capacity: 3 },
  { id: 2, mandi_id: 1, slot_date: 'Today', start_time: '10:00 AM', end_time: '11:00 AM', max_capacity: 20, available_capacity: 6 },
  { id: 3, mandi_id: 1, slot_date: 'Today', start_time: '11:00 AM', end_time: '12:00 PM', max_capacity: 20, available_capacity: 14, is_recommended: true },
  { id: 4, mandi_id: 1, slot_date: 'Today', start_time: '12:00 PM', end_time: '01:00 PM', max_capacity: 20, available_capacity: 11 },
  { id: 5, mandi_id: 1, slot_date: 'Today', start_time: '02:00 PM', end_time: '03:00 PM', max_capacity: 20, available_capacity: 18 }
];

export const MOCK_BOOKINGS = [
  { id: 'b1111111-1111-1111-1111-111111111111', farmer_id: 'f3333333-3333-3333-3333-333333333333', slot_id: 2, crop_id: 1, bookingNumber: 'BK-2026-1018', declared_quantity: 45.0, expectedQty: 45.0, token_number: 18, tokenNumber: 18, farmerName: 'Manoj Paswan', farmerId: 'FARM1007', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, status: 'in_progress', created_at: new Date().toISOString() },
  { id: 'b2222222-2222-2222-2222-222222222222', farmer_id: 'f2222222-2222-2222-2222-222222222222', slot_id: 2, crop_id: 1, bookingNumber: 'BK-2026-1019', declared_quantity: 32.0, expectedQty: 32.0, token_number: 19, tokenNumber: 19, farmerName: 'Suresh Singh', farmerId: 'FARM1002', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, status: 'booked', created_at: new Date().toISOString() },
  { id: 'b3333333-3333-3333-3333-333333333333', farmer_id: 'f1111111-1111-1111-1111-111111111111', slot_id: 2, crop_id: 1, bookingNumber: 'BK-2026-1023', declared_quantity: 40.0, expectedQty: 40.0, token_number: 23, tokenNumber: 23, farmerName: 'Ramesh Kumar', farmerId: 'FARM1001', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, status: 'booked', created_at: new Date().toISOString() }
];

export const MOCK_QUEUE = [
  { id: 'q1111111-1111-1111-1111-111111111111', booking_id: 'b1111111-1111-1111-1111-111111111111', token_number: 18, status: 'serving', called_at: new Date().toISOString(), served_at: null },
  { id: 'q2222222-2222-2222-2222-222222222222', booking_id: 'b2222222-2222-2222-2222-222222222222', token_number: 19, status: 'calling', called_at: null, served_at: null },
  { id: 'q3333333-3333-3333-3333-333333333333', booking_id: 'b3333333-3333-3333-3333-333333333333', token_number: 23, status: 'waiting', called_at: null, served_at: null }
];

export const MOCK_PROCUREMENTS = [
  { id: 'p1111111-1111-1111-1111-111111111111', booking_id: 'b1111111-1111-1111-1111-111111111111', actual_quantity: 44.5, quality_grade: 'Grade A', moisture_percentage: 11.6, msp_rate: 2425.00, total_amount: 107912.50, status: 'approved', created_at: new Date().toISOString() }
];

export const MOCK_PAYMENTS = [
  { id: 'y1111111-1111-1111-1111-111111111111', procurement_id: 'p1111111-1111-1111-1111-111111111111', farmer_id: 'f3333333-3333-3333-3333-333333333333', txnId: 'TXN-2026-MUZ-8018', transaction_id: 'TXN-2026-MUZ-8018', crop: 'Wheat (PBW-343)', qty: 44.5, msp: 2425, amount: 107912.50, payment_status: 'paid', status: 'paid', bankMask: 'SBI-XXXX-9901', paid_at: new Date().toISOString() }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Slot Confirmed!', message: 'Your booking for 40.0 Quintals of Wheat at Muzaffarpur Central Mandi is confirmed. Token Number: #23.', time: '10 mins ago', type: 'success', read: false },
  { id: 2, title: 'Live Queue Active', message: 'Current serving token is #18. 5 farmers are ahead of you.', time: '5 mins ago', type: 'info', read: false }
];

// Aliases for compatibility
export const MOCK_CENTRES = MOCK_MANDIS;
