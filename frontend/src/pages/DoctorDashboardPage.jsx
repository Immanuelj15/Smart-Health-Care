import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ New state for the AI assistant
  const [aiNotes, setAiNotes] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // ✅ Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors/my-appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      toast.error("Could not fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update appointment status
  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/doctors/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${status.toLowerCase()}!`);
      fetchAppointments(); // Refresh after update
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // ✅ AI Assistant function
  const handleAiAssist = async (e) => {
    e.preventDefault();
    setIsAiLoading(true);
    setAiResult('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/ai/doctor-assist',
        { notes: aiNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResult(data.result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get AI assistance.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto py-10 grid lg:grid-cols-3 gap-8">
      {/* 🩺 Appointments Section (Left Side) */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold mb-8">My Appointments</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Patient Name</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">Date Booked</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="px-6 py-4">{appt.patientName}</td>
                    <td className="px-6 py-4">{appt.contactNumber}</td>
                    <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{appt.status}</td>
                    <td className="px-6 py-4 space-x-2">
                      {appt.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Confirmed')}
                          className="px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                          className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You have no upcoming appointments.</p>
          )}
        </div>
      </div>

      {/* 🤖 AI Assistant Section (Right Side) */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">AI Diagnosis Assistant</h2>
        <form onSubmit={handleAiAssist}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Symptoms & Notes
          </label>
          <textarea
            value={aiNotes}
            onChange={(e) => setAiNotes(e.target.value)}
            placeholder="e.g., 45-year-old male presents with chest pain, shortness of breath..."
            className="w-full h-40 p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={isAiLoading}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            {isAiLoading ? 'Analyzing...' : 'Get AI Assistance'}
          </button>
        </form>

        {aiResult && (
          <div className="mt-6 border-t pt-4 text-left whitespace-pre-wrap">
            <h3 className="text-lg font-semibold mb-2">Suggestions:</h3>
            <p className="text-sm text-gray-700">{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
