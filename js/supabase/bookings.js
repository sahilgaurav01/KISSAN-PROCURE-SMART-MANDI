/**
 * =========================================================
 * SUPABASE: BOOKINGS MODULE (js/supabase/bookings.js)
 * Procurement Slot Reservations & Token Generation
 * =========================================================
 */

import { supabase } from './client.js';

export const BookingService = {
  async getAllBookings() {
    const { data } = await supabase.from('bookings').select();
    return data;
  },

  async createBooking(bookingData) {
    const { data } = await supabase.from('bookings').insert(bookingData);
    return data;
  }
};
