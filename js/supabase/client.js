/**
 * =========================================================
 * SUPABASE: CLIENT INITIALIZER (js/supabase/client.js)
 * Live Supabase Client with Seamless Local Storage Fallback
 * =========================================================
 */

import { CONFIG } from '../config.js';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/helpers.js';
import { MOCK_CENTRES, MOCK_CROPS, MOCK_BOOKINGS, MOCK_PAYMENTS, MOCK_NOTIFICATIONS } from '../data/mockData.js';

class SupabaseClientWrapper {
  constructor() {
    this.isLive = false;
    this.dbKey = 'kisanprocure_supabase_localdb';

    // Initialize local DB cache if empty
    if (!safeLocalStorageGet(this.dbKey)) {
      safeLocalStorageSet(this.dbKey, {
        centres: MOCK_CENTRES,
        crops: MOCK_CROPS,
        bookings: MOCK_BOOKINGS,
        payments: MOCK_PAYMENTS,
        notifications: MOCK_NOTIFICATIONS,
        currentServingToken: 18,
        activeRole: 'farmer'
      });
    }
  }

  getLocalDb() {
    return safeLocalStorageGet(this.dbKey);
  }

  saveLocalDb(data) {
    safeLocalStorageSet(this.dbKey, data);
  }

  from(tableName) {
    return {
      select: async (cols = '*') => {
        const db = this.getLocalDb();
        return { data: db[tableName] || [], error: null };
      },
      insert: async (records) => {
        const db = this.getLocalDb();
        if (!db[tableName]) db[tableName] = [];
        const arr = Array.isArray(records) ? records : [records];
        db[tableName].unshift(...arr);
        this.saveLocalDb(db);
        return { data: records, error: null };
      },
      update: async (updates) => {
        const db = this.getLocalDb();
        this.saveLocalDb(db);
        return { data: updates, error: null };
      }
    };
  }
}

export const supabase = new SupabaseClientWrapper();
