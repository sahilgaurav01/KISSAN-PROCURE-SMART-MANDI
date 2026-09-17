/**
 * =========================================================
 * KISANPROCURE: VANILLA JAVASCRIPT STATE & WORKFLOW ENGINE
 * Smart India Hackathon • Problem Statement 26032
 * =========================================================
 */

// Initial Seed Dataset (Stored in LocalStorage for persistence)
const DEFAULT_STATE = {
  activeRole: 'farmer', // 'farmer', 'officer', 'admin'
  lang: 'en', // 'en', 'hi'
  currentTab: 'farmer-dashboard',
  currentServingToken: 18,
  
  centres: [
    { id: 1, name: 'Muzaffarpur Central Mandi', code: 'PC-MUZ-01', district: 'Muzaffarpur', address: 'NH-28 Bypass Road, Near KVK, Muzaffarpur, Bihar', capacity: 20 },
    { id: 2, name: 'Kanti Regional APMC Yard', code: 'PC-MUZ-02', district: 'Muzaffarpur', address: 'Station Road, Kanti Block, Muzaffarpur, Bihar', capacity: 15 },
    { id: 3, name: 'Bochahan Kisan Mandi', code: 'PC-MUZ-03', district: 'Muzaffarpur', address: 'State Highway 52, Bochahan, Muzaffarpur, Bihar', capacity: 15 }
  ],

  crops: [
    { id: 1, name: 'Wheat (PBW-343)', code: 'WHEAT', msp: 2425.00, season: 'Rabi' },
    { id: 2, name: 'Paddy (Grade A)', code: 'PADDY_GRA', msp: 2320.00, season: 'Kharif' },
    { id: 3, name: 'Mustard / Rapeseed', code: 'MUSTARD', msp: 5650.00, season: 'Rabi' },
    { id: 4, name: 'Gram (Chana)', code: 'GRAM', msp: 5440.00, season: 'Rabi' },
    { id: 5, name: 'Maize', code: 'MAIZE', msp: 2090.00, season: 'Kharif' }
  ],

  bookings: [
    { id: 1018, bookingNumber: 'BK-2026-1018', tokenNumber: 18, farmerName: 'Manoj Paswan', farmerId: 'FARM1007', phone: '9876543216', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 45.0, status: 'in_progress', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1019, bookingNumber: 'BK-2026-1019', tokenNumber: 19, farmerName: 'Suresh Singh', farmerId: 'FARM1002', phone: '9876543211', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 32.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1020, bookingNumber: 'BK-2026-1020', tokenNumber: 20, farmerName: 'Amit Patel', farmerId: 'FARM1003', phone: '9876543212', village: 'Kanti', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 50.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1021, bookingNumber: 'BK-2026-1021', tokenNumber: 21, farmerName: 'Rajendra Yadav', farmerId: 'FARM1004', phone: '9876543213', village: 'Bochahan', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 25.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1022, bookingNumber: 'BK-2026-1022', tokenNumber: 22, farmerName: 'Vikas Sharma', farmerId: 'FARM1005', phone: '9876543214', village: 'Motipur', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 40.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1023, bookingNumber: 'BK-2026-1023', tokenNumber: 23, farmerName: 'Ramesh Kumar', farmerId: 'FARM1001', phone: '9876543210', village: 'Minapur', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 40.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 },
    { id: 1024, bookingNumber: 'BK-2026-1024', tokenNumber: 24, farmerName: 'Sunil Mahto', farmerId: 'FARM1006', phone: '9876543215', village: 'Sahebganj', crop: 'Wheat (PBW-343)', msp: 2425, expectedQty: 38.0, status: 'booked', date: 'Today', slotTime: '10:00 - 11:00 AM', centreId: 1 }
  ],

  procurements: [
    { id: 1, bookingNumber: 'BK-2026-1017', farmerName: 'Kamlesh Rai', tokenNumber: 17, crop: 'Wheat', actualQty: 38.5, grade: 'Grade A', moisture: 11.5, amount: 93362.50, txnId: 'TXN-2026-MUZ-8017', status: 'paid', date: 'Today 09:45 AM' },
    { id: 2, bookingNumber: 'BK-2026-1016', farmerName: 'Deepak Jha', tokenNumber: 16, crop: 'Wheat', actualQty: 42.0, grade: 'Grade A', moisture: 11.8, amount: 101850.00, txnId: 'TXN-2026-MUZ-8016', status: 'paid', date: 'Today 09:30 AM' }
  ],

  payments: [
    { id: 1, txnId: 'TXN-2026-MUZ-8017', farmerName: 'Kamlesh Rai', farmerCode: 'FARM1009', bankMask: 'SBI-XXXX-1120', crop: 'Wheat', qty: 38.5, msp: 2425, amount: 93362.50, status: 'paid', date: 'Today' },
    { id: 2, txnId: 'TXN-2026-MUZ-8016', farmerName: 'Deepak Jha', farmerCode: 'FARM1008', bankMask: 'PNB-XXXX-4491', crop: 'Wheat', qty: 42.0, msp: 2425, amount: 101850.00, status: 'paid', date: 'Today' },
    { id: 3, txnId: 'TXN-2026-MUZ-8015', farmerName: 'Ramesh Kumar', farmerCode: 'FARM1001', bankMask: 'SBI-XXXX-4589', crop: 'Wheat (Last Season)', qty: 50.0, msp: 2275, amount: 113750.00, status: 'paid', date: '14 Aug 2026' }
  ],

  notifications: [
    { id: 1, title: 'Slot Confirmed!', message: 'Your booking for 40.0 Quintals of Wheat at Muzaffarpur Central Mandi is confirmed. Token Number: #23.', time: '10 mins ago', type: 'success', read: false },
    { id: 2, title: 'Live Queue Active', message: 'Current serving token is #18. 5 farmers are ahead of you.', time: '5 mins ago', type: 'info', read: false }
  ]
};

// Translations Dictionary
const I18N = {
  en: {
    govtHeader: 'Govt. of India • Smart India Hackathon • Problem Statement 26032',
    appSubtitle: 'Smart Mandi Queue & Transparent MSP Payout System',
    switchRoleLabel: '⚡ Quick Persona:',
    heroTitle: 'Eliminating Mandi Queues, \nEmpowering Indian Farmers',
    heroDesc: 'KisanProcure is a smart procurement slot booking and real-time WebSocket queue tracking platform with digital weighbridge verification and transparent Direct Benefit Transfer (DBT) MSP payments.',
    farmerPortal: 'Farmer Self-Service Dashboard',
    welcome: 'Welcome',
    bookSlot: 'Book Slot',
    liveQueue: 'Live Queue',
    myBookings: 'My Bookings',
    payments: 'Payments',
    callNext: '⚡ CALL NEXT FARMER',
    verifyCrop: '⚖️ WEIGH & VERIFY CROP',
    officerPortal: 'Mandi Live Queue Control',
    adminPortal: 'Government Oversight & DBT Portal',
    bookSlotTitle: 'Book Mandi Procurement Slot',
    liveQueueTitle: 'Live Queue Visualizer',
    procurementStatusTitle: 'Procurement Status & Slips',
    paymentsTitle: 'Procurement Payouts & DBT Status'
  },
  hi: {
    govtHeader: 'भारत सरकार • स्मार्ट इंडिया हैकाथॉन • समस्या विवरण 26032',
    appSubtitle: 'स्मार्ट मंडी कतार एवं प्रत्यक्ष MSP भुगतान प्रणाली',
    switchRoleLabel: '⚡ त्वरित रोल:',
    heroTitle: 'कतार-मुक्त कृषि मंडियां, \nसशक्त एवं आत्मनिर्भर किसान',
    heroDesc: 'किसान प्रोक्योर एक संपूर्ण स्मार्ट कृषि स्लॉट बुकिंग एवं रीयल-टाइम कतार प्रबंधन प्रणाली है जो पारदर्शी वजन और त्वरित डीबीटी भुगतान सुनिश्चित करती है।',
    farmerPortal: 'किसान स्वयं-सेवा डैशबोर्ड',
    welcome: 'स्वागत है',
    bookSlot: 'स्लॉट बुक करें',
    liveQueue: 'लाइव कतार',
    myBookings: 'मेरी बुकिंग',
    payments: 'भुगतान स्थिति',
    callNext: '⚡ अगले किसान को बुलाएं',
    verifyCrop: '⚖️ फसल वजन एवं जांच',
    officerPortal: 'अधिकारी लाइव डेस्क नियंत्रण',
    adminPortal: 'सरकारी एनालिटिक्स एवं डीबीटी पोर्टल',
    bookSlotTitle: 'मंडी खरीद स्लॉट बुक करें',
    liveQueueTitle: 'लाइव कतार ट्रैकर',
    procurementStatusTitle: 'खरीद स्थिति एवं वजन रसीद',
    paymentsTitle: 'प्रत्यक्ष लाभ अंतरण (DBT) भुगतान'
  }
};

// State Manager
class StateManager {
  constructor() {
    const saved = localStorage.getItem('kisanprocure_state');
    this.state = saved ? JSON.parse(saved) : DEFAULT_STATE;
  }

  save() {
    localStorage.setItem('kisanprocure_state', JSON.stringify(this.state));
  }

  get() {
    return this.state;
  }
}

const stateMgr = new StateManager();
let state = stateMgr.get();

