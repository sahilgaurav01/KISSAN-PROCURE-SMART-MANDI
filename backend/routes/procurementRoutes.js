const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/verify', verifyToken, requireRole(['officer', 'admin']), procurementController.verifyProcurement);
router.get('/:bookingId/slip', verifyToken, procurementController.getProcurementSlip);

module.exports = router;
