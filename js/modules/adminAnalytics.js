/**
 * =========================================================
 * MODULE: STATE DIRECTORATE ANALYTICS (js/modules/adminAnalytics.js)
 * Macro KPIs, Chart.js visualizations & Treasury DBT clearance desk
 * =========================================================
 */

import { store } from '../config/state.js';
import { renderNotifications, showFloatingAlert } from './notifications.js';

let trendChartInstance = null;
let cropPieChartInstance = null;

export function renderAdminAnalytics() {
  const state = store.getState();

  // 1. Chart.js Daily Procurement Volume Line Chart
  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  if (trendCtx && window.Chart) {
    if (trendChartInstance) trendChartInstance.destroy();
    trendChartInstance = new window.Chart(trendCtx, {
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

  // 2. Chart.js Crop Share Donut Chart
  const pieCtx = document.getElementById('cropPieChart')?.getContext('2d');
  if (pieCtx && window.Chart) {
    if (cropPieChartInstance) cropPieChartInstance.destroy();
    cropPieChartInstance = new window.Chart(pieCtx, {
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

  // 3. Admin DBT Action Table
  const dbtBody = document.getElementById('admin-dbt-table');
  if (dbtBody) {
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
}

export function disbursePayment(txnId) {
  const state = store.getState();
  const p = state.payments.find(item => item.txnId === txnId);
  if (p) {
    store.update(st => {
      const target = st.payments.find(item => item.txnId === txnId);
      if (target) target.status = 'paid';
      st.notifications.unshift({
        id: Date.now(),
        title: '💰 DBT Payment Credited!',
        message: `₹${p.amount.toLocaleString('en-IN')} has been cleared by State Treasury into bank ${p.bankMask} (Txn: ${p.txnId}).`,
        time: 'Just now',
        type: 'success',
        read: false
      });
    });

    renderAdminAnalytics();
    renderNotifications();
    showFloatingAlert('💰 Payment Disbursed!', `₹${p.amount.toLocaleString('en-IN')} transferred to ${p.farmerName}.`);
  }
}
