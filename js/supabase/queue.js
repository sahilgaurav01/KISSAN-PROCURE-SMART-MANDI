/**
 * =========================================================
 * SUPABASE: QUEUE MANAGEMENT MODULE (js/supabase/queue.js)
 * Live Token Streaming & Queue Progression
 * =========================================================
 */

import { supabase } from './client.js';

export const QueueService = {
  async getCurrentServingToken(centreId = 1) {
    const db = supabase.getLocalDb();
    return db.currentServingToken || 18;
  },

  async advanceQueue(nextToken) {
    const db = supabase.getLocalDb();
    db.currentServingToken = nextToken;
    supabase.saveLocalDb(db);
    return db.currentServingToken;
  }
};
