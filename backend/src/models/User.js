import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Password optional for Google users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth

  // ✅ Mobile number validation
  mobileNumber: {
    type: String,
    match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"]
  },

  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },

  // ✅ Doctor-specific fields
  specialty: { type: String }, // e.g., "Cardiologist"
  experience: { type: Number }, // in years
  location: { type: String },   // e.g., "Chennai, Bangalore"
  qualifications: { type: String }, // e.g., "MBBS, MD"
  consultationFee: { type: Number }, // fee in INR or USD
  availability: [
    {
      day: { type: String },       // e.g., "Monday"
      time: { type: String }       // e.g., "10:00 AM - 1:00 PM"
    }
  ]
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
