import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SurgeryDetailsPage = () => {
  const { id } = useParams();
  const [surgery, setSurgery] = useState(null);
  const { isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    contactNumber: '',
    city: '',
    age: '',
    gender: '',
    notes: '',
  });

  // Fetch surgery details
  useEffect(() => {
    const fetchSurgery = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/surgeries/${id}`);
        setSurgery(data);
      } catch (error) {
        console.error("Failed to fetch surgery details", error);
      }
    };
    fetchSurgery();
  }, [id]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to book a consultation.');
      return;
    }
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/consultations/book',
        { 
          surgeryId: id,
          ...formData,       // send contactNumber, city, age, gender, notes
          advanceAmount: 500 // fixed advance amount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Consultation booked successfully!');
      setFormData({ contactNumber: '', city: '', age: '', gender: '', notes: '' });
    } catch (error) {
      toast.error('Failed to book consultation.');
    }
  };

  if (!surgery) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10 grid md:grid-cols-2 gap-10">
      {/* Left Column: Surgery Details */}
      <div>
        <h1 className="text-4xl font-bold">{surgery.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{surgery.description}</p>
      </div>

      {/* Right Column: Detailed Booking Form */}
      <div className="border rounded-lg p-8 shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6">Book Your Consultation</h2>
        <form onSubmit={handleBooking} className="space-y-4">
          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number*</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={onChange}
              required
              className="w-full mt-1 input-style"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              required
              className="w-full mt-1 input-style"
            />
          </div>

          {/* Age & Gender */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Age*</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={onChange}
                required
                className="w-full mt-1 input-style"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Gender*</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={onChange}
                required
                className="w-full mt-1 input-style"
              >
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={onChange}
              className="w-full mt-1 p-2 border rounded"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            Book Now (Advance: ₹500)
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurgeryDetailsPage;
