import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactNumber: '',
    city: '',
    age: '',
    gender: '',
    notes: '',
  });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to book an appointment.");
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/consultations/book',
        {
          doctorId,
          ...formData,
          advanceAmount: 500
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to book appointment.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-xl mx-auto border rounded-lg p-8 shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Your Appointment</h2>
        <form onSubmit={handleBooking} className="space-y-4">

          {/* ✅ This is the section that was missing */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number*</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={onChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Age*</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={onChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Gender*</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={onChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* End of missing section */}

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold">
            Confirm Booking (Advance: ₹500)
          </button>
        </form>

        {/* Quick Link for Testing Video Call */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-2">Joining a scheduled consultation?</p>
          <button
            onClick={() => navigate(`/video-call/room-${Math.floor(Math.random() * 1000)}`)}
            className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            <span>📹</span> Join Video Consultation Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;