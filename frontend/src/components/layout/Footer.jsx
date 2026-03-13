import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { role } = useAuth();
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/register/admin') || role === 'admin') return null;

  return (
  <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-3xl">🛡️</span>
            <span className="text-2xl font-black text-white tracking-tighter italic">SmartHealth<span className="text-indigo-500">.</span></span>
          </div>
          <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
            Elevating healthcare through advanced AI diagnostics and seamless patient-doctor connectivity. Experience the future of medical wellness.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Resources</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Pharmacy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Specialists</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Articles</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Support</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Help Center</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Contact Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-indigo-400 font-bold text-xs transition-colors uppercase">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">&copy; 2026 SmartHealth Platforms Inc. All Rights Reserved.</p>
        <div className="flex space-x-6">
          {['Twitter', 'LinkedIn', 'Instagram'].map(platform => (
            <a key={platform} href="#" className="text-slate-500 hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-titles tracking-widest">{platform}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
    );
};
export default Footer;