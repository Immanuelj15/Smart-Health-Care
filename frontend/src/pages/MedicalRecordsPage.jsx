import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/records/my-records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(data);
    } catch (error) {
      toast.error("Could not fetch records.");
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please select a file to upload.");
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('record', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/records/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      toast.success("Record uploaded successfully!");
      fetchRecords(); // Refresh the list
      setTitle('');
      setFile(null);
      e.target.reset();
    } catch (error) {
      toast.error("File upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              Secure Vault Protocol
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Medical <span className="text-gradient">Records Archive.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage your clinical documentation with end-to-end security encryption.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
              {records.length}
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Assets</p>
              <p className="text-xs font-bold text-slate-900 uppercase">Secured Files</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="card-premium bg-white shadow-2xl shadow-slate-200/40">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="text-2xl">📁</span> Cryptographic Repository
              </h2>
              <div className="space-y-4">
                {records.length > 0 ? records.map((record, i) => (
                  <div
                    key={record._id}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-500 border-dashed animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                        {record.title.toLowerCase().includes('report') ? '📊' : '📄'}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-sm">{record.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPLOADED {new Date(record.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SECURED</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium px-8 py-3 text-[10px] font-black tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all text-center sm:text-left"
                    >
                      DECRYPT & VIEW
                    </a>
                  </div>
                )) : (
                  <div className="text-center py-20 px-10 border-2 border-dashed border-slate-100 rounded-[40px]">
                    <div className="text-5xl mb-6">📭</div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No documentation detected in the current matrix.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="card-premium bg-white shadow-2xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>

              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="text-2xl">📤</span> Asset Ingestion
              </h2>

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Asset Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CARDIO_DIAGNOSTIC_REPORT"
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Media Payload (PDF/IMG)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl group-hover:border-indigo-500 transition-colors flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                      <span className="text-3xl">🧩</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {file ? file.name : 'Select clinical payload'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-premium py-5 font-black tracking-widest bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>ENCRYPTING Payloads...</span>
                    </>
                  ) : (
                    <>
                      <span>🔋</span>
                      <span>Push to Archive</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                  Matrix Secured • Protocol 256-bit AES
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MedicalRecordsPage;