import express from 'express';
import { 
  login, 
  sendRegistrationOtp, 
  verifyOtpAndRegister, 
  registerAdmin 
} from '../controllers/authController.js';

const router = express.Router();

/* -------------------- 👤 LOGIN -------------------- */
router.post('/login', login);

/* -------------------- 📨 PATIENT REGISTRATION (OTP FLOW) -------------------- */
router.post('/register/patient-send-otp', sendRegistrationOtp);
router.post('/register/patient-verify-otp', verifyOtpAndRegister);

/* -------------------- 🛡️ ADMIN REGISTRATION (SECRET KEY REQUIRED) -------------------- */
router.post('/register/admin', registerAdmin);

export default router;
