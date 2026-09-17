/**
 * =========================================================
 * SUPABASE: AUTHENTICATION MODULE (js/supabase/auth.js)
 * User Login, Role Management & Session Persistence
 * =========================================================
 */

import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/helpers.js';

const AUTH_KEY = 'kisanprocure_auth_session';

export const AuthService = {
  getCurrentUser() {
    return safeLocalStorageGet(AUTH_KEY, {
      id: 'a0000000-0000-0000-0000-000000000001',
      fullName: 'Ramesh Kumar',
      farmerCode: 'FARM1001',
      phone: '9876543210',
      role: 'farmer',
      village: 'Minapur',
      district: 'Muzaffarpur',
      bankAccount: 'SBI-XXXX-4589'
    });
  },

  loginAsPersona(role) {
    let session = {};
    if (role === 'farmer') {
      session = {
        id: 'a0000000-0000-0000-0000-000000000001',
        fullName: 'Ramesh Kumar',
        farmerCode: 'FARM1001',
        phone: '9876543210',
        role: 'farmer',
        village: 'Minapur',
        district: 'Muzaffarpur',
        bankAccount: 'SBI-XXXX-4589'
      };
    } else if (role === 'officer') {
      session = {
        id: 'a0000000-0000-0000-0000-000000000002',
        fullName: 'Rajesh Sharma',
        farmerCode: 'OFF1001',
        phone: '9876543200',
        role: 'officer',
        village: 'Muzaffarpur',
        district: 'Muzaffarpur'
      };
    } else {
      session = {
        id: 'a0000000-0000-0000-0000-000000000003',
        fullName: 'Dr. Sanjay Meena',
        farmerCode: 'ADM1001',
        phone: '9876543201',
        role: 'admin',
        village: 'Patna',
        district: 'Patna'
      };
    }

    safeLocalStorageSet(AUTH_KEY, session);
    return session;
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  }
};
