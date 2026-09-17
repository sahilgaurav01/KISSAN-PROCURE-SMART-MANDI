/**
 * =========================================================
 * DATA MODULE: MASTER SEED DATASET (js/data/mockData.js)
 * Defines Mandi Centres, Official MSPs, Farmer Profiles & Seed Queues
 * =========================================================
 */

export const MOCK_CENTRES = [
  { 
    id: 1, 
    name: 'Muzaffarpur Central Mandi', 
    code: 'PC-MUZ-01', 
    district: 'Muzaffarpur', 
    state: 'Bihar',
    address: 'NH-28 Bypass Road, Near Krishi Vigyan Kendra, Muzaffarpur', 
    capacity: 20 
  },
  { 
    id: 2, 
    name: 'Kanti Regional APMC Yard', 
    code: 'PC-MUZ-02', 
    district: 'Muzaffarpur', 
    state: 'Bihar',
    address: 'Station Road, Kanti Block, Muzaffarpur', 
    capacity: 15 
  },
  { 
    id: 3, 
    name: 'Bochahan Kisan Mandi', 
    code: 'PC-MUZ-03', 
    district: 'Muzaffarpur', 
    state: 'Bihar',
    address: 'State Highway 52, Bochahan, Muzaffarpur', 
    capacity: 15 
  },
  { 
    id: 4, 
    name: 'Patna Grain Terminal', 
    code: 'PC-PAT-01', 
    district: 'Patna', 
    state: 'Bihar',
    address: 'Fatuha Industrial Mandi Area, Patna', 
    capacity: 30 
  }
];

export const MOCK_CROPS = [
  { id: 1, name: 'Wheat (PBW-343)', code: 'WHEAT', msp: 2425.00, season: 'Rabi' },
  { id: 2, name: 'Paddy (Grade A)', code: 'PADDY_GRA', msp: 2320.00, season: 'Kharif' },
  { id: 3, name: 'Mustard / Rapeseed', code: 'MUSTARD', msp: 5650.00, season: 'Rabi' },
  { id: 4, name: 'Gram (Chana)', code: 'GRAM', msp: 5440.00, season: 'Rabi' },
  { id: 5, name: 'Maize', code: 'MAIZE', msp: 2090.00, season: 'Kharif' }
];

export const MOCK_BOOKINGS = [
  { 
    id: 1018, 
    bookingNumber: 'BK-2026-1018', 
    tokenNumber: 18, 
    farmerName: 'Manoj Paswan', 
    farmerId: 'FARM1007', 
    phone: '9876543216', 
    village: 'Minapur', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 45.0, 
    status: 'in_progress', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1019, 
    bookingNumber: 'BK-2026-1019', 
    tokenNumber: 19, 
    farmerName: 'Suresh Singh', 
    farmerId: 'FARM1002', 
    phone: '9876543211', 
    village: 'Minapur', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 32.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1020, 
    bookingNumber: 'BK-2026-1020', 
    tokenNumber: 20, 
    farmerName: 'Amit Patel', 
    farmerId: 'FARM1003', 
    phone: '9876543212', 
    village: 'Kanti', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 50.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1021, 
    bookingNumber: 'BK-2026-1021', 
    tokenNumber: 21, 
    farmerName: 'Rajendra Yadav', 
    farmerId: 'FARM1004', 
    phone: '9876543213', 
    village: 'Bochahan', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 25.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1022, 
    bookingNumber: 'BK-2026-1022', 
    tokenNumber: 22, 
    farmerName: 'Vikas Sharma', 
    farmerId: 'FARM1005', 
    phone: '9876543214', 
    village: 'Motipur', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 40.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1023, 
    bookingNumber: 'BK-2026-1023', 
    tokenNumber: 23, 
    farmerName: 'Ramesh Kumar', 
    farmerId: 'FARM1001', 
    phone: '9876543210', 
    village: 'Minapur', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 40.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  },
  { 
    id: 1024, 
    bookingNumber: 'BK-2026-1024', 
    tokenNumber: 24, 
    farmerName: 'Sunil Mahto', 
    farmerId: 'FARM1006', 
    phone: '9876543215', 
    village: 'Sahebganj', 
    crop: 'Wheat (PBW-343)', 
    msp: 2425, 
    expectedQty: 38.0, 
    status: 'booked', 
    date: 'Today', 
    slotTime: '10:00 - 11:00 AM', 
    centreId: 1 
  }
];

export const MOCK_PAYMENTS = [
  { id: 1, txnId: 'TXN-2026-MUZ-8017', farmerName: 'Kamlesh Rai', farmerCode: 'FARM1009', bankMask: 'SBI-XXXX-1120', crop: 'Wheat', qty: 38.5, msp: 2425, amount: 93362.50, status: 'paid', date: 'Today' },
  { id: 2, txnId: 'TXN-2026-MUZ-8016', farmerName: 'Deepak Jha', farmerCode: 'FARM1008', bankMask: 'PNB-XXXX-4491', crop: 'Wheat', qty: 42.0, msp: 2425, amount: 101850.00, status: 'paid', date: 'Today' },
  { id: 3, txnId: 'TXN-2026-MUZ-8015', farmerName: 'Ramesh Kumar', farmerCode: 'FARM1001', bankMask: 'SBI-XXXX-4589', crop: 'Wheat (Last Season)', qty: 50.0, msp: 2275, amount: 113750.00, status: 'paid', date: '14 Aug 2026' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Slot Confirmed!', message: 'Your booking for 40.0 Quintals of Wheat at Muzaffarpur Central Mandi is confirmed. Token Number: #23.', time: '10 mins ago', type: 'success', read: false },
  { id: 2, title: 'Live Queue Active', message: 'Current serving token is #18. 5 farmers are ahead of you.', time: '5 mins ago', type: 'info', read: false }
];
