import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { openLoginModal, openRegisterModal } = useModal();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300">
      <div className="container mx-auto">
        <div className="glass px-6 py-3 rounded-2xl flex justify-between items-center bg-white/80">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white text-xl">🩺</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
              SmartHealth
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/find-doctors" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Find Doctors</Link>
                <Link to="/medicines" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Medicines</Link>
                <Link to="/surgeries" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Surgeries</Link>
                <Link to="/symptom-checker" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Symptom Checker</Link>
                <Link to="/nutrition-scanner" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Nutrition AI</Link>
                <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">My Dashboard</Link>

                <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-all">
                  <span className="text-xl">🛒</span>
                  {cart && cart.items.length > 0 && (
                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                      {cart.items.length}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegisterModal}
                  className="btn-premium flex items-center space-x-2"
                >
                  <span>Join SmartHealth</span>
                  <span className="text-lg">→</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon (Simplified for now) */}
          <div className="lg:hidden">
            <button className="text-2xl text-slate-600">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;