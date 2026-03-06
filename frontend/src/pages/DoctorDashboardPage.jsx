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
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-widest mb-3">
              Doctor Dashboard
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Clinical Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your patients, appointments, and AI-assisted diagnoses.</p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl">👨‍⚕️</div>
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Dr. Sarah Jenkins</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Cardiologist</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* 🩺 Appointments Section */}
          <div className="lg:col-span-2 card-premium !p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/50">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-slate-900">Today's Appointments</h2>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{appointments.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing medical vault...</p>
                </div>
              ) : appointments.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {appointments.map((appt) => (
                      <tr key={appt._id} className="group hover:bg-slate-50/30 transition-all duration-300">
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                              {appt.patientName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{appt.patientName}</p>
                              <p className="text-xs text-slate-500 font-medium">{appt.contactNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              appt.status === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 font-bold text-slate-500 text-sm">
                          {new Date(appt.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-6 text-right space-x-2">
                          {appt.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusUpdate(appt._id, 'Confirmed')}
                              className="px-4 py-2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                              className="px-4 py-2 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              Complete
                            </button>
                          )}
                          {appt.status === 'Completed' && <span className="text-[10px] font-black text-slate-300 uppercase">Archived</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-24 text-center">
                  <div className="text-4xl mb-4">💤</div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries for today</p>
                </div>
              )}
            </div>
          </div>

          {/* 🤖 AI Assistant Section */}
          <div className="card-premium h-fit border-indigo-100 bg-white shadow-2xl shadow-indigo-100/30">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200">🤖</div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Diagnostic</h2>
            </div>

            <form onSubmit={handleAiAssist} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Symptoms & Clinical Notes
                </label>
                <textarea
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Describe patient condition in detail..."
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAiLoading}
                className="w-full btn-premium py-4 flex items-center justify-center gap-3"
              >
                {isAiLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : '⚡ Run Analysis'}
              </button>
            </form>

            {aiResult && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>AI Suggestions</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded">98% Match</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{aiResult}</p>
                <button className="w-full mt-6 py-3 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-white transition-all uppercase tracking-widest">Append to file</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
