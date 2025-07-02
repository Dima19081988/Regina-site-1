import express from 'express';
import noteController from '../controllers/noteController.js';

const router = express.Router();

router.get('/', noteController.getAll);
router.get('/:id', noteController.getById);
router.post('/', noteController.create);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;