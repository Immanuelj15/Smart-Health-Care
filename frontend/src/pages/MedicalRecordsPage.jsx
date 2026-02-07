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
      const { data } = await axios.get('http://localhost:5000/api/records/my-records', {
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
      await axios.post('http://localhost:5000/api/records/upload', formData, {
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
    <div className="container mx-auto py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Records</h2>
        <div className="space-y-4">
          {records.length > 0 ? records.map(record => (
            <div key={record._id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-semibold">{record.title}</p>
                <p className="text-sm text-gray-500">Uploaded on: {new Date(record.createdAt).toLocaleDateString()}</p>
              </div>
              <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold">View</a>
            </div>
          )) : <p>You have not uploaded any records yet.</p>}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-2xl font-semibold mb-4">Upload New Record</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Record Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Blood Test Report" required className="w-full mt-1 p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Select File (PDF, JPG, PNG)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="w-full mt-1"/>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded disabled:bg-gray-400">
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default MedicalRecordsPage;