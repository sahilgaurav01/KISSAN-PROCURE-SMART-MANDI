const { db } = require('../config/database');

exports.getCentreQueue = (req, res) => {
  try {
    const { centreId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const centre = db.prepare('SELECT * FROM procurement_centres WHERE id = ?').get(centreId);
    if (!centre) {
      return res.status(404).json({ success: false, message: 'Procurement centre not found.' });
    }

    const qState = db.prepare(`
      SELECT qs.*, 
             b.booking_number, b.token_number, b.expected_quantity, b.status as booking_status,
             u.name as farmer_name, u.phone as farmer_phone, f.farmer_id as farmer_code, f.village,
             c.name as crop_name, c.msp_per_quintal
      FROM queue_state qs
      LEFT JOIN bookings b ON qs.active_booking_id = b.id
      LEFT JOIN farmers f ON b.farmer_id = f.id
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN crops c ON b.crop_id = c.id
      WHERE qs.centre_id = ?
    `).get(centreId);

    const currentToken = qState ? qState.current_token : 0;

    // Fetch waiting queue for today
    const waitingQueue = db.prepare(`
      SELECT b.id, b.booking_number, b.token_number, b.expected_quantity, b.status,
             u.name as farmer_name, u.phone as farmer_phone, f.farmer_id as farmer_code, f.village,
             c.name as crop_name, c.msp_per_quintal,
             s.start_time, s.end_time
      FROM bookings b
      JOIN farmers f ON b.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN crops c ON b.crop_id = c.id
      JOIN slots s ON b.slot_id = s.id
      WHERE b.centre_id = ? AND b.booking_date = ? AND b.status IN ('booked', 'arrived')
      ORDER BY b.token_number ASC
    `).all(centreId, today);

    // Fetch served today count & total quintals
    const stats = db.prepare(`
      SELECT 
        COUNT(DISTINCT b.id) as served_farmers_count,
        COALESCE(SUM(p.actual_quantity), 0) as total_quintals_procured,
        COALESCE(SUM(pay.amount), 0) as total_payout_amount
      FROM bookings b
      LEFT JOIN procurements p ON b.id = p.booking_id
      LEFT JOIN payments pay ON p.id = pay.procurement_id
      WHERE b.centre_id = ? AND b.booking_date = ? AND b.status = 'completed'
    `).get(centreId, today);

    res.json({
      success: true,
      centre,
      currentToken,
      activeBooking: qState && qState.active_booking_id ? {
        id: qState.active_booking_id,
        bookingNumber: qState.booking_number,
        tokenNumber: qState.token_number,
        farmerName: qState.farmer_name,
        farmerCode: qState.farmer_code,
        farmerPhone: qState.farmer_phone,
        village: qState.village,
        cropName: qState.crop_name,
        msp: qState.msp_per_quintal,
        expectedQuantity: qState.expected_quantity,
        status: qState.booking_status
      } : null,
      waitingQueue: waitingQueue.map((item, idx) => ({
        ...item,
        queuePosition: idx + 1,
        estimatedWaitMinutes: Math.round((idx + 1) * 5.5)
      })),
      stats: {
        servedFarmers: stats.served_farmers_count,
        totalQuintals: parseFloat(stats.total_quintals_procured.toFixed(1)),
        totalPayout: parseFloat(stats.total_payout_amount.toFixed(2)),
        pendingCount: waitingQueue.length
      }
    });
  } catch (error) {
    console.error('getCentreQueue error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queue state', error: error.message });
  }
};

