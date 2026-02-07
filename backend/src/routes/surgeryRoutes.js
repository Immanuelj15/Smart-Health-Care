import express from 'express';
import { getAllSurgeries, getSurgeryById } from '../controllers/surgeryController.js';
const router = express.Router();
router.get('/', getAllSurgeries);
router.get('/:id', getSurgeryById);
export default router;