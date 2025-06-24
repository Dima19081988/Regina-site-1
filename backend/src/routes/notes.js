const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController.js');

router.get('/', noteController.getAll);
router.get('/:id', noteController.getById);
router.post('/', noteController.create);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

module.exports = router;