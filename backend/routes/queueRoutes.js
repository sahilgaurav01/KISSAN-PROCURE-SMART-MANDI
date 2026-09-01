const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/:centreId', queueController.getCentreQueue);
router.post('/:centreId/next', verifyToken, requireRole(['officer', 'admin']), queueController.callNextFarmer);

module.exports = router;
