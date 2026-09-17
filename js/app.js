/**
 * =========================================================
 * CORE APP BOOTSTRAPPER (js/app.js)
 * Master Module Integrator & Global Window Event Dispatcher
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

let activeRole = 'farmer';
let currentTab = 'farmer-dashboard';

export function switchRole(role) {
  activeRole = role;
  const user = AuthService.loginAsPersona(role);
  updateNavbarProfile(user);

  if (role === 'farmer') currentTab = 'farmer-dashboard';
  else if (role === 'officer') currentTab = 'officer-desk';
  else if (role === 'admin') currentTab = 'admin-analytics';

  updateRoleButtons();
  switchTab(currentTab);
}

export function switchTab(tabId) {
  currentTab = tabId;

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

  // Show target section
  const target = document.getElementById(`view-${tabId}`);
  if (target) target.classList.remove('hidden');

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

function updateRoleButtons() {
  const roles = ['farmer', 'officer', 'admin'];
  roles.forEach(r => {
    const btn = document.getElementById(`role-btn-${r}`);
    if (btn) {
      if (activeRole === r) {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-800 text-emerald-100 border border-emerald-600 transition flex items-center space-x-1';
      } else {
        btn.className = 'px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition flex items-center space-x-1';
      }
    }
  });
}

// Notifications toggle
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

window.addEventListener('DOMContentLoaded', () => {
  const user = AuthService.getCurrentUser();
  updateNavbarProfile(user);
  applyTranslations();
  switchRole('farmer');
  if (window.lucide) window.lucide.createIcons();
});
