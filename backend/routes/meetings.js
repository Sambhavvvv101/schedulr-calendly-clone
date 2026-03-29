const express = require('express');
const router = express.Router();
const { getAll, getById, cancel } = require('../controllers/meetingController');

router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id/cancel', cancel);

module.exports = router;
