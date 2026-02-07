import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  // --- Patient Info ---
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User
  patientName: { type: String, required: true },    // Store patient's name
  contactNumber: { type: String, required: true },  // Store patient's contact number
  age: { type: Number, required: true },            // Store patient's age
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, // Store gender
  city: { type: String, required: true },           // Store city
  advanceAmount: { type: Number, required: true },  // Advance payment for surgery

  // --- Doctor Info ---
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Doctor

  // --- Surgery Info (optional) ---
  surgery: { type: mongoose.Schema.Types.ObjectId, ref: 'Surgery' }, // Not required for general booking

  // --- Consultation Meta ---
  date: { type: Date, default: Date.now },          
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed'], 
    default: 'Pending' 
  },  // Track consultation status
  notes: { type: String },                          // Optional notes
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
