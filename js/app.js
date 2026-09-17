/**
 * =========================================================
 * CORE APP BOOTSTRAPPER (js/app.js)
 * Master Module Integrator & Authentication Flow Controller
 * =========================================================
 */

import { supabase } from './supabase/client.js';
import { AuthService } from './supabase/auth.js';
import { toggleLanguage, applyTranslations } from './components/language.js';
import { showToast, hideToast } from './components/toast.js';
import { openModal, closeModal } from './components/modal.js';
import { updateNavbarProfile } from './components/navbar.js';

import { renderFarmerDashboard } from './farmer/farmer-dashboard.js';
import { renderBookSlotWizard, updateBookingQuantity, confirmSlotBooking, openPassModal, closePassModal } from './farmer/slot-booking.js';
import { renderLiveQueue } from './farmer/queue-tracker.js';
import { renderProcurementStatus } from './farmer/procurement-status.js';
import { renderPaymentLedger } from './farmer/payment-ledger.js';

import { renderOfficerDashboard } from './officer/officer-dashboard.js';
import { renderOfficerQueueControl, officerCallNext, officerCallSpecificToken } from './officer/queue-control.js';
import { openWeighModal, closeWeighModal, submitWeighment, calculateWeighPayout } from './officer/weighment.js';

import { renderGovernmentDashboard } from './government/government-dashboard.js';
import { renderAnalyticsCharts } from './government/analytics.js';
import { renderDbtTable, disbursePayment } from './government/dbt.js';

// Bind globals for HTML event attributes (onclick/oninput)
window.switchRole = switchRole;
window.switchTab = switchTab;
window.toggleLanguage = () => toggleLanguage();
window.dismissAlert = hideToast;
window.officerCallNext = officerCallNext;
window.officerCallSpecificToken = officerCallSpecificToken;
window.openWeighModal = openWeighModal;
window.closeWeighModal = closeWeighModal;
window.submitWeighment = submitWeighment;
window.calculateWeighPayout = calculateWeighPayout;
window.updateBookingQty = updateBookingQuantity;
window.confirmSlotBooking = confirmSlotBooking;
window.openPassModal = openPassModal;
window.closePassModal = closePassModal;
window.disbursePayment = disbursePayment;
window.changeQueueCentre = () => renderLiveQueue();

// Authentication Handlers
window.handlePersonaLogin = handlePersonaLogin;
window.handleInAppLogin = handleInAppLogin;
window.handleLogout = handleLogout;

let isOtpSent = false;

export function handlePersonaLogin(role) {
  const user = AuthService.loginAsPersona(role);
  updateNavbarProfile(user);
  updateRoleButtons(role);

  if (role === 'farmer') switchTab('farmer-dashboard');
  else if (role === 'officer') switchTab('officer-desk');
  else if (role === 'admin') switchTab('admin-analytics');

  showToast('✓ Signed In Successfully', `Welcome, ${user.fullName} (${role.toUpperCase()})`);
}

