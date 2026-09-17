/**
 * =========================================================
 * MODULE: WEIGHMENT & QUALITY INSPECTION (js/modules/weighmentInspection.js)
 * Physical weighbridge readings, moisture grading & instant MSP payout
 * =========================================================
 */

import { store } from '../config/state.js';
import { renderNotifications, showFloatingAlert } from './notifications.js';
import { renderProcurementStatus } from './procurementStatus.js';

export function openWeighModal() {
  const state = store.getState();
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[state.bookings.length - 1];
  if (!booking) return;

  const headerInfo = document.getElementById('weigh-header-info');
  const cropName = document.getElementById('weigh-crop-name');
  const mspRate = document.getElementById('weigh-msp-rate');
  const actualQty = document.getElementById('weigh-actual-qty');

  if (headerInfo) headerInfo.textContent = `Token #${booking.tokenNumber} • ${booking.farmerName} (${booking.farmerId})`;
  if (cropName) cropName.textContent = booking.crop;
  if (mspRate) mspRate.textContent = `₹${booking.msp}/Qtl`;
  if (actualQty) actualQty.value = booking.expectedQty - 0.5;

  calculateWeighPayout();
  document.getElementById('modal-weighment')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closeWeighModal() {
  document.getElementById('modal-weighment')?.classList.add('hidden');
}

export function calculateWeighPayout() {
  const qtyEl = document.getElementById('weigh-actual-qty');
  const qty = parseFloat(qtyEl?.value) || 0;
  const state = store.getState();
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[0];
  const msp = booking.msp || 2425;

  const total = qty * msp;
  const formulaEl = document.getElementById('weigh-payout-formula');
  const totalEl = document.getElementById('weigh-payout-total');

  if (formulaEl) formulaEl.textContent = `${qty} Qtl × ₹${msp}/Qtl`;
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function submitWeighment(e) {
  if (e) e.preventDefault();
  const qty = parseFloat(document.getElementById('weigh-actual-qty')?.value || 39.5);
  const grade = document.getElementById('weigh-quality-grade')?.value || 'Grade A';
  const moisture = parseFloat(document.getElementById('weigh-moisture')?.value || 11.8);
  const state = store.getState();
  const currentToken = state.currentServingToken;
  const booking = state.bookings.find(b => b.tokenNumber === currentToken) || state.bookings[0];
  const msp = booking.msp || 2425;
  const total = qty * msp;
  const txnId = `TXN-2026-MUZ-${8000 + currentToken}`;

  store.update(st => {
    st.payments.unshift({
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

    st.notifications.unshift({
      id: Date.now(),
      title: '🌾 Procurement Verified & Payment Initiated!',
      message: `Crop weighment of ${qty} Qtl (${booking.crop}) verified at ₹${msp}/Qtl. Payout of ₹${total.toLocaleString('en-IN')} initiated (Txn ID: ${txnId}).`,
      time: 'Just now',
      type: 'success',
      read: false
    });
  });

  closeWeighModal();
  showFloatingAlert('🌾 Procurement Verified!', `Payout of ₹${total.toLocaleString('en-IN')} initiated for ${booking.farmerName}.`);
  renderNotifications();
  renderProcurementStatus();
}
