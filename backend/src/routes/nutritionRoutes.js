import express from 'express';
import { analyzeFood } from '../controllers/nutritionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Route to analyze food
// Uses the 'upload' middleware (multer+cloudinary) to handle the file first
router.post('/analyze', protect, upload.single('image'), analyzeFood);

export default router;
