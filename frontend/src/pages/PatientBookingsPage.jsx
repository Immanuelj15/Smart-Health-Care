import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// This is the component for the colored status badge
// StatusBadge is defined at the bottom for better organization


const PatientBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/consultations/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
              Patient Portal
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Consultations</h1>
            <p className="text-slate-500 font-medium mt-1">Track and manage your upcoming and past medical appointments.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-premium px-6 py-3 text-sm flex items-center gap-2 shadow-xl shadow-indigo-100">
              <span>📅</span>
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {loading ? (
            <div className="text-center py-20 card-premium">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing health data...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="card-premium overflow-hidden border-none shadow-2xl shadow-slate-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Consultation Details</th>
                      <th className="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Scheduled Date</th>
                      <th className="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                      <th className="px-6 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                              {booking.surgery ? '🏥' : '👨‍⚕️'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                {booking.surgery?.name || 'General Physician'}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {booking.surgery ? 'Procedure' : 'Primary Care'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-bold text-slate-600 text-sm">
                          {new Date(booking.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-6">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 card-premium border-dashed border-2 border-slate-100 bg-white/50">
              <div className="text-5xl mb-6">🗓️</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No appointments yet</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your health is our priority. Book your first consultation with our expert specialists today.</p>
              <button className="btn-premium">Explore Specialists</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Refined StatusBadge for Premium Look
const StatusBadge = ({ status }) => {
  const configs = {
    Pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '⏳' },
    Confirmed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '✅' },
    Completed: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '✨' },
    Cancelled: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: '✕' },
  };

  const config = configs[status] || { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '•' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${config.color}`}>
      <span>{config.icon}</span>
      <span>{status}</span>
    </span>
  );
};

export default PatientBookingsPage;