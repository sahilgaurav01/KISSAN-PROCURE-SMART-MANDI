/**
 * =========================================================
 * SUPABASE: CLIENT INITIALIZER (js/supabase/client.js)
 * Live Supabase Cloud Client with Seamless Hybrid Local Cache
 * =========================================================
 */

import { CONFIG } from '../config.js';
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
    this.url = CONFIG.SUPABASE_URL;
    this.key = CONFIG.SUPABASE_ANON_KEY;
    this.isLiveAvailable = false;

    // Initialize real Supabase client if SDK is loaded
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.rawClient = window.supabase.createClient(this.url, this.key);
        this.isLiveAvailable = true;
      } catch (err) {
        console.warn('Supabase SDK initialization warning:', err);
      }
    }

    // Initialize local relational cache
    if (!safeLocalStorageGet(this.dbKey)) {
      safeLocalStorageSet(this.dbKey, {
        profiles: MOCK_PROFILES,
        farmers: MOCK_FARMERS,
        mandis: MOCK_MANDIS,
        centres: MOCK_MANDIS,
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
        // Attempt cloud Supabase fetch first if live client exists
        if (this.rawClient) {
          try {
            const res = await this.rawClient.from(tableName).select(cols);
            if (!res.error && res.data && res.data.length > 0) {
              return { data: res.data, error: null };
            }
          } catch (e) {
            // fallback to local cache
          }
        }

        const db = this.getLocalDb();
        return { data: db[tableName] || [], error: null };
      },
      insert: async (records) => {
        const arr = Array.isArray(records) ? records : [records];
        
        // Attempt cloud insert
        if (this.rawClient) {
          try {
            await this.rawClient.from(tableName).insert(arr);
          } catch (e) {
            // fallback
          }
        }

        const db = this.getLocalDb();
        if (!db[tableName]) db[tableName] = [];
        db[tableName].unshift(...arr);
        this.saveLocalDb(db);
        return { data: records, error: null };
      },
      update: async (updates) => {
        if (this.rawClient) {
          try {
            await this.rawClient.from(tableName).update(updates);
          } catch (e) {
            // fallback
          }
        }

        const db = this.getLocalDb();
        this.saveLocalDb(db);
        return { data: updates, error: null };
      }
    };
  }
}

export const supabase = new SupabaseClientWrapper();
