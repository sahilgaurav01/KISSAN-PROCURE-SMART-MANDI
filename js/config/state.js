/**
 * =========================================================
 * CONFIG MODULE: CENTRALIZED STATE STORE (js/config/state.js)
 * Manages reactive application state with LocalStorage sync
 * =========================================================
 */

import { MOCK_CENTRES, MOCK_CROPS, MOCK_BOOKINGS, MOCK_PAYMENTS, MOCK_NOTIFICATIONS } from '../data/mockData.js';

const STORAGE_KEY = 'kisanprocure_modular_state';

class StateStore {
  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = this.getDefaultState();
      }
    } else {
      this.state = this.getDefaultState();
    }
  }

  getDefaultState() {
    return {
      activeRole: 'farmer', // 'farmer', 'officer', 'admin'
      lang: 'en', // 'en', 'hi'
      currentTab: 'farmer-dashboard',
      currentServingToken: 18,
      centres: MOCK_CENTRES,
      crops: MOCK_CROPS,
      bookings: MOCK_BOOKINGS,
      payments: MOCK_PAYMENTS,
      notifications: MOCK_NOTIFICATIONS
    };
  }

  getState() {
    return this.state;
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  update(fn) {
    fn(this.state);
    this.save();
  }

  reset() {
    this.state = this.getDefaultState();
    this.save();
  }
}

export const store = new StateStore();
