/**
 * =========================================================
 * UTILS: GENERAL HELPER FUNCTIONS (js/utils/helpers.js)
 * LocalStorage wrappers, ID generators & Confetti triggers
 * =========================================================
 */

export function triggerConfetti() {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

export function generateId(prefix = 'ID') {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateBookingNumber() {
  return `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateTxnReference(centreCode = 'MUZ') {
  return `TXN-2026-${centreCode}-${Math.floor(8000 + Math.random() * 1999)}`;
}

export function safeLocalStorageGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write error', e);
  }
}
