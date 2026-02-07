import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', secretKey: '' });
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register/admin', formData);
      toast.success('Admin registration successful! Please log in.');
      navigate('/login'); // Redirect to general login page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Registration</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" onChange={onChange} required className="w-full p-3 border rounded"/>
          <input type="email" name="email" placeholder="Email Address" onChange={onChange} required className="w-full p-3 border rounded"/>
          <input type="password" name="password" placeholder="Password" onChange={onChange} required className="w-full p-3 border rounded"/>
          <input type="password" name="secretKey" placeholder="Secret Registration Key" onChange={onChange} required className="w-full p-3 border rounded"/>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">Register Admin</button>
        </form>
      </div>
    </div>
  );
};
export default AdminRegisterPage;