const express = require('express');
const router = express.Router();
const centreController = require('../controllers/centreController');

router.get('/', centreController.getCentres);
router.get('/crops', centreController.getCrops);
router.get('/:centreId/slots', centreController.getSlotsByCentreAndDate);
router.get('/recommend-slot', centreController.getSmartSlotRecommendation);

module.exports = router;
