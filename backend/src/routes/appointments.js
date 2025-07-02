import appointmentController from '../controllers/appointmentController.js';
import express from 'express';

const router = express.Router();

router.get('/by-month', appointmentController.getByMonth);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

export default router;