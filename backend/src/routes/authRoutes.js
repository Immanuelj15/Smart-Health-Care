import express from 'express';
import {
  login,
  sendRegistrationOtp,
  verifyOtpAndRegister,
  registerAdmin,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { googleLogin } from '../controllers/googleAuthController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

/* -------------------- 👤 LOGIN -------------------- */
router.post('/login', login);
router.post('/google-login', googleLogin);

/* -------------------- 📨 PATIENT REGISTRATION (OTP FLOW) -------------------- */
router.post('/register/patient-send-otp', sendRegistrationOtp);
router.post('/register/patient-verify-otp', verifyOtpAndRegister);

/* -------------------- 🛡️ ADMIN REGISTRATION (SECRET KEY REQUIRED) -------------------- */
router.post('/register/admin', registerAdmin);

/* -------------------- 👤 PROFILE MANAGEMENT -------------------- */
router.get('/me', protect, getMe);
router.put('/update-profile', protect, upload.single('profilePicture'), updateProfile);

export default router;
