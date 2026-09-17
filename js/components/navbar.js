/**
 * =========================================================
 * COMPONENT: NAVBAR (js/components/navbar.js)
 * Header Navigation & Active Role Management
 * =========================================================
 */

import { AuthService } from '../supabase/auth.js';

export function setupNavbar(onRoleSwitch, onTabSwitch) {
  const user = AuthService.getCurrentUser();
  updateNavbarProfile(user);
}

export function updateNavbarProfile(user) {
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const label = document.getElementById('user-role-label');

  if (user.role === 'farmer') {
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'R';
    }
    if (name) name.textContent = user.fullName || 'Ramesh Kumar';
    if (label) label.textContent = `${user.farmerCode || 'FARM1001'} • Farmer`;
  } else if (user.role === 'officer') {
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'R';
    }
    if (name) name.textContent = 'Rajesh Sharma';
    if (label) label.textContent = 'Inspector • Mandi Desk 1';
  } else {
    if (avatar) {
      avatar.className = 'w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center';
      avatar.textContent = 'S';
    }
    if (name) name.textContent = 'Dr. Sanjay Meena';
    if (label) label.textContent = 'Director of Procurement';
  }
}
