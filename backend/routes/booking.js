const express = require('express');
const router = express.Router();
const { getSlots, confirmBooking } = require('../controllers/bookingController');

router.get('/:slug/slots', getSlots);
router.post('/:slug', confirmBooking);

module.exports = router;
