import express from 'express';
import { uploadRecord, getMyRecords, getAllRecords, updateRecordStatus } from '../controllers/recordController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/upload', protect, upload.single('record'), uploadRecord);
router.get('/my-records', protect, getMyRecords);

// Admin Routes
router.get('/all', protect, restrictTo('admin'), getAllRecords);
router.put('/:id/status', protect, restrictTo('admin'), updateRecordStatus);

export default router;
