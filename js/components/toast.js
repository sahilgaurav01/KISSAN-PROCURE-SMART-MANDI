/**
 * =========================================================
 * COMPONENT: TOAST NOTIFICATIONS (js/components/toast.js)
 * Floating Real-time Alerts & Turn Approaching Toasts
 * =========================================================
 */

export function showToast(title, message, type = 'info') {
  const alertEl = document.getElementById('floating-alert');
  if (!alertEl) return;

  const titleEl = document.getElementById('alert-title');
  const msgEl = document.getElementById('alert-message');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  alertEl.classList.remove('hidden');
}

export function hideToast() {
  const alertEl = document.getElementById('floating-alert');
  if (alertEl) alertEl.classList.add('hidden');
}
