import User from '../models/User.js';
import Consultation from '../models/Consultation.js';

// Search doctors by location
export const searchDoctors = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location query is required.' });
    }
    const doctors = await User.find({
      role: 'doctor',
      location: { $regex: new RegExp(`^${location}$`, 'i') },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all appointments for the logged-in doctor
export const getMyDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Consultation.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ THIS IS THE FUNCTION THAT WAS MISSING
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Consultation.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Security check: Make sure the appointment belongs to the logged-in doctor
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};