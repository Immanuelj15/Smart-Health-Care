import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useModal();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });

  useEffect(() => {
    if (isAuthenticated && isLoginModalOpen) {
      navigate('/dashboard');
      closeLoginModal();
    }
  }, [isAuthenticated, navigate, closeLoginModal, isLoginModalOpen]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      login(res.data);
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-login`, { idToken: credential });
      login(res.data);
      toast.success('Google Login successful!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Google Login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed');
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={closeLoginModal}>
      <div
        className="glass rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden bg-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <div className="p-8 relative">
          <button
            onClick={closeLoginModal}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <span className="text-white text-3xl">🩺</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center flex-col items-center gap-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                shape="pill"
                width="100%"
              />
              <div className="relative w-full py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-4 bg-white text-slate-400 font-bold">Or continue with email</span></div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Login as</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={onChange}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={onChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-premium py-4 text-lg mt-2 shadow-xl shadow-indigo-500/20"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm font-medium pt-4">
              Don't have an account? {' '}
              <button
                onClick={() => { closeLoginModal(); openRegisterModal(); }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;