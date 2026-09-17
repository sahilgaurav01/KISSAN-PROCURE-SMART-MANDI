/**
 * =========================================================
 * OFFICER: QUEUE CONTROL (js/officer/queue-control.js)
 * Token Call Engine & Targeted Proximity Alerts
 * =========================================================
 */

import { supabase } from '../supabase/client.js';
import { showToast } from '../components/toast.js';

export function renderOfficerQueueControl() {
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;

  const currentTokenEl = document.getElementById('officer-current-token');
  const nextTokenEl = document.getElementById('officer-next-token');
  if (currentTokenEl) currentTokenEl.textContent = `#${currentToken}`;
  if (nextTokenEl) nextTokenEl.textContent = `#${currentToken + 1}`;

  const currentBooking = db.bookings.find(b => b.tokenNumber === currentToken);
  if (currentBooking) {
    const fName = document.getElementById('officer-farmer-name');
    const cInfo = document.getElementById('officer-crop-info');
    if (fName) fName.textContent = `${currentBooking.farmerName} (${currentBooking.farmerId})`;
    if (cInfo) cInfo.textContent = `${currentBooking.crop} • ${currentBooking.expectedQty} Qtl`;
  }

  const nextBooking = db.bookings.find(b => b.tokenNumber === currentToken + 1);
  if (nextBooking) {
    const nName = document.getElementById('officer-next-name');
    if (nName) nName.textContent = nextBooking.farmerName;
  }

  // Waiting Table
  const table = document.getElementById('officer-waiting-table');
  if (table) {
    table.innerHTML = '';
    const waiting = db.bookings.filter(b => b.tokenNumber > currentToken);
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
  }
}

export function officerCallNext() {
  const db = supabase.getLocalDb();
  db.currentServingToken = (db.currentServingToken || 18) + 1;
  supabase.saveLocalDb(db);

  checkTurnProximityAlerts(db.currentServingToken);
  renderOfficerQueueControl();
}

export function officerCallSpecificToken(token) {
  const db = supabase.getLocalDb();
  db.currentServingToken = token;
  supabase.saveLocalDb(db);

  checkTurnProximityAlerts(db.currentServingToken);
  renderOfficerQueueControl();
}

function checkTurnProximityAlerts(current) {
  if (current === 23) {
    showToast('📢 YOUR TOKEN IS CALLED!', 'Token #23 (Ramesh Kumar) is now being weighed at Desk 1. Please step onto the weighbridge.');
  } else if (23 - current > 0 && 23 - current <= 3) {
    showToast('⏳ YOUR TURN IS APPROACHING!', `Current Token is #${current}. You are Token #23 (${23 - current} farmer${23 - current > 1 ? 's' : ''} ahead). Please proceed to Mandi Gate.`);
  }
}
