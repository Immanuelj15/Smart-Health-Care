import User from '../models/User.js';

// ✅ GET ALL USERS (without password)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ ADD DOCTOR
export const addDoctor = async (req, res) => {
  const { name, email, password, specialty, experience, location } = req.body;

  try {
    // Check if doctor already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Create new doctor
    const doctor = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      specialty,
      experience,
      location,
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialty: doctor.specialty,
        experience: doctor.experience,
        location: doctor.location,
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ DELETE USER (by ID)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Admin cannot delete their own account.' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
