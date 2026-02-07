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
    <div className="container mx-auto py-10">
      {/* Search Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Find and Book the Best Care</h1>
        <p className="text-lg text-gray-600 mb-8">Search for doctors, clinics, and hospitals near you.</p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex">
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a city to search for doctors..."
              className="w-full p-4 border rounded-l-lg shadow-sm"
            />
            <button type="submit" className="px-6 py-4 text-white bg-blue-600 rounded-r-lg">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Feature Cards Section */}
      <div className="grid max-w-4xl gap-8 mx-auto text-center md:grid-cols-3 pb-20">
        <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Instant Video Consultation</h3>
            <p className="mt-2 text-gray-500">Connect within 60 secs</p>
        </div>
        <button 
          onClick={() => searchInputRef.current.focus()} 
          className="p-6 text-center border rounded-lg shadow-lg hover:bg-gray-50"
        >
            <h3 className="text-xl font-semibold">Find Doctors Near You</h3>
            <p className="mt-2 text-gray-500">Confirmed appointments</p>
        </button>
        <Link to="/surgeries" className="block p-6 text-center border rounded-lg shadow-lg hover:bg-gray-50">
            <h3 className="text-xl font-semibold">Surgeries</h3>
            <p className="mt-2 text-gray-500">Safe and trusted surgery centers</p>
        </Link>
      </div>
    </div>
  );
};

export default FindDoctorPage;