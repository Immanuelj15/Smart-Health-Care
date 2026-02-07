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
    <nav className="p-4 shadow bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-2xl font-bold text-blue-600">
          SmartHealth
        </Link>
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/find-doctors" className="font-semibold hover:text-blue-600">Find Doctors</Link>
              <Link to="/medicines" className="font-semibold hover:text-blue-600">Medicines</Link>
              <Link to="/surgeries" className="font-semibold hover:text-blue-600">Surgeries</Link>
              <Link to="/symptom-checker" className="font-semibold hover:text-blue-600">Symptom Checker</Link>
              <Link to="/nutrition-scanner" className="font-semibold hover:text-blue-600">Nutrition AI</Link>
              <Link to="/dashboard" className="font-semibold hover:text-blue-600">My Dashboard</Link>
              <Link to="/cart" className="relative">
                <span role="img" aria-label="cart">🛒</span>
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              <button onClick={logout} className="px-4 py-2 font-medium text-white bg-red-500 rounded-md">Logout</button>
            </>
          ) : (
            <>
              <button onClick={openLoginModal} className="font-semibold hover:text-blue-600">Login</button>
              <button onClick={openRegisterModal} className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;