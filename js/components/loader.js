/**
 * =========================================================
 * COMPONENT: LOADING INDICATOR (js/components/loader.js)
 * Visual Feedback for Async Operations
 * =========================================================
 */

export function showLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.classList.remove('hidden');
}

export function hideLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.classList.add('hidden');
}
