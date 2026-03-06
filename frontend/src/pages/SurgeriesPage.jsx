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
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
            Specialized Surgical Care
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Experts in <span className="text-gradient">Surgical Solutions.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            Precision healthcare for 50+ specialized ailments. Our surgical network features top-tier doctors and state-of-the-art facilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Popular Surgeries */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="card-premium bg-white shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vetted Specialties</h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed Centers</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {surgeries.map((surgery) => (
                  <Link
                    to={`/surgeries/${surgery._id}`}
                    key={surgery._id}
                    className="group flex flex-col items-center p-6 rounded-[32px] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100"
                  >
                    <div className="w-24 h-24 bg-white rounded-3xl p-4 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-xl group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img
                        src={surgeryIcons[surgery.name] || 'https://via.placeholder.com/80'}
                        alt={surgery.name}
                        className="w-full h-full object-contain relative z-10"
                      />
                    </div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter text-center group-hover:text-indigo-600 transition-colors">{surgery.name}</span>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Protocol</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="card-premium bg-slate-900 border-none shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>

              <h2 className="text-2xl font-black tracking-tight mb-10 border-b border-white/5 pb-6">Consultation <span className="text-cyan-400">Request.</span></h2>

              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Ailment</label>
                  <select
                    name="ailment"
                    value={formData.ailment}
                    onChange={onChange}
                    required
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white appearance-none"
                  >
                    <option value="" disabled className="bg-slate-900">Select Clinical Category</option>
                    {surgeries.map(s => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secure Contact</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={onChange}
                    required
                    placeholder="+91 Matrix ID"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Residential Region</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onChange}
                    required
                    placeholder="City Coordinates"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Patient Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={onChange}
                      required
                      placeholder="Years"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={onChange}
                      required
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white appearance-none"
                    >
                      <option value="" disabled className="bg-slate-900">Select</option>
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 btn-premium font-black tracking-widest bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-2xl shadow-indigo-600/20 mt-6 active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <span>🩺</span>
                  <span>INITIATE BOOKING</span>
                </button>

                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  ₹500 clinical advance required to lock schedule
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeriesPage;
