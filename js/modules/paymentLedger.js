/**
 * =========================================================
 * MODULE: DBT PAYMENTS & BANK LEDGER (js/modules/paymentLedger.js)
 * Farmer payout history and Direct Benefit Transfer (DBT) records
 * =========================================================
 */

import { store } from '../config/state.js';

export function renderPaymentLedger() {
  const state = store.getState();
  const tbody = document.getElementById('payment-ledger-body');
  if (!tbody) return;
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
