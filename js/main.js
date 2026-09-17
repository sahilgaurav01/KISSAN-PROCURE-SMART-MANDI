/**
 * =========================================================
 * MAIN ORCHESTRATOR MODULE (js/main.js)
 * Initializes modular application, coordinates tab routing & exports globals
 * =========================================================
 */

import { store } from './config/state.js';
import { I18N_DICTIONARY } from './config/i18n.js';
import { renderNotifications, toggleNotificationDrawer, markAllNotificationsRead, dismissAlert, showFloatingAlert } from './modules/notifications.js';
import { renderFarmerDashboard } from './modules/farmerDashboard.js';
import { renderBookSlotWizard, updateBookingQuantity, confirmSlotBooking, openPassModal, closePassModal } from './modules/slotBooking.js';
import { renderLiveQueue } from './modules/liveQueue.js';
import { renderOfficerDesk, officerCallNext, officerCallSpecificToken } from './modules/officerDesk.js';
import { openWeighModal, closeWeighModal, submitWeighment, calculateWeighPayout } from './modules/weighmentInspection.js';
import { renderProcurementStatus } from './modules/procurementStatus.js';
import { renderPaymentLedger } from './modules/paymentLedger.js';
import { renderAdminAnalytics, disbursePayment } from './modules/adminAnalytics.js';

// ==========================================
// EXPORT FUNCTIONS TO GLOBAL WINDOW SCOPE
// ==========================================
window.switchRole = switchRole;
window.switchTab = switchTab;
window.toggleLanguage = toggleLanguage;
window.toggleNotificationDrawer = toggleNotificationDrawer;
window.markAllNotificationsRead = markAllNotificationsRead;
window.dismissAlert = dismissAlert;
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
window.changeQueueCentre = () => renderLiveQueue();
window.disbursePayment = disbursePayment;

export function initApp() {
  renderNavbar();
  renderRolePills();
  applyLanguage();
  renderNotifications();
  switchTab(store.getState().currentTab);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function switchRole(role) {
  store.update(state => {
    state.activeRole = role;
    if (role === 'farmer') state.currentTab = 'farmer-dashboard';
    else if (role === 'officer') state.currentTab = 'officer-desk';
    else if (role === 'admin') state.currentTab = 'admin-analytics';
  });

  renderRolePills();
  renderNavbar();
  switchTab(store.getState().currentTab);
}

export function switchTab(tabId) {
  store.update(state => {
    state.currentTab = tabId;
  });

  renderNavbar();

  // Hide all view sections
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

  // Show active view section
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Trigger module-specific renderers
  if (tabId === 'farmer-dashboard') renderFarmerDashboard();
  if (tabId === 'book-slot') renderBookSlotWizard();
  if (tabId === 'live-queue') renderLiveQueue();
  if (tabId === 'procurement-status') renderProcurementStatus();
  if (tabId === 'payments') renderPaymentLedger();
  if (tabId === 'officer-desk') renderOfficerDesk();
  if (tabId === 'admin-analytics') renderAdminAnalytics();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function toggleLanguage() {
  store.update(state => {
    state.lang = state.lang === 'en' ? 'hi' : 'en';
  });
  applyLanguage();
}

function applyLanguage() {
  const state = store.getState();
  const dict = I18N_DICTIONARY[state.lang] || I18N_DICTIONARY.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  const langBtnText = document.getElementById('lang-btn-text');
  if (langBtnText) {
    langBtnText.textContent = state.lang === 'en' ? 'हिन्दी' : 'English';
  }
}

function renderRolePills() {
  const state = store.getState();
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
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'R';
    }
    if (name) name.textContent = 'Ramesh Kumar';
    if (label) label.textContent = 'ID: FARM1001 • Farmer';
  } else if (state.activeRole === 'officer') {
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'R';
    }
    if (name) name.textContent = 'Rajesh Sharma';
    if (label) label.textContent = 'Inspector • Mandi Desk 1';
  } else {
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'S';
    }
    if (name) name.textContent = 'Dr. Sanjay Meena';
    if (label) label.textContent = 'Director of Procurement';
  }
}

function renderNavbar() {
  const state = store.getState();
  const nav = document.getElementById('nav-links');
  if (!nav) return;
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

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Bootstrap upon DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
