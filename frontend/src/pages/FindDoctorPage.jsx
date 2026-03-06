import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FindDoctorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors/search?location=${searchQuery.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Search Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
            Global Medical Network
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find and Book the <span className="text-gradient">Best Care.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg mb-12">
            Search for certified doctors, specialized clinics, and modern hospitals within your metropolitan area.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex bg-white rounded-[30px] p-2 shadow-2xl shadow-slate-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or clinical region (e.g. Bangalore)..."
                className="w-full p-5 pl-8 bg-transparent outline-none font-medium text-slate-700 placeholder:text-slate-300"
              />
              <button
                type="submit"
                className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
              >
                Scan Region
              </button>
            </div>
          </form>
        </div>

        {/* Feature Cards Section */}
        <div className="grid max-w-5xl gap-8 mx-auto md:grid-cols-3 pb-24">
          {[
            {
              title: 'Instant Link',
              desc: 'Video link in < 60s',
              icon: '📲',
              to: '/video-call/lobby'
            },
            {
              title: 'Regional Search',
              desc: 'Confirmed clinical slots',
              icon: '📍',
              action: () => searchInputRef.current.focus()
            },
            {
              title: 'Advanced Surgeries',
              desc: 'Certified surgery centers',
              icon: '🏥',
              to: '/surgeries'
            }
          ].map((feature, i) => (
            feature.to ? (
              <Link key={i} to={feature.to} className="card-premium group hover:border-indigo-100 bg-white transition-all duration-500 shadow-xl shadow-slate-200/40 text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">{feature.desc}</p>
              </Link>
            ) : (
              <button key={i} onClick={feature.action} className="card-premium group hover:border-indigo-100 bg-white transition-all duration-500 shadow-xl shadow-slate-200/40 text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">{feature.desc}</p>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindDoctorPage;