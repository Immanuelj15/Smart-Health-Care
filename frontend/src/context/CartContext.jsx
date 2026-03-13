import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { isAuthenticated } = useAuth();

  const getCart = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
    } catch (error) {
      setCart({ items: [] }); // Set an empty cart on error
    }
  };

  const addToCart = async (medicineId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`,
        { medicineId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart.');
    }
  };
  
  // ✅ This function was missing
  const updateQuantity = async (medicineId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/cart/update`, 
        { medicineId, quantity }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data);
    } catch (error) { 
      toast.error('Failed to update quantity.');
    }
  };
  
  // ✅ This function was missing
  const removeFromCart = async (medicineId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${medicineId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setCart(data);
      toast.success('Item removed from cart!');
    } catch (error) { 
      toast.error('Failed to remove item.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ cart, getCart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};