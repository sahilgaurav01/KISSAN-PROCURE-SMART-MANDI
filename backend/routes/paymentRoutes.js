const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/my-payments', verifyToken, requireRole(['farmer']), paymentController.getMyPayments);
router.get('/all', verifyToken, requireRole(['admin']), paymentController.getAllPayments);
router.patch('/:paymentId/disburse', verifyToken, requireRole(['admin']), paymentController.disbursePayment);

module.exports = router;
