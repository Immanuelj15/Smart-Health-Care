import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // ✅ Import Link
import axios from 'axios';

// A single Doctor Card component
const DoctorCard = ({ doctor }) => (
  <div className="flex items-center p-4 mb-4 bg-white border rounded-lg shadow-sm">
    <div className="ml-4 flex-grow">
      <h2 className="text-xl font-bold text-blue-600">{doctor.name}</h2>
      <p className="text-gray-600">{doctor.specialty}</p>
      <p className="text-gray-500 text-sm">{doctor.experience} years experience</p>
      <p className="text-gray-500 text-sm">{doctor.location}</p>
    </div>
    <div className="text-right">
      {/* ✅ This now links to the booking page */}
      <Link
        to={`/book-appointment/${doctor._id}`}
        className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Book Clinic Visit
      </Link>
    </div>
  </div>
);

const DoctorSearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/doctors/search?location=${location}`);
        setDoctors(res.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [location]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Showing results for doctors in <span className="text-blue-600">{location}</span>
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : doctors.length > 0 ? (
        doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)
      ) : (
        <p>No doctors found in this location.</p>
      )}
    </div>
  );
};

export default DoctorSearchResultsPage;
