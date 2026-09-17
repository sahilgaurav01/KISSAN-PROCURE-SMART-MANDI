/**
 * =========================================================
 * SUPABASE: PROCUREMENT & WEIGHMENT (js/supabase/procurement.js)
 * Physical Weighbridge Verification Records
 * =========================================================
 */

import { supabase } from './client.js';

export const ProcurementService = {
  async recordWeighment(weighmentRecord) {
    const { data } = await supabase.from('weighments').insert(weighmentRecord);
    return data;
  }
};
