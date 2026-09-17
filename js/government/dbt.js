/**
 * =========================================================
 * GOVERNMENT: DBT DISBURSEMENT DESK (js/government/dbt.js)
 * Treasury Clearance Desk & 1-Click Direct Benefit Transfer
 * =========================================================
 */

import { supabase } from '../supabase/client.js';
import { showToast } from '../components/toast.js';

export function renderDbtTable() {
  const db = supabase.getLocalDb();
  const dbtBody = document.getElementById('admin-dbt-table');
  if (!dbtBody) return;
  dbtBody.innerHTML = '';

  (db.payments || []).forEach(p => {
    const isProcessing = p.status === 'processing';
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3 font-mono font-bold text-slate-900">${p.txnId}</td>
      <td class="py-3 font-bold text-slate-900">${p.farmerName} (${p.farmerCode || 'FARM1001'})</td>
      <td class="py-3 text-slate-600 font-mono">${p.bankMask}</td>
      <td class="py-3 text-slate-800">${p.crop} • ${p.qty} Qtl</td>
      <td class="py-3 font-mono font-black text-emerald-700">₹${Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
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

export function disbursePayment(txnId) {
  const db = supabase.getLocalDb();
  const p = (db.payments || []).find(item => item.txnId === txnId);
  if (p) {
    p.status = 'paid';
    db.notifications.unshift({
      id: Date.now(),
      title: '💰 DBT Payment Credited!',
      message: `₹${Number(p.amount).toLocaleString('en-IN')} has been cleared by State Treasury into bank ${p.bankMask} (Txn: ${p.txnId}).`,
      time: 'Just now',
      type: 'success',
      read: false
    });
    supabase.saveLocalDb(db);

    renderDbtTable();
    showToast('💰 Payment Disbursed!', `₹${Number(p.amount).toLocaleString('en-IN')} transferred to ${p.farmerName}.`);
  }
}
