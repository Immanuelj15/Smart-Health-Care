import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PatientBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/consultations/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
            doctorId: selectedBooking.doctor._id,
            consultationId: selectedBooking._id,
            rating,
            comment
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Feedback submitted. Thank you!");
        setShowReviewModal(false);
        setRating(5);
        setComment('');
        fetchBookings(); // Refresh to hide review button if needed (backend handles unique check)
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
              Patient Portal
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Consultations</h1>
            <p className="text-slate-500 font-medium mt-1">Track and manage your upcoming and past medical appointments.</p>
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
                                {booking.surgery?.name || `Dr. ${booking.doctor?.name || 'General Physician'}`}
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
                        <td className="px-6 py-6 text-right space-x-2">
                           {booking.status === 'Completed' && (
                             <button 
                               onClick={() => {setSelectedBooking(booking); setShowReviewModal(true);}}
                               className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-lg shadow-indigo-100/50"
                             >
                                Rate Experience
                             </button>
                           )}
                          <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-100">✨</div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">How was Dr. {selectedBooking?.doctor?.name}?</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Professional Feedback Loop</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3 text-center">Your Rating</label>
                   <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-3xl transition-all hover:scale-125 ${rating >= star ? 'text-amber-400 drop-shadow-md' : 'text-slate-200 opacity-50'}`}
                        >
                          ★
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Detailed Comments</label>
                    <textarea 
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 resize-none shadow-inner"
                      placeholder="Share your experience with the diagnostic process, doctor's communication, and clinic protocols..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all font-outfit"
                    >
                        Dismiss
                    </button>
                    <button 
                      disabled={submitting}
                      type="submit" 
                      className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Post Visibility'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
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