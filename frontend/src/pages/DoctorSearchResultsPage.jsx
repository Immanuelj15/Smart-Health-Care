import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // ✅ Import Link
import axios from 'axios';

// A single Doctor Card component
const DoctorCard = ({ doctor }) => (
  <div className="card-premium group hover:border-indigo-100 bg-white transition-all duration-500 shadow-xl shadow-slate-200/40 p-6 flex flex-col md:flex-row items-center gap-8 mb-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:bg-indigo-50 transition-colors">
      👨‍⚕️
    </div>

    <div className="flex-grow text-center md:text-left">
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{doctor.name}</h2>
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 w-fit mx-auto md:mx-0">Verified Specialist</span>
      </div>
      <p className="text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-4">{doctor.specialty}</p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs">🏆</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{doctor.experience}Y EXPERIENCE</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs">📍</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{doctor.location}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 min-w-[200px]">
      <Link
        to={`/book-appointment/${doctor._id}`}
        className="btn-premium px-6 py-4 text-xs font-black tracking-widest text-center shadow-xl shadow-indigo-100 group-hover:scale-[1.02] transition-transform"
      >
        BOOK CONSULTATION
      </Link>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Available Tomorrow</p>
    </div>
  </div>
);

const DoctorSearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const specialty = searchParams.get('specialty'); // ✅ Defined specialty
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Build query string dynamically
        let query = `location=${location}`;
        if (specialty) query += `&specialty=${specialty}`;
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/search?${query}`);
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [location, specialty]); // ✅ Added specialty to dependency array

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
          <Link to="/find-doctors" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-2 mb-6">
            <span>← BACK TO SEARCH</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialists in <span className="text-gradient uppercase">{location}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Found {doctors.length} world-class medical professionals ready to assist you.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Medical Registry...</p>
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-6">
            {doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>
        ) : (
          <div className="card-premium bg-white border-dashed border-2 border-slate-200 text-center py-20 animate-in zoom-in duration-500">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Specialists Located</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">We couldn't find any doctors in "{location}" {specialty ? `specializing in ${specialty}` : ''} matching our premium criteria. Try searching for a nearby metropolitan area.</p>
            <Link to="/find-doctors" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
              Reset Search Filter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchResultsPage;
