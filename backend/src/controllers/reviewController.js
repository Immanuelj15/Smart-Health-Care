import Review from '../models/Review.js';
import Consultation from '../models/Consultation.js';

export const addReview = async (req, res) => {
  const { doctorId, consultationId, rating, comment } = req.body;

  try {
    // Check if consultation exists and is completed
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only review completed consultations' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ consultation: consultationId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this consultation' });
    }

    const review = new Review({
      doctor: doctorId,
      patient: req.user.id,
      consultation: consultationId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate('patient', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
