import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { ...formData, role: 'admin' });
      login(res.data);
      toast.success('Admin authentication successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Administrative Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="glass-premium rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="p-12">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform hover:rotate-12 transition-transform duration-500">
                <span className="text-white text-4xl">🔐</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-3">Admin Portal</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Gateway • Authorization Required</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">👤</span>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="admin@smarthealth.com" 
                    value={formData.email} 
                    onChange={onChange} 
                    required 
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Secret Access Key</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔑</span>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={onChange} 
                    required 
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-premium py-5 text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 group relative overflow-hidden mt-4"
              >
                <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Access Terminal'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <button 
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                ← Return to Public Portal
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-[10px] mt-8 font-black uppercase tracking-[0.2em]">
          Classified Information • Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;