import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  contains: { type: String }, // ✅ New Field
  sideEffects: { type: String }, // ✅ New Field
  usageInfo: { type: String }, // ✅ New Field
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;