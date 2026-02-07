// backend/src/controllers/checkoutController.js
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import QRCode from 'qrcode';

export const generateUpiQr = async (req, res) => {
  try {
    // ✅ 1. Get address from request body
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: 'Address is required.' });
    }

    // ✅ 2. Find user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.medicine');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // ✅ 3. Calculate total amount
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.medicine.price * item.quantity,
      0
    );

    // ✅ 4. Create a new order (with address)
    const newOrder = new Order({
      user: req.user.id,
      items: cart.items.map(i => ({
        name: i.medicine.name,
        quantity: i.quantity,
        price: i.medicine.price,
      })),
      totalAmount: totalAmount,
      address: address, // <-- Save address
    });
    await newOrder.save();

    // ✅ 5. Create UPI payment string
    const upiString = encodeURI(
      `upi://pay?pa=${process.env.UPI_ID}&pn=${process.env.UPI_NAME}&am=${totalAmount}&cu=INR&tn=Order#${newOrder._id}`
    );

    // ✅ 6. Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(upiString);

    // ✅ 7. Send response back
    res.json({
      qrCode: qrCodeDataUrl,
      orderId: newOrder._id,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
