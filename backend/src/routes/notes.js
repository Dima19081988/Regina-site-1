const express = require('express');
const router = express.Router();
const noteController = require('../services/noteController.js');

router.get('/', noteController.getAll);
router.get('/:id', noteController.getById);
router.get('/', noteController.create);
router.get('/:id', noteController.update);
router.get('/:id', noteController.delete);

module.exports = router;