import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorProfilePage = () => {
  const { id } = useParams(); // Gets the doctor's ID from the URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (error) {
        console.error('Failed to fetch doctor details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (!doctor) {
    return <div className="text-center mt-10">Doctor not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600">{doctor.name}</h1>
        <p className="text-xl text-gray-600 mt-2">{doctor.specialty}</p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Biography</h2>
          <p className="mt-4 text-gray-700">{doctor.bio || 'No biography available.'}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Qualifications</h2>
          <p className="mt-4 text-gray-700">{doctor.qualifications || 'No qualifications listed.'}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;