exports.callNextFarmer = (req, res) => {
  try {
    const { centreId } = req.params;
    const { tokenNumber } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Find the next booking to call
    let nextBooking = null;
    if (tokenNumber) {
      nextBooking = db.prepare(`
        SELECT b.*, u.id as user_id, u.name as farmer_name, f.farmer_id as farmer_code, c.name as crop_name
        FROM bookings b
        JOIN farmers f ON b.farmer_id = f.id
        JOIN users u ON f.user_id = u.id
        JOIN crops c ON b.crop_id = c.id
        WHERE b.centre_id = ? AND b.booking_date = ? AND b.token_number = ?
      `).get(centreId, today, tokenNumber);
    } else {
      // Pick the lowest token number currently in 'booked' or 'arrived' state
      nextBooking = db.prepare(`
        SELECT b.*, u.id as user_id, u.name as farmer_name, f.farmer_id as farmer_code, c.name as crop_name
        FROM bookings b
        JOIN farmers f ON b.farmer_id = f.id
        JOIN users u ON f.user_id = u.id
        JOIN crops c ON b.crop_id = c.id
        WHERE b.centre_id = ? AND b.booking_date = ? AND b.status IN ('booked', 'arrived')
        ORDER BY b.token_number ASC
        LIMIT 1
      `).get(centreId, today);
    }

    if (!nextBooking) {
      return res.status(404).json({ success: false, message: 'No more waiting farmers in the queue for today.' });
    }

    // Update the booking status to in_progress
    db.prepare("UPDATE bookings SET status = 'in_progress' WHERE id = ?").run(nextBooking.id);

    // Update queue state
    db.prepare(`
      INSERT INTO queue_state (centre_id, current_token, active_booking_id, last_called_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(centre_id) DO UPDATE SET
        current_token = excluded.current_token,
        active_booking_id = excluded.active_booking_id,
        last_called_at = datetime('now')
    `).run(centreId, nextBooking.token_number, nextBooking.id);

    // Create notification for the called farmer
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, 'alert')
    `).run(
      nextBooking.user_id,
      '📢 YOUR TOKEN IS CALLED!',
      `Token #${nextBooking.token_number} (${nextBooking.farmer_name}) is now being served at the inspection desk. Please proceed immediately.`
    );

    // Check next upcoming farmers (ahead count <= 3) and notify them
    const upcomingFarmers = db.prepare(`
      SELECT b.id, b.token_number, u.id as user_id, u.name as farmer_name
      FROM bookings b
      JOIN farmers f ON b.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE b.centre_id = ? AND b.booking_date = ? AND b.status = 'booked' AND b.token_number > ?
      ORDER BY b.token_number ASC
      LIMIT 3
    `).all(centreId, today, nextBooking.token_number);

    for (const upcoming of upcomingFarmers) {
      const ahead = upcoming.token_number - nextBooking.token_number;
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, 'info')
      `).run(
        upcoming.user_id,
        '⏳ Your Turn is Approaching!',
        `Current Token is #${nextBooking.token_number}. You are Token #${upcoming.token_number} (${ahead} farmer${ahead > 1 ? 's' : ''} ahead). Estimated wait ~${Math.round(ahead * 5.5)} mins.`
      );
    }

    // Real-time broadcast via Socket.IO
    const io = req.app.get('socketio');
    if (io) {
      io.to(`centre_${centreId}`).emit('queue_updated', {
        centreId: parseInt(centreId),
        currentToken: nextBooking.token_number,
        activeBooking: {
          id: nextBooking.id,
          bookingNumber: nextBooking.booking_number,
          tokenNumber: nextBooking.token_number,
          farmerName: nextBooking.farmer_name,
          farmerCode: nextBooking.farmer_code,
          cropName: nextBooking.crop_name,
          expectedQuantity: nextBooking.expected_quantity
        },
        timestamp: new Date().toISOString()
      });

      // Emit targeted alert to the called farmer
      io.to(`user_${nextBooking.user_id}`).emit('token_called', {
        bookingId: nextBooking.id,
        tokenNumber: nextBooking.token_number
      });
    }

    res.json({
      success: true,
      message: `Now serving Token #${nextBooking.token_number} (${nextBooking.farmer_name})`,
      calledToken: nextBooking.token_number,
      activeBooking: nextBooking
    });
  } catch (error) {
    console.error('callNextFarmer error:', error);
    res.status(500).json({ success: false, message: 'Failed to advance queue', error: error.message });
  }
};
