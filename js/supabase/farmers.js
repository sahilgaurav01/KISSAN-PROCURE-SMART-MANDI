/**
 * =========================================================
 * SUPABASE: FARMER PROFILE MODULE (js/supabase/farmers.js)
 * Farmer Data & Identity Queries
 * =========================================================
 */

import { supabase } from './client.js';

export const FarmerService = {
  async getFarmerProfile(farmerId) {
    const { data } = await supabase.from('users').select();
    return data.find(u => u.farmer_code === farmerId || u.id === farmerId) || {
      fullName: 'Ramesh Kumar',
      farmerCode: 'FARM1001',
      village: 'Minapur',
      district: 'Muzaffarpur'
    };
  }
};
