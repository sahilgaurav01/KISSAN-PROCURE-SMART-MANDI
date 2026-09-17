/**
 * =========================================================
 * MODULE: FARMER DASHBOARD & TOKEN SPOTLIGHT (js/modules/farmerDashboard.js)
 * Renders upcoming slot info, live queue tracker bar & quick links
 * =========================================================
 */

import { store } from '../config/state.js';

export function renderFarmerDashboard() {
  const state = store.getState();
  const liveToken = state.currentServingToken;

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
