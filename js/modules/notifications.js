/**
 * =========================================================
 * MODULE: REAL-TIME NOTIFICATIONS & ALERTS (js/modules/notifications.js)
 * Manages alert toasts, drawer notifications & queue proximity triggers
 * =========================================================
 */

import { store } from '../config/state.js';

export function renderNotifications() {
  const state = store.getState();
  const list = document.getElementById('notif-drawer-list');
  if (!list) return;
  list.innerHTML = '';

  const unreadCount = state.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = unreadCount;
    if (unreadCount === 0) badge.classList.add('hidden');
    else badge.classList.remove('hidden');
  }

  state.notifications.forEach(n => {
    const div = document.createElement('div');
    div.className = `p-3 hover:bg-slate-50 transition ${n.read ? 'opacity-70' : 'bg-emerald-50/40'}`;
    div.innerHTML = `
      <div class="font-bold text-slate-800">${n.title}</div>
      <div class="text-slate-600 mt-0.5 leading-relaxed">${n.message}</div>
      <div class="text-[10px] text-slate-400 mt-1">${n.time}</div>
    `;
    list.appendChild(div);
  });
}

export function toggleNotificationDrawer() {
  const drawer = document.getElementById('drawer-notifications');
  if (drawer) drawer.classList.toggle('hidden');
}

export function markAllNotificationsRead() {
  store.update(state => {
    state.notifications.forEach(n => (n.read = true));
  });
  renderNotifications();
}

export function showFloatingAlert(title, message) {
  const alertEl = document.getElementById('floating-alert');
  if (!alertEl) return;

  const titleEl = document.getElementById('alert-title');
  const msgEl = document.getElementById('alert-message');
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  alertEl.classList.remove('hidden');
}

export function dismissAlert() {
  const alertEl = document.getElementById('floating-alert');
  if (alertEl) alertEl.classList.add('hidden');
}
