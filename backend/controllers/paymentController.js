const { db } = require('../config/database');

exports.getMyPayments = (req, res) => {
  try {
    const farmerDbId = req.user.farmer_db_id;
    if (!farmerDbId) {
      return res.status(403).json({ success: false, message: 'Farmer profile required.' });
    }

    const payments = db.prepare(`
      SELECT pay.*,
             p.actual_quantity, p.quality_grade, p.verified_at,
             b.booking_number, b.booking_date, b.token_number,
             c.name as crop_name,
             pc.name as centre_name, pc.code as centre_code
      FROM payments pay
      JOIN procurements p ON pay.procurement_id = p.id
      JOIN bookings b ON p.booking_id = b.id
      JOIN crops c ON b.crop_id = c.id
      JOIN procurement_centres pc ON b.centre_id = pc.id
      WHERE pay.farmer_id = ?
      ORDER BY pay.id DESC
    `).all(farmerDbId);

    const totalReceived = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalProcessing = payments
      .filter(p => p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      payments,
      summary: {
        totalReceived: parseFloat(totalReceived.toFixed(2)),
        totalProcessing: parseFloat(totalProcessing.toFixed(2)),
        count: payments.length
      }
    });
  } catch (error) {
    console.error('getMyPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};

exports.getAllPayments = (req, res) => {
  try {
    const { status, centreId, search } = req.query;

    let query = `
      SELECT pay.*,
             p.actual_quantity, p.quality_grade, p.verified_at,
             b.booking_number, b.booking_date, b.token_number,
             c.name as crop_name,
             pc.name as centre_name, pc.code as centre_code,
             f.farmer_id as farmer_code, f.village, f.district, f.bank_account_masked, f.ifsc_code,
             u.name as farmer_name, u.phone as farmer_phone
      FROM payments pay
      JOIN procurements p ON pay.procurement_id = p.id
      JOIN bookings b ON p.booking_id = b.id
      JOIN crops c ON b.crop_id = c.id
      JOIN procurement_centres pc ON b.centre_id = pc.id
      JOIN farmers f ON pay.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    if (status && status !== 'all') {
      query += ` AND pay.status = ?`;
      params.push(status);
    }
    if (centreId) {
      query += ` AND b.centre_id = ?`;
      params.push(centreId);
    }
    if (search) {
      query += ` AND (u.name LIKE ? OR f.farmer_id LIKE ? OR pay.transaction_id LIKE ? OR b.booking_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY pay.id DESC`;

    const payments = db.prepare(query).all(...params);

    const stats = db.prepare(`
      SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'processing' THEN amount ELSE 0 END) as total_processing,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_count
      FROM payments
    `).get();

    res.json({
      success: true,
      payments,
      stats: {
        totalPaid: parseFloat((stats.total_paid || 0).toFixed(2)),
        totalProcessing: parseFloat((stats.total_processing || 0).toFixed(2)),
        paidCount: stats.paid_count,
        processingCount: stats.processing_count
      }
    });
  } catch (error) {
    console.error('getAllPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

exports.disbursePayment = (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = db.prepare(`
      SELECT pay.*, f.user_id as farmer_user_id, u.name as farmer_name, c.name as crop_name
      FROM payments pay
      JOIN farmers f ON pay.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN procurements p ON pay.procurement_id = p.id
      JOIN bookings b ON p.booking_id = b.id
      JOIN crops c ON b.crop_id = c.id
      WHERE pay.id = ?
    `).get(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    db.prepare(`
      UPDATE payments 
      SET status = 'paid', disbursed_at = datetime('now')
      WHERE id = ?
    `).run(paymentId);

    // Notify farmer of disbursement
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, 'success')
    `).run(
      payment.farmer_user_id,
      '💰 Payment Disbursed to Bank Account!',
      `₹${payment.amount.toLocaleString('en-IN')} has been successfully transferred to your registered bank account (Txn ID: ${payment.transaction_id}) for ${payment.crop_name} procurement.`
    );

    // Real-time notify via Socket.IO
    const io = req.app.get('socketio');
    if (io) {
      io.to(`user_${payment.farmer_user_id}`).emit('payment_disbursed', {
        paymentId: parseInt(paymentId),
        amount: payment.amount,
        transactionId: payment.transaction_id,
        disbursedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: `Payment of ₹${payment.amount.toLocaleString('en-IN')} marked as PAID.`,
      paymentId: parseInt(paymentId)
    });
  } catch (error) {
    console.error('disbursePayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to disburse payment' });
  }
};
