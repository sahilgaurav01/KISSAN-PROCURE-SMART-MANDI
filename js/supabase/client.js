/**
 * =========================================================
 * SUPABASE: CLIENT INITIALIZER (js/supabase/client.js)
 * Relational 9-Table Local & Remote Store
 * =========================================================
 */

import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/helpers.js';
import { 
  MOCK_PROFILES, 
  MOCK_FARMERS, 
  MOCK_MANDIS, 
  MOCK_CROPS, 
  MOCK_SLOTS, 
  MOCK_BOOKINGS, 
  MOCK_QUEUE, 
  MOCK_PROCUREMENTS, 
  MOCK_PAYMENTS, 
  MOCK_NOTIFICATIONS 
} from '../data/mockData.js';

class SupabaseClientWrapper {
  constructor() {
    this.dbKey = 'kisanprocure_supabase_localdb_v2';

    // Initialize local relational cache
    if (!safeLocalStorageGet(this.dbKey)) {
      safeLocalStorageSet(this.dbKey, {
        profiles: MOCK_PROFILES,
        farmers: MOCK_FARMERS,
        mandis: MOCK_MANDIS,
        centres: MOCK_MANDIS, // Alias
        crops: MOCK_CROPS,
        slots: MOCK_SLOTS,
        bookings: MOCK_BOOKINGS,
        queue: MOCK_QUEUE,
        procurements: MOCK_PROCUREMENTS,
        payments: MOCK_PAYMENTS,
        notifications: MOCK_NOTIFICATIONS,
        currentServingToken: 18,
        activeRole: 'farmer'
      });
    }
  }

  getLocalDb() {
    return safeLocalStorageGet(this.dbKey) || {};
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
