import express from 'express';
// ✅ 1. Make sure all three functions are imported from the controller
import { searchDoctors, getMyDoctorAppointments, updateAppointmentStatus } from '../controllers/doctorController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for searching doctors
router.get('/search', searchDoctors);

// Route for doctors to view their own appointments
router.get('/my-appointments', protect, restrictTo('doctor'), getMyDoctorAppointments);

// ✅ 2. This is the missing route that handles the update
router.put('/appointments/:id/status', protect, restrictTo('doctor'), updateAppointmentStatus);

export default router;