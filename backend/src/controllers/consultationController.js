import Consultation from '../models/Consultation.js';
import Surgery from '../models/Surgery.js'; // For optional surgery population

// ✅ Book a new consultation (doctor required, surgery optional)
export const bookConsultation = async (req, res) => {
  const { doctorId, surgeryId, notes, contactNumber, age, gender, city, advanceAmount } = req.body;

  try {
    const newConsultation = new Consultation({
      patient: req.user.id,        // From auth middleware
      patientName: req.user.name,  // From logged-in user
      doctor: doctorId,            // ✅ Always required
      surgery: surgeryId || null,  // ✅ Optional surgery
      contactNumber,
      age,
      gender,
      city,
      advanceAmount,
      notes,
    });

    const savedConsultation = await newConsultation.save();
    res.status(201).json(savedConsultation);
  } catch (error) {
    console.error("❌ Error booking consultation:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Fetch logged-in patient's consultations
export const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.user.id })
      .populate('doctor', 'name email')   // Show doctor info
      .populate('surgery', 'name')        // Show surgery info if exists
      .sort({ date: -1 });

    res.json(consultations);
  } catch (error) {
    console.error("❌ Error fetching consultations:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Fetch consultations for a doctor (doctor dashboard)
export const getDoctorConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctor: req.user.id })
      .populate('patient', 'name email')  // Show patient info
      .populate('surgery', 'name')
      .sort({ date: -1 });

    res.json(consultations);
  } catch (error) {
    console.error("❌ Error fetching doctor consultations:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Update consultation status (doctor/admin)
export const updateConsultationStatus = async (req, res) => {
  const { consultationId } = req.params;
  const { status } = req.body;

  try {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = status;
    await consultation.save();

    res.json({ message: 'Consultation status updated', consultation });
  } catch (error) {
    console.error("❌ Error updating consultation:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
