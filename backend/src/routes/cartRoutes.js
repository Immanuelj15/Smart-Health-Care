import express from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get the current user's cart
router.get('/', protect, getCart);

// Add a medicine to the cart
router.post('/add', protect, addToCart);

// Update the quantity of a cart item
router.put('/update', protect, updateCartItem);

// Remove a specific item from the cart
router.delete('/remove/:medicineId', protect, removeCartItem);

export default router;
