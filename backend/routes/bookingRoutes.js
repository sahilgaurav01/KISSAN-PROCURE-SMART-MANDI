const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole(['farmer', 'admin']), bookingController.createBooking);
router.get('/my-bookings', verifyToken, requireRole(['farmer']), bookingController.getMyBookings);
router.get('/:id', verifyToken, bookingController.getBookingById);

module.exports = router;
