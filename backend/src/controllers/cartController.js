import Cart from '../models/Cart.js';

// ✅ This function was missing
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.medicine');
    if (!cart) {
      // If no cart, return a new empty cart structure
      return res.status(200).json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// This is your existing function
export const addToCart = async (req, res) => {
  const { medicineId, quantity = 1 } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.medicine.equals(medicineId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ medicine: medicineId, quantity: quantity });
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ This function was missing
export const updateCartItem = async (req, res) => {
  const { medicineId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const itemIndex = cart.items.findIndex(p => p.medicine.toString() === medicineId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
      return res.status(200).json(populatedCart);
    }
    res.status(404).json({ message: 'Item not found in cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ This function was missing
export const removeCartItem = async (req, res) => {
  const { medicineId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(p => p.medicine.toString() !== medicineId);
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.medicine');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};