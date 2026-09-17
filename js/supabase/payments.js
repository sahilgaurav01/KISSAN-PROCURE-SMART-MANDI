/**
 * =========================================================
 * SUPABASE: PAYMENTS & DBT (js/supabase/payments.js)
 * Direct Benefit Transfer (DBT) Payout Management
 * =========================================================
 */

import { supabase } from './client.js';

export const PaymentService = {
  async getPaymentLedger() {
    const { data } = await supabase.from('payments').select();
    return data;
  },

  async disburseDbtPayment(txnId) {
    const db = supabase.getLocalDb();
    const payment = (db.payments || []).find(p => p.txnId === txnId);
    if (payment) {
      payment.status = 'paid';
      supabase.saveLocalDb(db);
    }
    return payment;
  }
};
