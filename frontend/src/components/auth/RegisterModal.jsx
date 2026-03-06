import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterModal = () => {
  const { isRegisterModalOpen, closeRegisterModal, switchToLogin } = useModal();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-login`, { idToken: credential });
      login(res.data);
      toast.success('Google Registration successful!');
      closeRegisterModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Google Registration failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google registration failed');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/patient-send-otp`, formData);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/patient-verify-otp`, { email: formData.email, otp });
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={handleClose}>
      <div
        className="glass rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden bg-white/90"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <div className="p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>

          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                  <span className="text-white text-3xl">🌿</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Join SmartHealth</h2>
                <p className="text-slate-500 mt-2 font-medium">Create your account to get started</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center flex-col items-center gap-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    size="large"
                    shape="pill"
                    text="signup_with"
                    width="100%"
                  />
                  <div className="relative w-full py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="px-4 bg-white/0 text-slate-400 font-bold">Or register with email</span></div>
                  </div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Mobile</label>
                      <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={onChange} required placeholder="9876543210" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="john@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={onChange} required placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full btn-premium py-4 text-lg mt-4">
                    {isSubmitting ? 'Sending OTP...' : 'Continue'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                  <span className="text-white text-3xl">📩</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Verify Email</h2>
                <p className="text-slate-500 mt-2 font-medium">We've sent a code to <br /><span className="text-indigo-600 font-bold">{formData.email}</span></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-center text-slate-500 uppercase tracking-widest">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full text-center text-3xl font-black tracking-[1rem] py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-premium py-4 text-lg">
                  {isSubmitting ? 'Verifying...' : 'Verify & Complete'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-indigo-600 hover:underline">Resend code?</button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-slate-500 text-sm font-medium pt-8">
            Already have an account? {' '}
            <button onClick={switchToLogin} className="text-indigo-600 font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;