/**
 * =========================================================
 * OFFICER: DASHBOARD (js/officer/officer-dashboard.js)
 * Live Mandi Desk Overview & Daily Throughput Counters
 * =========================================================
 */

import { supabase } from '../supabase/client.js';

export function renderOfficerDashboard() {
  const db = supabase.getLocalDb();
  const currentToken = db.currentServingToken || 18;

  const servedCountEl = document.getElementById('officer-served-count');
  const totalQtlEl = document.getElementById('officer-total-qtl');

  if (servedCountEl) servedCountEl.textContent = currentToken - 1;
  if (totalQtlEl) totalQtlEl.textContent = `${((currentToken - 1) * 39.5).toFixed(1)} Qtl`;
}
