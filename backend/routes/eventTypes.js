const express = require('express');
const router = express.Router();
const { getAll, getById, getBySlug, create, update, remove } = require('../controllers/eventTypeController');

router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
