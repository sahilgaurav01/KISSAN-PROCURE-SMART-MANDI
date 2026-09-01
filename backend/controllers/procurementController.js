const { db } = require('../config/database');

exports.verifyProcurement = (req, res) => {
  try {
    const officerId = req.user.id;
    const { bookingId, actualQuantity, qualityGrade = 'Grade A', moisturePercentage = 11.5, procurementStatus = 'accepted', rejectionReason = '' } = req.body;

    if (!bookingId || actualQuantity === undefined) {
      return res.status(400).json({ success: false, message: 'Booking ID and Actual Quantity are required.' });
    }

    const actualQty = parseFloat(actualQuantity);
    const moisture = parseFloat(moisturePercentage) || 12.0;

    const booking = db.prepare(`
      SELECT b.*, c.name as crop_name, c.msp_per_quintal,
             f.id as farmer_db_id, f.farmer_id as farmer_code,
             u.id as farmer_user_id, u.name as farmer_name,
             pc.name as centre_name
      FROM bookings b
      JOIN crops c ON b.crop_id = c.id
      JOIN farmers f ON b.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN procurement_centres pc ON b.centre_id = pc.id
      WHERE b.id = ?
    `).get(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }

    const procurementTx = db.transaction(() => {
      // 1. Insert Procurement Record
      const insertProc = db.prepare(`
        INSERT INTO procurements (booking_id, officer_id, actual_quantity, quality_grade, moisture_percentage, procurement_status, rejection_reason, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(booking_id) DO UPDATE SET
          actual_quantity = excluded.actual_quantity,
          quality_grade = excluded.quality_grade,
          moisture_percentage = excluded.moisture_percentage,
          procurement_status = excluded.procurement_status,
          rejection_reason = excluded.rejection_reason,
          verified_at = datetime('now')
      `);

      const procResult = insertProc.run(bookingId, officerId, actualQty, qualityGrade, moisture, procurementStatus, rejectionReason);
      const procurementId = procResult.lastInsertRowid;

      // 2. Update Booking Status
      const finalBookingStatus = procurementStatus === 'accepted' ? 'completed' : 'rejected';
      db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(finalBookingStatus, bookingId);

      let paymentData = null;

      // 3. Handle Payment Generation if Accepted
      if (procurementStatus === 'accepted') {
        const msp = booking.msp_per_quintal;
        const totalAmount = parseFloat((actualQty * msp).toFixed(2));
        const txnId = `TXN-2026-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const insertPayment = db.prepare(`
          INSERT INTO payments (procurement_id, farmer_id, amount, msp_rate, transaction_id, status)
          VALUES (?, ?, ?, ?, ?, 'processing')
          ON CONFLICT(procurement_id) DO UPDATE SET
            amount = excluded.amount,
            msp_rate = excluded.msp_rate,
            transaction_id = excluded.transaction_id,
            status = 'processing'
        `);

        const payResult = insertPayment.run(procurementId, booking.farmer_db_id, totalAmount, msp, txnId);
        const paymentId = payResult.lastInsertRowid;

        paymentData = {
          paymentId,
          amount: totalAmount,
          mspRate: msp,
          transactionId: txnId,
          status: 'processing'
        };

        // Notify Farmer of Accepted Procurement & Payment
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, 'success')
        `).run(
          booking.farmer_user_id,
          '🌾 Procurement Completed & Payment Initiated!',
          `Your crop weighment of ${actualQty} Quintals (${booking.crop_name}) has been verified at ₹${msp}/Qtl. Total payment of ₹${totalAmount.toLocaleString('en-IN')} has been initiated (Txn ID: ${txnId}).`
        );
      } else {
        // Notify Farmer of Rejection
        db.prepare(`
          INSERT INTO notifications (user_id, title, message, type)
          VALUES (?, ?, ?, 'warning')
        `).run(
          booking.farmer_user_id,
          '⚠️ Crop Inspection Update',
          `Procurement for Booking #${booking.booking_number} was marked as rejected. Reason: ${rejectionReason || 'Moisture level / quality parameter beyond prescribed limits.'}`
        );
      }

      return {
        procurementId,
        actualQuantity: actualQty,
        qualityGrade,
        moisturePercentage: moisture,
        status: finalBookingStatus,
        payment: paymentData
      };
    });

    const resultData = procurementTx();

    // Broadcast Real-time event
    const io = req.app.get('socketio');
    if (io) {
      io.to(`centre_${booking.centre_id}`).emit('procurement_updated', {
        bookingId,
        centreId: booking.centre_id,
        status: resultData.status,
        actualQuantity: actualQty,
        farmerName: booking.farmer_name
      });

      io.to(`user_${booking.farmer_user_id}`).emit('procurement_status_changed', {
        bookingId,
        status: resultData.status,
        payment: resultData.payment
      });
    }

    res.json({
      success: true,
      message: procurementStatus === 'accepted' ? 'Procurement verified and payment initiated successfully!' : 'Procurement recorded as rejected.',
      procurement: resultData
    });
  } catch (error) {
    console.error('verifyProcurement error:', error);
    res.status(500).json({ success: false, message: 'Failed to record procurement', error: error.message });
  }
};

exports.getProcurementSlip = (req, res) => {
  try {
    const { bookingId } = req.params;
    const slip = db.prepare(`
      SELECT p.*,
             b.booking_number, b.booking_date, b.token_number, b.expected_quantity,
             c.name as crop_name, c.code as crop_code, c.msp_per_quintal,
             f.farmer_id as farmer_code, f.village, f.district, f.state, f.bank_account_masked, f.ifsc_code,
             u.name as farmer_name, u.phone as farmer_phone,
             off.name as officer_name,
             pc.name as centre_name, pc.code as centre_code, pc.address as centre_address,
             pay.id as payment_id, pay.amount as payment_amount, pay.transaction_id, pay.status as payment_status, pay.disbursed_at
      FROM procurements p
      JOIN bookings b ON p.booking_id = b.id
      JOIN crops c ON b.crop_id = c.id
      JOIN farmers f ON b.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN users off ON p.officer_id = off.id
      JOIN procurement_centres pc ON b.centre_id = pc.id
      LEFT JOIN payments pay ON p.id = pay.procurement_id
      WHERE b.id = ?
    `).get(bookingId);

    if (!slip) {
      return res.status(404).json({ success: false, message: 'Procurement slip not found for this booking.' });
    }

    res.json({ success: true, slip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch slip' });
  }
};
