import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // We hardcode the role as 'admin' when submitting
      const res = await axios.post('http://localhost:5000/api/auth/login', { ...formData, role: 'admin' });
      login(res.data);
      toast.success('Admin login successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto py-20">
       <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required className="w-full p-3 border rounded"/>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required className="w-full p-3 border rounded"/>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">Login</button>
        </form>
       </div>
    </div>
  );
};
export default AdminLoginPage;