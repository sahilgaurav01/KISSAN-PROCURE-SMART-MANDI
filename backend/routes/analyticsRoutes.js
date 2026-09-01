const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/overview', verifyToken, requireRole(['admin']), analyticsController.getAdminOverview);

module.exports = router;
