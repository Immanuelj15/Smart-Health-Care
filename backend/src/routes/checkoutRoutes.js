import express from 'express';
import { generateUpiQr } from '../controllers/checkoutController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/generate-upi-qr', protect, generateUpiQr);
export default router;