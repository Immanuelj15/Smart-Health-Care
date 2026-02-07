import express from 'express';
import { bookConsultation, getMyConsultations } from '../controllers/consultationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Routes
router.post('/book', protect, bookConsultation);
router.get('/my-bookings', protect, getMyConsultations);

export default router;
