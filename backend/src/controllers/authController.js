import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import sendEmail from '../utils/sendEmail.js';

const otpStorage = new Map();

/* -------------------- 📨 SEND OTP FOR REGISTRATION -------------------- */
export const sendRegistrationOtp = async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    otpStorage.set(email, { name, email, password, mobileNumber, otp, expires: Date.now() + 10 * 60 * 1000 });
    await sendEmail({
      email,
      subject: 'Your SmartHealth Registration OTP',
      message: `Your OTP for registration is: ${otp}`,
    });
    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error sending OTP');
  }
};

/* -------------------- ✅ VERIFY OTP & REGISTER USER -------------------- */
export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;
  console.log(`Verifying OTP for ${email}: ${otp}`);
  try {
    const tempUser = otpStorage.get(email);
    console.log('Stored tempUser:', tempUser);

    if (!tempUser || tempUser.expires < Date.now()) {
      return res.status(400).json({ message: 'OTP is invalid or has expired.' });
    }
    if (tempUser.otp !== otp) {
      console.log(`OTP mismatch: Stored=${tempUser.otp}, Provided=${otp}`);
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    const { name, password, mobileNumber } = tempUser;
    const user = new User({ name, email, password, mobileNumber, role: 'patient' });

    try {
      await user.save();
      console.log('User saved successfully');
    } catch (saveError) {
      console.error('User save error:', saveError.message);
      return res.status(400).json({ message: saveError.message });
    }

    otpStorage.delete(email);
    res.status(201).json({ message: 'Patient registered successfully!' });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).send('Server Error');
  }
};

/* -------------------- 🔐 LOGIN -------------------- */
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials for the selected role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const resData = { 
      token, 
      role: user.role, 
      name: user.name 
    };
    if (user.role === 'doctor') {
      resData.specialty = user.specialty;
    }
    res.json(resData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/* -------------------- 🛡️ REGISTER ADMIN (SECURED) -------------------- */
export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;
  if (secretKey !== process.env.ADMIN_REGISTRATION_SECRET_KEY) {
    return res.status(403).json({ message: 'Invalid secret key. Not authorized.' });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/* -------------------- 👤 GET CURRENT USER PROFILE -------------------- */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/* -------------------- 📝 UPDATE USER PROFILE -------------------- */
export const updateProfile = async (req, res) => {
  const { name, mobileNumber, specialty, experience, location, qualifications, bio, dob } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (bio) user.bio = bio;
    if (dob) user.dob = dob;
    
    // Handle image upload
    if (req.file) {
      user.profilePicture = req.file.path; // Cloudinary URL
    }

    // Doctor-specific fields
    if (user.role === 'doctor') {
      if (specialty) user.specialty = specialty;
      if (experience) user.experience = experience;
      if (location) user.location = location;
      if (qualifications) user.qualifications = qualifications;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};