const { db } = require('../config/database');

exports.createBooking = (req, res) => {
  try {
    const farmerDbId = req.user.farmer_db_id;
    if (!farmerDbId) {
      return res.status(403).json({ success: false, message: 'Only registered farmers can book procurement slots.' });
    }

    const { centreId, slotId, cropId, expectedQuantity, date } = req.body;

    if (!centreId || !slotId || !cropId || !expectedQuantity) {
      return res.status(400).json({ success: false, message: 'Centre, Slot, Crop, and Quantity are required.' });
    }

    const bookingDate = date || new Date().toISOString().split('T')[0];
    const qty = parseFloat(expectedQuantity);

    if (qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0.' });
    }

    // Execute atomic booking transaction
    const bookingTx = db.transaction(() => {
      // 1. Check Slot Capacity
      const slot = db.prepare('SELECT * FROM slots WHERE id = ?').get(slotId);
      if (!slot) {
        throw new Error('Selected time slot does not exist.');
      }
      if (slot.booked_count >= slot.max_capacity) {
        throw new Error('Selected time slot is already fully booked. Please choose another slot.');
      }

      // 2. Compute Next Sequential Token for Centre on this date
      const maxTokenRow = db.prepare(`
        SELECT MAX(token_number) as max_token 
        FROM bookings 
        WHERE centre_id = ? AND booking_date = ?
      `).get(centreId, bookingDate);

      const nextToken = (maxTokenRow && maxTokenRow.max_token) ? maxTokenRow.max_token + 1 : 1;

      // 3. Update Slot Booked Count
      db.prepare('UPDATE slots SET booked_count = booked_count + 1 WHERE id = ?').run(slotId);

      // 4. Generate Booking Number
      const bookingNumber = `BK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // 5. Insert Booking
      const insertBooking = db.prepare(`
        INSERT INTO bookings (booking_number, farmer_id, centre_id, slot_id, crop_id, expected_quantity, token_number, status, booking_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'booked', ?)
      `);

      const result = insertBooking.run(
        bookingNumber,
        farmerDbId,
        centreId,
        slotId,
        cropId,
        qty,
        nextToken,
        bookingDate
      );
      const bookingId = result.lastInsertRowid;

      // 6. Fetch Centre & Crop details for Notification
      const centre = db.prepare('SELECT name, code FROM procurement_centres WHERE id = ?').get(centreId);
      const crop = db.prepare('SELECT name, msp_per_quintal FROM crops WHERE id = ?').get(cropId);

      // 7. Create in-app notification
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, 'success')
      `).run(
        req.user.id,
        'Procurement Slot Confirmed!',
        `Your booking (${bookingNumber}) for ${qty} Qtl of ${crop.name} is confirmed at ${centre.name}. Your Token Number is #${nextToken} (${slot.start_time.slice(0,5)} - ${slot.end_time.slice(0,5)}).`
      );

      return {
        bookingId,
        bookingNumber,
        tokenNumber: nextToken,
        centreName: centre.name,
        cropName: crop.name,
        msp: crop.msp_per_quintal,
        slotTime: `${slot.start_time.slice(0,5)} - ${slot.end_time.slice(0,5)}`,
        bookingDate,
        expectedQuantity: qty
      };
    });

    const bookingData = bookingTx();

    // Broadcast queue update via Socket.IO if available
    const io = req.app.get('socketio');
    if (io) {
      io.to(`centre_${centreId}`).emit('booking_added', {
        centreId,
        token: bookingData.tokenNumber,
        bookingNumber: bookingData.bookingNumber
      });
    }

    res.status(201).json({
      success: true,
      message: 'Slot booked successfully!',
      booking: bookingData
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyBookings = (req, res) => {
  try {
    const farmerDbId = req.user.farmer_db_id;
    if (!farmerDbId) {
      return res.status(403).json({ success: false, message: 'Farmer profile required.' });
    }

    const bookings = db.prepare(`
      SELECT b.*,
             pc.name as centre_name, pc.code as centre_code, pc.address as centre_address,
             c.name as crop_name, c.msp_per_quintal,
             s.start_time, s.end_time,
             p.actual_quantity, p.quality_grade, p.moisture_percentage, p.procurement_status,
             pay.id as payment_id, pay.amount as payment_amount, pay.transaction_id, pay.status as payment_status,
             qs.current_token as live_centre_token
      FROM bookings b
      JOIN procurement_centres pc ON b.centre_id = pc.id
      JOIN crops c ON b.crop_id = c.id
      JOIN slots s ON b.slot_id = s.id
      LEFT JOIN procurements p ON b.id = p.booking_id
      LEFT JOIN payments pay ON p.id = pay.procurement_id
      LEFT JOIN queue_state qs ON pc.id = qs.centre_id
      WHERE b.farmer_id = ?
      ORDER BY b.id DESC
    `).all(farmerDbId);

    // Calculate queue distance & estimated wait for active bookings
    const bookingsWithQueueInfo = bookings.map(b => {
      const liveToken = b.live_centre_token || 0;
      const farmersAhead = Math.max(0, b.token_number - liveToken);
      const estWaitMinutes = farmersAhead * 5.5;

      return {
        ...b,
        farmersAhead,
        estimatedWaitMinutes: Math.round(estWaitMinutes),
        isTurnApproaching: farmersAhead > 0 && farmersAhead <= 3,
        isCurrentTurn: b.token_number === liveToken
      };
    });

    res.json({
      success: true,
      bookings: bookingsWithQueueInfo
    });
  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

exports.getBookingById = (req, res) => {
  try {
    const { id } = req.params;
    const booking = db.prepare(`
      SELECT b.*,
             pc.name as centre_name, pc.code as centre_code, pc.address as centre_address,
             c.name as crop_name, c.msp_per_quintal,
             s.start_time, s.end_time,
             f.farmer_id as farmer_code, f.village, f.district, f.bank_account_masked, f.ifsc_code,
             u.name as farmer_name, u.phone as farmer_phone,
             p.actual_quantity, p.quality_grade, p.moisture_percentage, p.procurement_status, p.verified_at,
             pay.id as payment_id, pay.amount as payment_amount, pay.transaction_id, pay.status as payment_status, pay.disbursed_at,
             qs.current_token as live_centre_token
      FROM bookings b
      JOIN farmers f ON b.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      JOIN procurement_centres pc ON b.centre_id = pc.id
      JOIN crops c ON b.crop_id = c.id
      JOIN slots s ON b.slot_id = s.id
      LEFT JOIN procurements p ON b.id = p.booking_id
      LEFT JOIN payments pay ON p.id = pay.procurement_id
      LEFT JOIN queue_state qs ON pc.id = qs.centre_id
      WHERE b.id = ?
    `).get(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const liveToken = booking.live_centre_token || 0;
    const farmersAhead = Math.max(0, booking.token_number - liveToken);

    res.json({
      success: true,
      booking: {
        ...booking,
        farmersAhead,
        estimatedWaitMinutes: Math.round(farmersAhead * 5.5),
        isTurnApproaching: farmersAhead > 0 && farmersAhead <= 3,
        isCurrentTurn: booking.token_number === liveToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking details' });
  }
};
