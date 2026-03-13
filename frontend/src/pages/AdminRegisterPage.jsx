import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', secretKey: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/admin`, formData);
      toast.success('Administrative credentials verified and created!');
      navigate('/admin'); // Redirect to dedicated admin login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Administrative registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -ml-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] -mr-48 -mb-48"></div>
      
      <div className="w-full max-w-xl relative z-10">
        <div className="glass-premium rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="p-12">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform hover:-rotate-12 transition-transform duration-500">
                <span className="text-white text-4xl">🎩</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-3">Admin Setup</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Enrollment • Principal Access</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5 ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-60">👤</span>
                  <input type="text" name="name" placeholder="Johnathan Doe" onChange={onChange} required className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 outline-none transition-all font-medium"/>
                </div>
              </div>

              <div className="space-y-1.5 ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Email</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-60">✉️</span>
                  <input type="email" name="email" placeholder="admin@smarthealth.com" onChange={onChange} required className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 outline-none transition-all font-medium"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Key</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-60">🔒</span>
                    <input type="password" name="password" placeholder="••••••••" onChange={onChange} required className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 outline-none transition-all font-medium"/>
                  </div>
                </div>
                <div className="space-y-1.5 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Vault Key</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-60">🔑</span>
                    <input type="password" name="secretKey" placeholder="••••••••" onChange={onChange} required className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 outline-none transition-all font-medium"/>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full btn-premium py-5 mt-6 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-cyan-600/20 group relative overflow-hidden">
                <span className="relative z-10">{isLoading ? 'Processing Registration...' : 'Complete Admin Enrollment'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <button 
                onClick={() => navigate('/admin')}
                className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                ← Existing Administrator Login
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-600 text-[10px] mt-8 font-black uppercase tracking-[0.2em]">
          Classified Protocol • Unauthorized registration attempts logged
        </p>
      </div>
    </div>
  );
};

export default AdminRegisterPage;