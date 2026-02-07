import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterModal = () => {
  const { isRegisterModalOpen, closeRegisterModal, switchToLogin } = useModal();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register/patient-send-otp', formData);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register/patient-verify-otp', { email: formData.email, otp });
      toast.success('Registration successful! Please log in.');
      switchToLogin(); // Closes register modal and opens login modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setStep(1); // Reset to first step when closing
    closeRegisterModal();
  }

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleClose}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
            <form onSubmit={handleSendOtp} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={onChange} required className="w-full mt-1 p-3 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={onChange} required className="w-full mt-1 p-3 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address (for OTP)</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full mt-1 p-3 border rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Create Password</label>
                <input type="password" name="password" value={formData.password} onChange={onChange} required className="w-full mt-1 p-3 border rounded-lg"/>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400">
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
            <p className="text-center text-gray-600 mt-2">An OTP has been sent to {formData.email}</p>
            <form onSubmit={handleVerifyOtp} className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full mt-1 p-3 border rounded-lg text-center"/>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400">
                {isSubmitting ? 'Verifying...' : 'Verify & Register'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;