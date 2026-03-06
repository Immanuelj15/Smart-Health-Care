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
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          <div className="lg:col-span-3">
            <div className="card-premium bg-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8 pl-4 flex items-center gap-3">
                <span className="text-2xl">📋</span> Patient Protocol
              </h2>

              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secure Contact</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={onChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Region</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={onChange}
                      placeholder="Enter Residential City"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Patient Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={onChange}
                      placeholder="Years"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Biological Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={onChange}
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="" disabled>Select Matrix</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={onChange}
                    placeholder="Briefly describe your manifestation..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 resize-none shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-premium py-5 font-black tracking-widest bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>🔐</span>
                  <span>Confirm and Secure Slot</span>
                </button>

                <p className="text-center text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Matrix Secured Transaction • ₹500 Advance Required</p>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card-premium bg-slate-900 border-none shadow-2xl shadow-indigo-900/20 text-white p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-widest text-indigo-400 uppercase mb-8">Consultation Support</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <span className="text-2xl">🛰️</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">Virtual Link Available</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">High-def video consultation ready</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">Verified Specialist</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Certified clinical professionals</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-2xl">⌛</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">Zero-wait Protocol</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Confirmed priority scheduling</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium bg-white border-dashed border-2 border-indigo-100 flex flex-col items-center text-center p-8">
              <p className="text-slate-500 font-medium text-sm mb-6">Joining an existing session?</p>
              <button
                onClick={() => navigate(`/video-call/room-${Math.floor(Math.random() * 1000)}`)}
                className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-6 py-3 rounded-2xl transition-all border border-indigo-100 flex items-center gap-3"
              >
                <span>📹</span> Join Stream Room
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;