import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorProfilePage = () => {
  const { id } = useParams(); // Gets the doctor's ID from the URL
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/${id}`);
        setDoctor(docRes.data);

        const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error('Failed to fetch doctor details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full font-black"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center mt-20 font-black text-slate-400">Doctor not found.</div>;
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column: Doctor Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium p-8 text-center bg-white shadow-2xl shadow-slate-200/50">
              <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-1 mb-6 shadow-xl shadow-indigo-100">
                <div className="w-full h-full bg-white rounded-[22px] overflow-hidden flex items-center justify-center">
                  {doctor.profilePicture ? (
                    <img src={doctor.profilePicture} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-indigo-600">{doctor.name?.charAt(0)}</span>
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{doctor.name}</h1>
              <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 mb-4">{doctor.specialty}</p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                 <span className="text-amber-400 text-lg">★</span>
                 <span className="text-xl font-black text-slate-900">{averageRating}</span>
                 <span className="text-slate-400 text-[10px] font-bold">({reviews.length} Patient Feedback)</span>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600">🎓</span>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                    <p className="text-xs font-bold text-slate-700">{doctor.experience || '10+'} Years+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600">🏦</span>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                    <p className="text-xs font-bold text-slate-700">₹{doctor.consultationFee || 500}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-10">
            <div className="card-premium p-10 bg-white shadow-2xl shadow-slate-200/50">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Clinical Biography</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                {doctor.bio || 'Dr. ' + doctor.name + ' is a highly qualified ' + doctor.specialty + ' dedicated to providing exceptional patient care with a focused clinical approach.'}
              </p>

              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Qualifications</h3>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed whitespace-pre-line">
                    {doctor.qualifications || 'MBBS, MD'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Protocol</h3>
                  <p className="text-slate-700 font-bold text-sm">{doctor.location || 'Chennai Clinical Hub'}</p>
                  <p className="text-slate-400 font-medium text-xs mt-1 italic">Verified Professional Account</p>
                </div>
              </div>
            </div>

            {/* Patient Feedback Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Patient Veracity</h2>
                <div className="h-px flex-1 bg-slate-100 mx-6"></div>
              </div>

              {reviews.length > 0 ? (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="card-premium p-6 bg-white hover:border-indigo-100 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-indigo-600 text-xs border border-slate-100 overflow-hidden">
                             {review.patient?.profilePicture ? (
                               <img src={review.patient.profilePicture} alt="" className="w-full h-full object-cover" />
                             ) : (
                               review.patient?.name?.charAt(0) || '👤'
                             )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{review.patient?.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="text-xs font-black text-amber-700">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-premium py-12 text-center border-dashed border-2 border-slate-100 bg-white/30">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No patient feedback available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;