const express = require('express');
const router = express.Router();
const { getAll, updateAll } = require('../controllers/availabilityController');

router.get('/', getAll);
router.put('/', updateAll);

module.exports = router;
