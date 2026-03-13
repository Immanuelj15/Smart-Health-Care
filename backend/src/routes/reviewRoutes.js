import express from 'express';
import { addReview, getDoctorReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:doctorId', getDoctorReviews);

export default router;
