import express from 'express';
// ✅ A single, combined import for both functions from the controller
import { checkSymptoms, assistDoctor, chatWithAI } from '../controllers/aiController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route for patients to use the symptom checker
router.post('/symptom-checker', protect, checkSymptoms);

// Protected route for doctors to use the AI assistant
router.post('/doctor-assist', protect, restrictTo('doctor'), assistDoctor);

// Public or Protected route for the Chatbot
router.post('/chat', protect, chatWithAI);

export default router;