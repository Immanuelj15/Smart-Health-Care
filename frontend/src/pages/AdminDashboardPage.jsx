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
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Manage users, doctors, medicines, and insurance claims.</p>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold text-sm">
            <span>🛡️</span>
            <span>System Administrator</span>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-2 mb-10 overflow-x-auto pb-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
          {[
            { id: 'manageUsers', label: 'Users', icon: '👥' },
            { id: 'addDoctor', label: 'Add Doctor', icon: '👨‍⚕️' },
            { id: 'manageMedicines', label: 'Medicines', icon: '💊' },
            { id: 'manageClaims', label: 'Claims', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-md scale-105'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'manageUsers' && (
            <div className="card-premium">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                <div className="bg-slate-50 px-4 py-2 rounded-lg text-slate-600 font-bold text-sm">Total: {users.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-wider">User Info</th>
                      <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Role</th>
                      <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Joined</th>
                      <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(user => (
                      <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'doctor' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-500 font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'manageMedicines' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 card-premium">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Medicine Inventory</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {medicines.map(med => (
                    <div key={med._id} className="p-4 border border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-indigo-100 transition-colors">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                        <img src={med.imageUrl || '/images/default-med.png'} alt={med.name} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.category}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-indigo-600 font-bold">₹{med.price}</p>
                          <p className={`text-[10px] font-bold px-2 py-0.5 rounded ${med.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Stock: {med.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-premium h-fit border-indigo-100 shadow-indigo-100/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Medicine</h2>
                <form onSubmit={handleAddMedicine} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                    <input type="text" name="name" value={medFormData.name} onChange={onMedFormChange} placeholder="Paracetamol" required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price</label>
                      <input type="number" name="price" value={medFormData.price} onChange={onMedFormChange} placeholder="₹0.00" required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stock</label>
                      <input type="number" name="stock" value={medFormData.stock} onChange={onMedFormChange} placeholder="0" required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Image</label>
                    <div className="relative group">
                      <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} required className="w-full px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-premium py-4 shadow-lg shadow-indigo-200 mt-2">Add to Inventory</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'manageClaims' && (
            <div className="card-premium">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Medical Insurance Claims</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 font-bold text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-4">Patient</th>
                      <th className="pb-4">Claim Details</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {records.map(record => (
                      <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-slate-900">{record.user?.name || 'Unknown User'}</td>
                        <td className="py-4">
                          <p className="font-bold text-slate-700">{record.title}</p>
                          <p className="text-xs text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${record.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            record.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg inline-block transition-all">📄 View</a>
                          {record.status === 'Pending' && (
                            <div className="inline-flex space-x-1">
                              <button onClick={() => updateClaimStatus(record._id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Approve">✅</button>
                              <button onClick={() => updateClaimStatus(record._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Reject">❌</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;