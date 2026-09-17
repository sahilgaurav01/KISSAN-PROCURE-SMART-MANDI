/**
 * =========================================================
 * FARMER: QUEUE TRACKER MODULE (js/farmer/queue-tracker.js)
 * Real-Time Queue Progression Track & Waiting Roster
 * =========================================================
 */

import { supabase } from '../supabase/client.js';

export function renderLiveQueue() {
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;

  const servingEl = document.getElementById('live-big-serving');
  const nextEl = document.getElementById('live-big-next');
  if (servingEl) servingEl.textContent = `#${currentToken}`;
  if (nextEl) nextEl.textContent = `#${currentToken + 1}`;

  const servingBooking = db.bookings.find(b => b.tokenNumber === currentToken);
  if (servingBooking) {
    const sFarmer = document.getElementById('live-serving-farmer');
    const sCrop = document.getElementById('live-serving-crop');
    if (sFarmer) sFarmer.textContent = servingBooking.farmerName;
    if (sCrop) sCrop.textContent = `${servingBooking.crop} • ${servingBooking.expectedQty} Qtl`;
  }

  const nextBooking = db.bookings.find(b => b.tokenNumber === currentToken + 1);
  if (nextBooking) {
    const nFarmer = document.getElementById('live-next-farmer');
    if (nFarmer) nFarmer.textContent = nextBooking.farmerName;
  }

  const ahead = Math.max(0, 23 - currentToken);
  const posAhead = document.getElementById('live-pos-ahead');
  const posWait = document.getElementById('live-pos-wait');
  if (posAhead) posAhead.textContent = ahead;
  if (posWait) posWait.textContent = `~${Math.round(ahead * 5.5)} mins`;

  // Horizontal sequence strip
  const strip = document.getElementById('queue-strip-container');
  if (strip) {
    strip.innerHTML = '';
    const activeDiv = document.createElement('div');
    activeDiv.className = 'flex-shrink-0 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold font-mono text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20';
    activeDiv.innerHTML = `<span>#${currentToken}</span><span class="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded uppercase">Serving</span>`;
    strip.appendChild(activeDiv);

    const waitingBookings = db.bookings.filter(b => b.tokenNumber > currentToken);
    waitingBookings.slice(0, 8).forEach(b => {
      const isRamesh = b.tokenNumber === 23;
      const div = document.createElement('div');
      div.className = `flex-shrink-0 px-4 py-2.5 rounded-xl border transition ${
        isRamesh ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 shadow-md font-bold' : 'bg-slate-800 text-slate-200 border-slate-700'
      }`;
      div.innerHTML = `
        <div class="font-mono text-xs flex items-center space-x-1.5">
          <span>#${b.tokenNumber}</span>
          ${isRamesh ? '<span class="text-[10px] bg-white text-emerald-900 px-1 rounded font-bold">YOU</span>' : ''}
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[80px]">${b.farmerName}</div>
      `;
      strip.appendChild(div);
    });
  }

  // Roster Table
  const rosterBody = document.getElementById('queue-roster-body');
  if (rosterBody) {
    rosterBody.innerHTML = '';
    const waitingBookings = db.bookings.filter(b => b.tokenNumber > currentToken);
    waitingBookings.forEach((b, idx) => {
      const isRamesh = b.tokenNumber === 23;
      const tr = document.createElement('tr');
      tr.className = isRamesh ? 'bg-emerald-50/70 font-bold' : 'hover:bg-slate-50';
      tr.innerHTML = `
        <td class="py-3 font-mono font-bold text-emerald-800">#${b.tokenNumber} ${isRamesh ? '(Your Token)' : ''}</td>
        <td class="py-3 text-slate-900">${b.farmerName}</td>
        <td class="py-3 text-slate-600">${b.village}</td>
        <td class="py-3 text-slate-800">${b.crop}</td>
        <td class="py-3 font-mono text-slate-800">${b.expectedQty} Qtl</td>
        <td class="py-3 text-slate-600">${idx + 1} in line</td>
        <td class="py-3 text-amber-700 font-mono">~${Math.round((idx + 1) * 5.5)} mins</td>
      `;
      rosterBody.appendChild(tr);
    });
  }
}
