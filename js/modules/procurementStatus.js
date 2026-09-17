/**
 * =========================================================
 * MODULE: PROCUREMENT STATUS & LIFECYCLE TIMELINE (js/modules/procurementStatus.js)
 * 6-step lifecycle timeline and official weighment certificate
 * =========================================================
 */

import { store } from '../config/state.js';

export function renderProcurementStatus() {
  const state = store.getState();
  const list = document.getElementById('procurements-list');
  if (!list) return;
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

export function renderProcurementDetail(b) {
  if (!b) return;
  const state = store.getState();
  const isCompleted = b.tokenNumber <= state.currentServingToken;
  const card = document.getElementById('procurement-detail-card');
  if (!card) return;

  const steps = [
    { label: 'Slot Booked & Token Allocated', date: 'Today', done: true },
    { label: 'Farmer Arrived & Verified at Gate', date: 'Today', done: isCompleted },
    { label: 'Crop Weighed & Moisture Graded', extra: isCompleted ? `${b.expectedQty - 0.5} Qtl (Grade A • 11.8% Moisture)` : null, done: isCompleted },
    { label: 'Procurement Verified by Officer', done: isCompleted },
    { label: 'Payment Initiated (DBT)', extra: isCompleted ? `₹${((b.expectedQty - 0.5) * b.msp).toLocaleString('en-IN')}` : null, done: isCompleted },
    { label: 'Payment Disbursed to Bank Account', extra: isCompleted ? `Txn ID: TXN-2026-MUZ-${8000 + b.tokenNumber}` : 'In Processing', done: isCompleted }
  ];

  const stepsHtml = steps.map(s => `
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

  if (window.lucide) window.lucide.createIcons();
}
