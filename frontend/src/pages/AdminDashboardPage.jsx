import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('manageUsers');
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]); // ✅ State for records

  const [docFormData, setDocFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    fees: '',
    image: ''
  });

  // ✅ Updated state for the medicine form to include category
  const [medFormData, setMedFormData] = useState({
    name: '', manufacturer: '', price: '', stock: '', category: '',
  });

  // ✅ New state to hold the selected image file
  const [imageFile, setImageFile] = useState(null);

  // Fetch all data including records
  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, medicinesRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/medicines'),
        axios.get('http://localhost:5000/api/records/all', { headers }) // ✅ Fetch records
      ]);

      setUsers(usersRes.data);
      setMedicines(medicinesRes.data);
      setRecords(recordsRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // ✅ Handler to update claim status
  const updateClaimStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/records/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Claim ${status} successfully!`);
      fetchAllData(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const onDocFormChange = (e) => setDocFormData({ ...docFormData, [e.target.name]: e.target.value });
  const onMedFormChange = (e) => setMedFormData({ ...medFormData, [e.target.name]: e.target.value });
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User deleted.");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctors/add', docFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Doctor added successfully!");
      fetchAllData();
      setDocFormData({ name: '', specialization: '', experience: '', fees: '', image: '' });
    } catch (error) {
      toast.error("Failed to add doctor.");
    }
  };

  // ✅ Rewritten function to handle file uploads
  const handleAddMedicine = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', medFormData.name);
    formData.append('manufacturer', medFormData.manufacturer);
    formData.append('price', medFormData.price);
    formData.append('stock', medFormData.stock);
    formData.append('category', medFormData.category);
    formData.append('image', imageFile); // Append the image file

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/medicines', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Medicine added successfully!");
      fetchAllData();
      // Reset form and file input
      setMedFormData({ name: '', manufacturer: '', price: '', stock: '', category: '' });
      setImageFile(null);
      e.target.reset(); // Resets the file input field
    } catch (error) {
      toast.error("Failed to add medicine.");
    }
  };

  const patients = users.filter(user => user.role === 'patient');
  const doctors = users.filter(user => user.role === 'doctor');

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-8">
        <button onClick={() => setActiveTab('manageUsers')} className={`px-4 py-2 rounded ${activeTab === 'manageUsers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Manage Users</button>
        <button onClick={() => setActiveTab('addDoctor')} className={`px-4 py-2 rounded ${activeTab === 'addDoctor' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Add Doctor</button>
        <button onClick={() => setActiveTab('manageMedicines')} className={`px-4 py-2 rounded ${activeTab === 'manageMedicines' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Manage Medicines</button>
        <button onClick={() => setActiveTab('manageClaims')} className={`px-4 py-2 rounded ${activeTab === 'manageClaims' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Manage Claims</button>
      </div>
      <div>
        {/* ... (Manage Users and Add Doctor tabs are the same) ... */}

        {activeTab === 'manageMedicines' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Medicine Inventory ({medicines.length})</h2>
              {/* ... (Medicine list table is the same) ... */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Add New Medicine</h2>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                <input type="text" name="name" value={medFormData.name} onChange={onMedFormChange} placeholder="Medicine Name" required className="w-full px-3 py-2 border rounded" />
                <input type="text" name="manufacturer" value={medFormData.manufacturer} onChange={onMedFormChange} placeholder="Manufacturer" required className="w-full px-3 py-2 border rounded" />
                <input type="number" name="price" value={medFormData.price} onChange={onMedFormChange} placeholder="Price" required className="w-full px-3 py-2 border rounded" />
                <input type="number" name="stock" value={medFormData.stock} onChange={onMedFormChange} placeholder="Stock Quantity" required className="w-full px-3 py-2 border rounded" />
                <input type="text" name="category" value={medFormData.category} onChange={onMedFormChange} placeholder="Category (e.g., Pain Relief)" required className="w-full px-3 py-2 border rounded" />

                {/* ✅ New file input for the image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                    className="w-full mt-1"
                  />
                </div>

                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Add Medicine</button>
              </form>
            </div>
          </div>
        )}

        {/* ✅ New Claims Management Tab */}
        {activeTab === 'manageClaims' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Insurance Claims & Medical Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3">User</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Document</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{record.user?.name || 'Unknown'}</td>
                      <td className="p-3">{record.title}</td>
                      <td className="p-3">{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View File</a>
                      </td>
                      <td className="p-3 space-x-2">
                        {record.status === 'Pending' && (
                          <>
                            <button onClick={() => updateClaimStatus(record._id, 'Approved')} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Approve</button>
                            <button onClick={() => updateClaimStatus(record._id, 'Rejected')} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Reject</button>
                          </>
                        )}
                        {record.status !== 'Pending' && <span className="text-gray-400 text-sm">No actions</span>}
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No claims found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default AdminDashboardPage;