import express from 'express';
import { addMedicine, getAllMedicines,getMedicineById } from '../controllers/medicineController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Public route to view all medicines
router.get('/', getAllMedicines);

// Protected route for admins to add new medicine
//router.post('/', protect, restrictTo('admin'), addMedicine);
router.post('/', protect, restrictTo('admin'), upload.single('image'), addMedicine);
router.get('/:id', getMedicineById); 
export default router;