export async function handleInAppLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('inapp-login-phone').value.trim();
  const otpContainer = document.getElementById('inapp-otp-container');
  const otpInput = document.getElementById('inapp-login-otp');
  const btn = document.getElementById('inapp-login-btn');

  if (!isOtpSent) {
    if (phone.length < 10) {
      showToast('⚠️ Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span>Sending OTP...</span>';
    
    const res = await AuthService.sendOtp(phone);
    isOtpSent = true;
    btn.disabled = false;

    otpContainer.classList.remove('hidden');
    if (otpInput) otpInput.value = res.otp; // Auto-fill for convenience while allowing edits

    btn.innerHTML = '<span>Verify OTP & Sign In</span><i data-lucide="check" class="w-4 h-4"></i>';
    if (window.lucide) window.lucide.createIcons();

    showToast('📱 SMS Received on Phone', `Your KisanProcure OTP code is: ${res.otp}`);
    return;
  }

  // Verify OTP
  const enteredOtp = (otpInput?.value || '').trim();
  btn.disabled = true;
  btn.innerHTML = '<span>Verifying OTP...</span>';

  const verifyRes = await AuthService.verifyOtp(phone, enteredOtp);
  btn.disabled = false;

  if (!verifyRes.success) {
    btn.innerHTML = '<span>Verify OTP & Sign In</span><i data-lucide="check" class="w-4 h-4"></i>';
    showToast('❌ Authentication Failed', verifyRes.message || 'Incorrect OTP code.');
    return;
  }

  const user = verifyRes.session;
  updateNavbarProfile(user);
  updateRoleButtons(user.role);

  if (user.role === 'farmer') switchTab('farmer-dashboard');
  else if (user.role === 'officer') switchTab('officer-desk');
  else if (user.role === 'admin') switchTab('admin-analytics');

  showToast('✓ Login Verified', `Welcome back, ${user.fullName}!`);
}

export function handleLogout() {
  AuthService.logout();
  document.getElementById('nav-links').innerHTML = '';
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  document.getElementById('view-login')?.classList.remove('hidden');

  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const label = document.getElementById('user-role-label');
  if (avatar) avatar.textContent = '?';
  if (name) name.textContent = 'Not Signed In';
  if (label) label.textContent = 'Please log in to proceed';

  showToast('Logged Out', 'You have been signed out of KisanProcure.');
}

export function switchRole(role) {
  handlePersonaLogin(role);
}

export function switchTab(tabId) {
  // If not authenticated and trying to access a protected view, redirect to login
  if (!AuthService.isAuthenticated() && tabId !== 'login') {
    tabId = 'login';
  }

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

  // Show target section
  const target = document.getElementById(`view-${tabId}`);
  if (target) target.classList.remove('hidden');

  if (tabId !== 'login') {
    renderNavbar(AuthService.getCurrentUser()?.role || 'farmer');
  }

  // Trigger modular renderers
  if (tabId === 'farmer-dashboard') renderFarmerDashboard();
  if (tabId === 'book-slot') renderBookSlotWizard();
  if (tabId === 'live-queue') renderLiveQueue();
  if (tabId === 'procurement-status') renderProcurementStatus();
  if (tabId === 'payments') renderPaymentLedger();
  if (tabId === 'officer-desk') {
    renderOfficerDashboard();
    renderOfficerQueueControl();
  }
  if (tabId === 'admin-analytics') {
    renderGovernmentDashboard();
    renderAnalyticsCharts();
    renderDbtTable();
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderNavbar(role) {
  const nav = document.getElementById('nav-links');
  if (!nav) return;
  nav.innerHTML = '';

  let links = [];
  if (role === 'farmer') {
    links = [
      { id: 'farmer-dashboard', label: 'Dashboard', icon: 'activity' },
      { id: 'book-slot', label: 'Book Slot', icon: 'calendar' },
      { id: 'live-queue', label: 'Live Queue', icon: 'radio' },
      { id: 'procurement-status', label: 'Procurement Slips', icon: 'file-text' },
      { id: 'payments', label: 'DBT Payments', icon: 'credit-card' }
    ];
  } else if (role === 'officer') {
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
    btn.className = 'px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center space-x-1.5';
    btn.onclick = () => switchTab(l.id);
    btn.innerHTML = `<i data-lucide="${l.icon}" class="w-4 h-4"></i><span>${l.label}</span>`;
    nav.appendChild(btn);
  });

  if (window.lucide) window.lucide.createIcons();
}

function updateRoleButtons(role) {
  const roles = ['farmer', 'officer', 'admin'];
  roles.forEach(r => {
    const btn = document.getElementById(`role-btn-${r}`);
    if (btn) {
      if (role === r) {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-800 text-emerald-100 border border-emerald-600 transition flex items-center space-x-1';
      } else {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center space-x-1';
      }
    }
  });
}

// Notifications drawer toggle
window.toggleNotificationDrawer = () => {
  document.getElementById('drawer-notifications')?.classList.toggle('hidden');
};

window.markAllNotificationsRead = () => {
  const db = supabase.getLocalDb();
  (db.notifications || []).forEach(n => (n.read = true));
  supabase.saveLocalDb(db);
  const badge = document.getElementById('notif-badge');
  if (badge) badge.classList.add('hidden');
};

// Initial Startup
window.addEventListener('DOMContentLoaded', () => {
  applyTranslations();

  // Clear previous session so user starts at the login screen first!
  AuthService.logout();
  switchTab('login');

  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const label = document.getElementById('user-role-label');
  if (avatar) avatar.textContent = '?';
  if (name) name.textContent = 'Sign In';
  if (label) label.textContent = 'Select persona to proceed';

  if (window.lucide) window.lucide.createIcons();
});
