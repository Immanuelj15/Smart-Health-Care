import express from 'express';
import { addDoctor, getAllUsers, deleteUser } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Only admins can add doctors
router.post('/add-doctor', protect, restrictTo('admin'), addDoctor);

// ✅ Only admins can view all users
router.get('/users', protect, restrictTo('admin'), getAllUsers);

// ✅ Only admins can delete a user by ID
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

export default router;
