import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true }, // ✅ New field for delivery address
  status: { 
    type: String, 
    enum: ['Pending Payment', 'Paid', 'Completed'], 
    default: 'Pending Payment' 
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