// Selected Booking helper state for Booking Wizard
let currentBookingState = {
  crop: state.crops[0],
  qty: 40,
  centre: state.centres[0],
  date: new Date().toISOString().split('T')[0],
  slotTime: '10:00 - 11:00 AM'
};

// Chart instances
let trendChartInstance = null;
let cropPieChartInstance = null;

// ==========================================
// RENDER & UI INITIALIZATION
// ==========================================

function initApp() {
  renderNavbar();
  renderRolePills();
  renderActiveView();
  renderNotifications();
  lucide.createIcons();
  applyLanguage();
}

function applyLanguage() {
  const t = I18N[state.lang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.getElementById('lang-btn-text').textContent = state.lang === 'en' ? 'हिन्दी' : 'English';
}

function toggleLanguage() {
  state.lang = state.lang === 'en' ? 'hi' : 'en';
  stateMgr.save();
  applyLanguage();
}

function switchRole(role) {
  state.activeRole = role;
  if (role === 'farmer') state.currentTab = 'farmer-dashboard';
  else if (role === 'officer') state.currentTab = 'officer-desk';
  else if (role === 'admin') state.currentTab = 'admin-analytics';

  stateMgr.save();
  renderRolePills();
  renderNavbar();
  switchTab(state.currentTab);
}

function renderRolePills() {
  const roles = ['farmer', 'officer', 'admin'];
  roles.forEach(r => {
    const btn = document.getElementById(`role-btn-${r}`);
    if (btn) {
      if (state.activeRole === r) {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-800 text-emerald-100 border border-emerald-600 transition flex items-center space-x-1';
      } else {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center space-x-1';
      }
    }
  });

  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const label = document.getElementById('user-role-label');

  if (state.activeRole === 'farmer') {
    avatar.className = 'w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center';
    avatar.textContent = 'R';
    name.textContent = 'Ramesh Kumar';
    label.textContent = 'ID: FARM1001 • Farmer';
  } else if (state.activeRole === 'officer') {
    avatar.className = 'w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center';
    avatar.textContent = 'R';
    name.textContent = 'Rajesh Sharma';
    label.textContent = 'Inspector • Mandi Desk 1';
  } else {
    avatar.className = 'w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center';
    avatar.textContent = 'S';
    name.textContent = 'Dr. Sanjay Meena';
    label.textContent = 'Director of Procurement';
  }
}

function renderNavbar() {
  const nav = document.getElementById('nav-links');
  nav.innerHTML = '';

  let links = [];
  if (state.activeRole === 'farmer') {
    links = [
      { id: 'farmer-dashboard', label: 'Dashboard', icon: 'activity' },
      { id: 'book-slot', label: 'Book Slot', icon: 'calendar' },
      { id: 'live-queue', label: 'Live Queue', icon: 'radio' },
      { id: 'procurement-status', label: 'Procurement Slips', icon: 'file-text' },
      { id: 'payments', label: 'DBT Payments', icon: 'credit-card' }
    ];
  } else if (state.activeRole === 'officer') {
    links = [
      { id: 'officer-desk', label: 'Mandi Desk Control', icon: 'scale' },
      { id: 'live-queue', label: 'Live Queue View', icon: 'radio' }
    ];
  } else {
    links = [
      { id: 'admin-analytics', label: 'State Oversight & Analytics', icon: 'building-2' }
    ];
  }

  links.forEach(l => {
    const btn = document.createElement('button');
    const isActive = state.currentTab === l.id;
    btn.className = `px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
      isActive ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
    btn.onclick = () => switchTab(l.id);
    btn.innerHTML = `<i data-lucide="${l.icon}" class="w-4 h-4"></i><span>${l.label}</span>`;
    nav.appendChild(btn);
  });

  lucide.createIcons();
}

function switchTab(tabId) {
  state.currentTab = tabId;
  stateMgr.save();
  renderNavbar();

  // Hide all views
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

  // Show active view
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Render view-specific components
  if (tabId === 'farmer-dashboard') renderFarmerDashboard();
  if (tabId === 'book-slot') renderBookSlotWizard();
  if (tabId === 'live-queue') renderLiveQueue();
  if (tabId === 'procurement-status') renderProcurementStatus();
  if (tabId === 'payments') renderPaymentLedger();
  if (tabId === 'officer-desk') renderOfficerDesk();
  if (tabId === 'admin-analytics') renderAdminAnalytics();

  lucide.createIcons();
}

// ==========================================
// 1. FARMER DASHBOARD
// ==========================================
function renderFarmerDashboard() {
  const liveToken = state.currentServingToken;
  document.getElementById('dash-live-token').textContent = `#${liveToken}`;
  const ahead = Math.max(0, 23 - liveToken);
  document.getElementById('dash-farmers-ahead').textContent = ahead === 0 ? 'Your Turn Now!' : `${ahead} Farmers Ahead`;
  document.getElementById('dash-est-wait').textContent = `~${Math.round(ahead * 5.5)} mins`;
}

// ==========================================
// 2. BOOK SLOT WIZARD
// ==========================================
function renderBookSlotWizard() {
  const cropCont = document.getElementById('booking-crops-container');
  cropCont.innerHTML = '';
  state.crops.forEach(c => {
    const isSelected = currentBookingState.crop.id === c.id;
    const div = document.createElement('div');
    div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
      isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
    }`;
    div.onclick = () => {
      currentBookingState.crop = c;
      renderBookSlotWizard();
    };
    div.innerHTML = `
      <div class="font-bold text-slate-800 text-xs">${c.name}</div>
      <div class="text-[10px] text-emerald-700 font-semibold mt-1">MSP: ₹${c.msp}/Qtl</div>
    `;
    cropCont.appendChild(div);
  });

  const centreCont = document.getElementById('booking-centres-container');
  centreCont.innerHTML = '';
  state.centres.forEach(centre => {
    const isSelected = currentBookingState.centre.id === centre.id;
    const div = document.createElement('div');
    div.className = `p-3.5 rounded-2xl border text-left transition cursor-pointer ${
      isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
    }`;
    div.onclick = () => {
      currentBookingState.centre = centre;
      renderBookSlotWizard();
    };
    div.innerHTML = `
      <div class="font-bold text-slate-900 text-xs">${centre.name}</div>
      <div class="text-[10px] text-slate-500 mt-0.5">${centre.district} • Active Token #${state.currentServingToken}</div>
    `;
    centreCont.appendChild(div);
  });

  const slotCont = document.getElementById('booking-slots-container');
  slotCont.innerHTML = '';
  const slotsList = [
    { time: '09:00 - 10:00 AM', available: 3, full: false },
    { time: '10:00 - 11:00 AM', available: 6, full: false },
    { time: '11:00 - 12:00 PM', available: 14, full: false, rec: true },
    { time: '12:00 - 01:00 PM', available: 11, full: false },
    { time: '02:00 - 03:00 PM', available: 18, full: false }
  ];

  slotsList.forEach(s => {
    const isSelected = currentBookingState.slotTime === s.time;
    const div = document.createElement('div');
    div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
      isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
    }`;
    div.onclick = () => {
      currentBookingState.slotTime = s.time;
      renderBookSlotWizard();
    };
    div.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-900 text-xs">${s.time}</span>
        <span class="text-[10px] text-emerald-700 font-semibold">${s.available} left</span>
      </div>
      ${s.rec ? '<span class="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Fastest Turnaround</span>' : ''}
    `;
    slotCont.appendChild(div);
  });

  // Summary box
  document.getElementById('summary-crop').textContent = currentBookingState.crop.name;
  document.getElementById('summary-qty').textContent = `${currentBookingState.qty} Quintals`;
  document.getElementById('summary-msp').textContent = `₹${currentBookingState.crop.msp}/Qtl`;
  const payout = currentBookingState.qty * currentBookingState.crop.msp;
  document.getElementById('summary-payout').textContent = `₹${payout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function updateBookingQty(val) {
  currentBookingState.qty = parseFloat(val);
  document.getElementById('book-qty-display').textContent = `${val} Qtl`;
  renderBookSlotWizard();
}

function confirmSlotBooking(recommendedSlot) {
  if (recommendedSlot) currentBookingState.slotTime = recommendedSlot;
  
  const maxToken = state.bookings.reduce((max, b) => Math.max(max, b.tokenNumber), 24);
  const nextToken = maxToken + 1;
  const bookingNum = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    id: Date.now(),
    bookingNumber: bookingNum,
    tokenNumber: nextToken,
    farmerName: 'Ramesh Kumar',
    farmerId: 'FARM1001',
    phone: '9876543210',
    village: 'Minapur',
    crop: currentBookingState.crop.name,
    msp: currentBookingState.crop.msp,
    expectedQty: currentBookingState.qty,
    status: 'booked',
    date: 'Today',
    slotTime: currentBookingState.slotTime,
    centreId: currentBookingState.centre.id
  };

  state.bookings.push(newBooking);
  state.notifications.unshift({
    id: Date.now(),
    title: 'Slot Booking Confirmed!',
    message: `Your booking (${bookingNum}) for ${currentBookingState.qty} Qtl ${currentBookingState.crop.name} is confirmed. Token #${nextToken}.`,
    time: 'Just now',
    type: 'success',
    read: false
  });

  stateMgr.save();

  // Confetti fireworks!
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  openPassModal(bookingNum);
}

// ==========================================
// 3. LIVE QUEUE VISUALIZER
// ==========================================
function renderLiveQueue() {
  const currentToken = state.currentServingToken;
  document.getElementById('live-big-serving').textContent = `#${currentToken}`;
  document.getElementById('live-big-next').textContent = `#${currentToken + 1}`;

  const servingBooking = state.bookings.find(b => b.tokenNumber === currentToken);
  if (servingBooking) {
    document.getElementById('live-serving-farmer').textContent = servingBooking.farmerName;
    document.getElementById('live-serving-crop').textContent = `${servingBooking.crop} • ${servingBooking.expectedQty} Qtl`;
  }

  const nextBooking = state.bookings.find(b => b.tokenNumber === currentToken + 1);
  if (nextBooking) {
    document.getElementById('live-next-farmer').textContent = nextBooking.farmerName;
  }

  const ahead = Math.max(0, 23 - currentToken);
  document.getElementById('live-pos-ahead').textContent = ahead;
  document.getElementById('live-pos-wait').textContent = `~${Math.round(ahead * 5.5)} mins`;

  // Horizontal sequence track
  const strip = document.getElementById('queue-strip-container');
  strip.innerHTML = '';

  // Current Serving
  const activeDiv = document.createElement('div');
  activeDiv.className = 'flex-shrink-0 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold font-mono text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20';
  activeDiv.innerHTML = `<span>#${currentToken}</span><span class="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded uppercase">Serving</span>`;
  strip.appendChild(activeDiv);

  // Upcoming
  const waitingBookings = state.bookings.filter(b => b.tokenNumber > currentToken);
  waitingBookings.slice(0, 8).forEach(b => {
    const isRamesh = b.tokenNumber === 23;
    const div = document.createElement('div');
    div.className = `flex-shrink-0 px-4 py-2.5 rounded-xl border transition ${
      isRamesh ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 shadow-md font-bold' : 'bg-slate-800 text-slate-200 border-slate-700'
    }`;
    div.innerHTML = `
      <div class="font-mono text-xs flex items-center space-x-1.5">
        <span>#${b.tokenNumber}</span>
        ${isRamesh ? '<span class="text-[10px] bg-white text-emerald-900 px-1 rounded font-bold">YOU</span>' : ''}
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[80px]">${b.farmerName}</div>
    `;
    strip.appendChild(div);
  });

  // Table Roster
  const rosterBody = document.getElementById('queue-roster-body');
  rosterBody.innerHTML = '';
  waitingBookings.forEach((b, idx) => {
    const isRamesh = b.tokenNumber === 23;
    const tr = document.createElement('tr');
    tr.className = isRamesh ? 'bg-emerald-50/70 font-bold' : 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3 font-mono font-bold text-emerald-800">#${b.tokenNumber} ${isRamesh ? '(Your Token)' : ''}</td>
      <td class="py-3 text-slate-900">${b.farmerName}</td>
      <td class="py-3 text-slate-600">${b.village}</td>
      <td class="py-3 text-slate-800">${b.crop}</td>
      <td class="py-3 font-mono text-slate-800">${b.expectedQty} Qtl</td>
      <td class="py-3 text-slate-600">${idx + 1} in line</td>
      <td class="py-3 text-amber-700 font-mono">~${Math.round((idx + 1) * 5.5)} mins</td>
    `;
    rosterBody.appendChild(tr);
  });
}

function changeQueueCentre(val) {
  renderLiveQueue();
}

// ==========================================
// 4. OFFICER DESK ACTIONS
// ==========================================
function renderOfficerDesk() {
  const currentToken = state.currentServingToken;
  document.getElementById('officer-current-token').textContent = `#${currentToken}`;
  document.getElementById('officer-next-token').textContent = `#${currentToken + 1}`;

  const currentBooking = state.bookings.find(b => b.tokenNumber === currentToken);
  if (currentBooking) {
    document.getElementById('officer-farmer-name').textContent = `${currentBooking.farmerName} (${currentBooking.farmerId})`;
    document.getElementById('officer-crop-info').textContent = `${currentBooking.crop} • ${currentBooking.expectedQty} Qtl`;
  }

  const nextBooking = state.bookings.find(b => b.tokenNumber === currentToken + 1);
  if (nextBooking) {
    document.getElementById('officer-next-name').textContent = nextBooking.farmerName;
  }

  // Waiting Table
  const table = document.getElementById('officer-waiting-table');
  table.innerHTML = '';
  const waiting = state.bookings.filter(b => b.tokenNumber > currentToken);
  waiting.forEach(b => {
    const isRamesh = b.tokenNumber === 23;
    const tr = document.createElement('tr');
    tr.className = isRamesh ? 'bg-amber-50/70 font-bold' : 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3 font-mono font-bold text-amber-900">#${b.tokenNumber}</td>
      <td class="py-3 text-slate-900">${b.farmerName}</td>
      <td class="py-3 text-slate-800">${b.crop}</td>
      <td class="py-3 font-mono text-slate-800">${b.expectedQty} Qtl</td>
      <td class="py-3 text-right">
        <button onclick="officerCallSpecificToken(${b.tokenNumber})" class="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition">
          Call Token #${b.tokenNumber}
        </button>
      </td>
    `;
    table.appendChild(tr);
  });

  document.getElementById('officer-served-count').textContent = currentToken - 1;
  document.getElementById('officer-total-qtl').textContent = `${((currentToken - 1) * 39.5).toFixed(1)} Qtl`;
}

function officerCallNext() {
  state.currentServingToken += 1;
  handleTurnNotifications();
  stateMgr.save();
  renderOfficerDesk();
  renderFarmerDashboard();
  renderLiveQueue();
}

function officerCallSpecificToken(token) {
  state.currentServingToken = token;
  handleTurnNotifications();
  stateMgr.save();
  renderOfficerDesk();
  renderFarmerDashboard();
  renderLiveQueue();
}

function handleTurnNotifications() {
  const current = state.currentServingToken;
  if (current === 23) {
    showFloatingAlert('📢 YOUR TOKEN IS CALLED!', 'Token #23 (Ramesh Kumar) is now being weighed at Desk 1. Please step onto the weighbridge.');
  } else if (23 - current > 0 && 23 - current <= 3) {
    showFloatingAlert('⏳ YOUR TURN IS APPROACHING!', `Current Token is #${current}. You are Token #23 (${23 - current} farmer${23 - current > 1 ? 's' : ''} ahead). Please proceed to Mandi Gate.`);
  }
}

function showFloatingAlert(title, msg) {
  const el = document.getElementById('floating-alert');
  document.getElementById('alert-title').textContent = title;
  document.getElementById('alert-message').textContent = msg;
  el.classList.remove('hidden');
}

function dismissAlert() {
  document.getElementById('floating-alert').classList.add('hidden');
}

// ==========================================
// 5. WEIGHMENT & QUALITY VERIFICATION
// ==========================================
function openWeighModal() {
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[state.bookings.length - 1];

  document.getElementById('weigh-header-info').textContent = `Token #${booking.tokenNumber} • ${booking.farmerName} (${booking.farmerId})`;
  document.getElementById('weigh-crop-name').textContent = booking.crop;
  document.getElementById('weigh-msp-rate').textContent = `₹${booking.msp}/Qtl`;
  document.getElementById('weigh-actual-qty').value = booking.expectedQty - 0.5;

  calculateWeighPayout();
  document.getElementById('modal-weighment').classList.remove('hidden');
  lucide.createIcons();
}

function closeWeighModal() {
  document.getElementById('modal-weighment').classList.add('hidden');
}

function calculateWeighPayout() {
  const qty = parseFloat(document.getElementById('weigh-actual-qty').value) || 0;
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[0];
  const msp = booking.msp || 2425;

  const total = qty * msp;
  document.getElementById('weigh-payout-formula').textContent = `${qty} Qtl × ₹${msp}/Qtl`;
  document.getElementById('weigh-payout-total').textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function submitWeighment(e) {
  e.preventDefault();
  const qty = parseFloat(document.getElementById('weigh-actual-qty').value);
  const grade = document.getElementById('weigh-quality-grade').value;
  const moisture = parseFloat(document.getElementById('weigh-moisture').value);
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[0];
  const msp = booking.msp || 2425;
  const total = qty * msp;
  const txnId = `TXN-2026-MUZ-${8000 + currentToken}`;

  state.procurements.unshift({
    id: Date.now(),
    bookingNumber: booking.bookingNumber,
    farmerName: booking.farmerName,
    tokenNumber: currentToken,
    crop: booking.crop,
    actualQty: qty,
    grade,
    moisture,
    amount: total,
    txnId,
    status: 'processing',
    date: 'Just now'
  });

  state.payments.unshift({
    id: Date.now(),
    txnId,
    farmerName: booking.farmerName,
    farmerCode: booking.farmerId,
    bankMask: 'SBI-XXXX-4589',
    crop: booking.crop,
    qty,
    msp,
    amount: total,
    status: 'processing',
    date: 'Today'
  });

  state.notifications.unshift({
    id: Date.now(),
    title: '🌾 Procurement Verified & Payment Initiated!',
    message: `Crop weighment of ${qty} Qtl (${booking.crop}) verified at ₹${msp}/Qtl. Payout of ₹${total.toLocaleString('en-IN')} initiated (Txn ID: ${txnId}).`,
    time: 'Just now',
    type: 'success',
    read: false
  });

  stateMgr.save();
  closeWeighModal();
  showFloatingAlert('🌾 Procurement Verified!', `Payout of ₹${total.toLocaleString('en-IN')} initiated for ${booking.farmerName}.`);
  renderNotifications();
  renderProcurementStatus();
}

// ==========================================
// 6. PROCUREMENT STATUS & CERTIFICATE
// ==========================================
function renderProcurementStatus() {
  const list = document.getElementById('procurements-list');
  list.innerHTML = '';

  state.bookings.forEach(b => {
    const isCompleted = b.tokenNumber <= state.currentServingToken;
    const div = document.createElement('div');
    div.className = 'p-4 rounded-2xl border bg-white shadow-sm space-y-1 cursor-pointer hover:border-emerald-500 transition';
    div.onclick = () => renderProcurementDetail(b);
    div.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono font-bold text-emerald-900 text-xs">Token #${b.tokenNumber}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
          ${isCompleted ? 'COMPLETED' : 'SCHEDULED'}
        </span>
      </div>
      <div class="font-bold text-slate-800 text-xs">${b.crop} (${b.expectedQty} Qtl)</div>
      <div class="text-[11px] text-slate-500">${b.farmerName} • Muzaffarpur Mandi</div>
    `;
    list.appendChild(div);
  });

  renderProcurementDetail(state.bookings[state.bookings.length - 2] || state.bookings[0]);
}

function renderProcurementDetail(b) {
  const isCompleted = b.tokenNumber <= state.currentServingToken;
  const card = document.getElementById('procurement-detail-card');

  const steps = [
    { label: 'Slot Booked & Token Allocated', date: 'Today', done: true },
    { label: 'Farmer Arrived & Verified at Gate', date: 'Today', done: isCompleted },
    { label: 'Crop Weighed & Moisture Graded', extra: isCompleted ? `${b.expectedQty - 0.5} Qtl (Grade A • 11.8% Moisture)` : null, done: isCompleted },
    { label: 'Procurement Verified by Officer', done: isCompleted },
    { label: 'Payment Initiated (DBT)', extra: isCompleted ? `₹${((b.expectedQty - 0.5) * b.msp).toLocaleString('en-IN')}` : null, done: isCompleted },
    { label: 'Payment Disbursed to Bank Account', extra: isCompleted ? `Txn ID: TXN-2026-MUZ-${8000 + b.tokenNumber}` : 'In Processing', done: isCompleted }
  ];

  let stepsHtml = steps.map(s => `
    <div class="relative pl-6">
      <span class="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${s.done ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'}">
        ${s.done ? '✓' : ''}
      </span>
      <div class="text-xs">
        <div class="font-bold text-slate-900">${s.label}</div>
        ${s.extra ? `<div class="text-[11px] text-emerald-700 font-semibold mt-0.5">${s.extra}</div>` : ''}
      </div>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Booking Reference</span>
        <h2 class="text-xl font-bold text-slate-900 mt-0.5">${b.bookingNumber}</h2>
        <p class="text-xs text-slate-500 mt-0.5">Farmer: <strong class="text-slate-800">${b.farmerName}</strong> • Token #${b.tokenNumber}</p>
      </div>
      <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition">
        <i data-lucide="printer" class="w-3.5 h-3.5 text-emerald-400"></i>
        <span>Print Certificate</span>
      </button>
    </div>

    <div>
      <h3 class="font-bold text-slate-900 text-sm mb-4">Step-by-Step Procurement Timeline</h3>
      <div class="relative border-l-2 border-emerald-500 ml-4 space-y-6 pb-2">
        ${stepsHtml}
      </div>
    </div>
  `;

  lucide.createIcons();
}

// ==========================================
// 7. PAYMENT LEDGER
// ==========================================
function renderPaymentLedger() {
  const tbody = document.getElementById('payment-ledger-body');
  tbody.innerHTML = '';

  state.payments.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3 font-mono font-bold text-slate-900">${p.txnId}</td>
      <td class="py-3 text-slate-800">${p.crop}</td>
      <td class="py-3 font-mono text-slate-800">${p.qty} Qtl</td>
      <td class="py-3 font-mono text-slate-600">₹${p.msp}/Qtl</td>
      <td class="py-3 font-mono font-bold text-emerald-700">₹${p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td class="py-3">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
          ${p.status === 'paid' ? '✓ PAID (DBT)' : '⏳ PROCESSING'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 8. ADMIN & GOVT ANALYTICS
// ==========================================
function renderAdminAnalytics() {
  // Chart.js Trends
  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  if (trendCtx) {
    if (trendChartInstance) trendChartInstance.destroy();
    trendChartInstance = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['26 Aug', '27 Aug', '28 Aug', '29 Aug', '30 Aug', '31 Aug', 'Today'],
        datasets: [{
          label: 'Procured Volume (Quintals)',
          data: [850, 1120, 940, 1350, 1210, 1480, 1250],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  // Chart.js Crop Pie
  const pieCtx = document.getElementById('cropPieChart')?.getContext('2d');
  if (pieCtx) {
    if (cropPieChartInstance) cropPieChartInstance.destroy();
    cropPieChartInstance = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wheat', 'Paddy', 'Mustard', 'Gram'],
        datasets: [{
          data: [62, 24, 8, 6],
          backgroundColor: ['#16a34a', '#eab308', '#f97316', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Admin DBT table
  const dbtBody = document.getElementById('admin-dbt-table');
  dbtBody.innerHTML = '';
  state.payments.forEach(p => {
    const isProcessing = p.status === 'processing';
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3 font-mono font-bold text-slate-900">${p.txnId}</td>
      <td class="py-3 font-bold text-slate-900">${p.farmerName} (${p.farmerCode})</td>
      <td class="py-3 text-slate-600 font-mono">${p.bankMask}</td>
      <td class="py-3 text-slate-800">${p.crop} • ${p.qty} Qtl</td>
      <td class="py-3 font-mono font-black text-emerald-700">₹${p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td class="py-3 text-right">
        ${isProcessing ? `
          <button onclick="disbursePayment('${p.txnId}')" class="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition">
            ⚡ Disburse (DBT)
          </button>
        ` : `
          <span class="text-xs font-bold text-emerald-700">✓ DISBURSED</span>
        `}
      </td>
    `;
    dbtBody.appendChild(tr);
  });
}

function disbursePayment(txnId) {
  const p = state.payments.find(item => item.txnId === txnId);
  if (p) {
    p.status = 'paid';
    state.notifications.unshift({
      id: Date.now(),
      title: '💰 DBT Payment Credited!',
      message: `₹${p.amount.toLocaleString('en-IN')} has been cleared by State Treasury into bank ${p.bankMask} (Txn: ${p.txnId}).`,
      time: 'Just now',
      type: 'success',
      read: false
    });
    stateMgr.save();
    renderAdminAnalytics();
    renderNotifications();
    showFloatingAlert('💰 Payment Disbursed!', `₹${p.amount.toLocaleString('en-IN')} transferred to ${p.farmerName}.`);
  }
}

// ==========================================
// 9. DIGITAL PASS & MODALS
// ==========================================
function openPassModal(bookingNumber) {
  const booking = state.bookings.find(b => b.bookingNumber === bookingNumber) || state.bookings[state.bookings.length - 2];
  document.getElementById('pass-token-num').textContent = `#${booking.tokenNumber}`;
  document.getElementById('pass-booking-id').textContent = booking.bookingNumber;
  document.getElementById('pass-farmer-name').textContent = `${booking.farmerName} (${booking.farmerId})`;
  document.getElementById('pass-crop-name').textContent = `${booking.crop} (${booking.expectedQty} Quintals)`;
  document.getElementById('pass-msp-rate').textContent = `₹${booking.msp} / Quintal`;

  document.getElementById('modal-digital-pass').classList.remove('hidden');
  lucide.createIcons();
}

function closePassModal() {
  document.getElementById('modal-digital-pass').classList.add('hidden');
}

// ==========================================
// 10. NOTIFICATIONS DRAWER
// ==========================================
function toggleNotificationDrawer() {
  const drawer = document.getElementById('drawer-notifications');
  drawer.classList.toggle('hidden');
}

function renderNotifications() {
  const list = document.getElementById('notif-drawer-list');
  list.innerHTML = '';

  const unreadCount = state.notifications.filter(n => !n.read).length;
  document.getElementById('notif-badge').textContent = unreadCount;
  if (unreadCount === 0) document.getElementById('notif-badge').classList.add('hidden');
  else document.getElementById('notif-badge').classList.remove('hidden');

  state.notifications.forEach(n => {
    const div = document.createElement('div');
    div.className = `p-3 hover:bg-slate-50 transition ${n.read ? 'opacity-70' : 'bg-emerald-50/40'}`;
    div.innerHTML = `
      <div class="font-bold text-slate-800">${n.title}</div>
      <div class="text-slate-600 mt-0.5 leading-relaxed">${n.message}</div>
      <div class="text-[10px] text-slate-400 mt-1">${n.time}</div>
    `;
    list.appendChild(div);
  });
}

function markAllNotificationsRead() {
  state.notifications.forEach(n => n.read = true);
  stateMgr.save();
  renderNotifications();
}

// Startup
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
