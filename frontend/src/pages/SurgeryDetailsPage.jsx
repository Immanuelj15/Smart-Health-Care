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
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/surgeries/${id}`);
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
        `${import.meta.env.VITE_API_URL}/consultations/book`,
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

  if (!surgery) return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Clinical Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-16 items-start">

          {/* Left Column: Surgery Details */}
          <div className="lg:col-span-3 space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
                Clinical Protocol: {surgery.name.split(' ')[0]}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                {surgery.name} <span className="text-gradient">Optimization.</span>
              </h1>
              <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl">
                {surgery.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="card-premium bg-white shadow-xl shadow-slate-200/40 p-8 space-y-4">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Certified Specialists</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Operated by world-class surgeons with proven track records in {surgery.name.toLowerCase()}.</p>
              </div>
              <div className="card-premium bg-white shadow-xl shadow-slate-200/40 p-8 space-y-4 border-dashed">
                <span className="text-2xl">⚡</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Rapid Recovery</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Advanced minimally invasive techniques ensuring minimal downtime and maximum efficiency.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Booking Form */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="card-premium bg-slate-900 border-none shadow-2xl shadow-indigo-900/30 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-8 border-b border-white/5 pb-6">Consultation <span className="text-cyan-400">Lock.</span></h2>

                <form onSubmit={handleBooking} className="space-y-6">
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
                        <option value="" disabled className="bg-slate-900 text-slate-600">Select</option>
                        <option value="Male" className="bg-slate-900">Male</option>
                        <option value="Female" className="bg-slate-900">Female</option>
                        <option value="Other" className="bg-slate-900">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Manifestations</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={onChange}
                      placeholder="Brief summary of condition..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-24 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-medium text-white resize-none shadow-inner placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 btn-premium font-black tracking-widest bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-2xl shadow-indigo-600/20 mt-6 active:scale-95 transition-transform flex items-center justify-center gap-3"
                  >
                    <span>🦾</span>
                    <span>INITIATE PROTOCOL</span>
                  </button>

                  <p className="text-center text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Secured Transaction • ₹500 Clinical Deposit
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeryDetailsPage;
