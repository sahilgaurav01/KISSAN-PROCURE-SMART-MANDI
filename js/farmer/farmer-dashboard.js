/**
 * =========================================================
 * FARMER: DASHBOARD & TOKEN SPOTLIGHT (js/farmer/farmer-dashboard.js)
 * Token #23 Status, Upcoming Mandi Window & Quick Action Cards
 * =========================================================
 */

import { supabase } from '../supabase/client.js';

export function renderFarmerDashboard() {
  const db = supabase.getLocalDb();
  const liveToken = db.currentServingToken || 18;

  const liveTokenEl = document.getElementById('dash-live-token');
  if (liveTokenEl) liveTokenEl.textContent = `#${liveToken}`;

  const ahead = Math.max(0, 23 - liveToken);
  const aheadEl = document.getElementById('dash-farmers-ahead');
  const estWaitEl = document.getElementById('dash-est-wait');

  if (aheadEl) {
    aheadEl.textContent = ahead === 0 ? 'Your Turn Now!' : `${ahead} Farmers Ahead`;
  }
  if (estWaitEl) {
    estWaitEl.textContent = `~${Math.round(ahead * 5.5)} mins`;
  }
}
