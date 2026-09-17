/**
 * =========================================================
 * OFFICER: WEIGHMENT & QUALITY INSPECTION (js/officer/weighment.js)
 * Physical Weighbridge Inputs, Moisture Check & Payout Computation
 * =========================================================
 */

import { supabase } from '../supabase/client.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function openWeighModal() {
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;
  const booking = db.bookings.find(b => b.tokenNumber === currentToken) || db.bookings[db.bookings.length - 1];
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
  openModal('modal-weighment');
}

export function closeWeighModal() {
  closeModal('modal-weighment');
}

export function calculateWeighPayout() {
  const qtyEl = document.getElementById('weigh-actual-qty');
  const qty = parseFloat(qtyEl?.value) || 0;
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;
  const booking = db.bookings.find(b => b.tokenNumber === currentToken) || db.bookings[0];
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
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;
  const booking = db.bookings.find(b => b.tokenNumber === currentToken) || db.bookings[0];
  const msp = booking.msp || 2425;
  const total = qty * msp;
  const txnId = `TXN-2026-MUZ-${8000 + currentToken}`;

  db.payments.unshift({
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

  db.notifications.unshift({
    id: Date.now(),
    title: '🌾 Procurement Verified & Payment Initiated!',
    message: `Crop weighment of ${qty} Qtl (${booking.crop}) verified at ₹${msp}/Qtl. Payout of ₹${total.toLocaleString('en-IN')} initiated (Txn ID: ${txnId}).`,
    time: 'Just now',
    type: 'success',
    read: false
  });

  supabase.saveLocalDb(db);
  closeWeighModal();
  showToast('🌾 Procurement Verified!', `Payout of ₹${total.toLocaleString('en-IN')} initiated for ${booking.farmerName}.`);
}
