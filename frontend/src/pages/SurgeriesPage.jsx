import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Helper for surgery icons
const surgeryIcons = {
  "Piles Treatment": "https://images.ctfassets.net/a5lr4xmo2i3k/3Le0YfXevQpqYFtvRZ1fBr/6d86f7bbcca555ed4a89a9e3f339a99c/Non-surgical_Piles.webp?w=112&h=112",
  "Hernia Repair": "https://images.ctfassets.net/a5lr4xmo2i3k/4MAcEA0Cz3k9mZnS5ego91/8a804348cbea017254a1e3446cba10e1/Hernia.webp?w=112&h=112",
  "Kidney Stone Removal": "https://images.ctfassets.net/a5lr4xmo2i3k/3eEa1FqZiLplzeGXCa7CAb/433388a7b09bd775d545873ca8cad14f/Kidney_stone.webp?w=112&h=112",
  "Cataract Surgery": "https://images.ctfassets.net/a5lr4xmo2i3k/6aZT99IFOsh4OpFAksjes1/bd47eb4fc5bfe9f2b5b381818fb11143/Cataract_20_1_.webp?w=112&h=112",
  "Circumcision": "https://images.ctfassets.net/a5lr4xmo2i3k/22oYBv0FAeYQiPGdXW7sYE/75a2e9c2abd99b76ce82248bef4a40f5/Circumcision_1.webp?w=112&h=112",
  // Add more here to match your data
};

const SurgeriesPage = () => {
  const { isAuthenticated } = useAuth();
  const [surgeries, setSurgeries] = useState([]);
  const [formData, setFormData] = useState({
    ailment: '',
    contactNumber: '',
    city: '',
    age: '',
    gender: '',
  });

  // Fetch all surgeries
  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/surgeries');
        setSurgeries(data);
      } catch (error) {
        console.error("Failed to fetch surgeries", error);
      }
    };
    fetchSurgeries();
  }, []);

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
          surgeryId: formData.ailment, 
          contactNumber: formData.contactNumber,
          city: formData.city,
          age: formData.age,
          gender: formData.gender,
          advanceAmount: 500 // Fixed advance amount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Consultation request sent successfully!');
      setFormData({ ailment: '', contactNumber: '', city: '', age: '', gender: '' }); // Reset form
    } catch (error) {
      toast.error('Failed to book consultation.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-2 text-center">Experts in Surgical Solutions</h1>
      <p className="text-gray-600 mb-12 text-center">For 50+ ailments</p>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Popular Surgeries */}
        <div className="lg:col-span-2 p-8 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-6">Popular Surgeries</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 text-center">
            {surgeries.map((surgery) => (
              <Link
                to={`/surgeries/${surgery._id}`}
                key={surgery._id}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={surgeryIcons[surgery.name] || 'https://via.placeholder.com/80'}
                  alt={surgery.name}
                  className="w-20 h-20 object-contain"
                />
                <span className="mt-2 text-sm font-medium">{surgery.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="p-8 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-6">Book your consultation</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            {/* Ailment Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Ailment*</label>
              <select
                name="ailment"
                value={formData.ailment}
                onChange={onChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>Select a surgery</option>
                {surgeries.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number*</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={onChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
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
                placeholder="Enter your city"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
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
                  placeholder="Your age"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Book Appointment (Advance: ₹500)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurgeriesPage;
