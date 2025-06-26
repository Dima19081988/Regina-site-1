const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController.js');

router.get('/by-month', appointmentController.getByMonth);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;