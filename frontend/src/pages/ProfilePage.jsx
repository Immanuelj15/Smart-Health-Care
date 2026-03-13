import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { role } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData(res.data);
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
            // Append all fields to FormData
            Object.keys(formData).forEach(key => {
                if (key !== 'profilePicture') {
                    data.append(key, formData[key] || '');
                }
            });

            // Append image if present
            const fileInput = document.getElementById('profile-upload');
            if (fileInput.files[0]) {
                data.append('profilePicture', fileInput.files[0]);
            }

            await axios.put(`${import.meta.env.VITE_API_URL}/auth/update-profile`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full font-black"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                        Account Settings
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your personal information and clinical settings.</p>
                </div>

                <div className="card-premium p-8 md:p-12 relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <form onSubmit={handleSubmit} className="relative space-y-10">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-100">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl shadow-indigo-200 ring-4 ring-white relative flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-cyan-400">
                                    {profile.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-5xl font-black">{profile.name?.charAt(0) || '👤'}</span>
                                    )}
                                    
                                    {isEditing && (
                                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-black uppercase tracking-widest">Update</span>
                                        </label>
                                    )}
                                </div>
                                <input id="profile-upload" type="file" className="hidden" accept="image/*" />
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{profile.role}</p>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                   {!isEditing ? (
                                     <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                       Edit Information
                                     </button>
                                   ) : (
                                     <div className="flex gap-3">
                                        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">
                                            Save Updates
                                        </button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                                            Discard
                                        </button>
                                     </div>
                                   )}
                                </div>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Common Fields */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={formData.name || ''} 
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                  type="email" 
                                  name="email" 
                                  value={profile.email || ''} 
                                  disabled
                                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all opacity-60 cursor-not-allowed font-medium text-slate-700"
                                />
                                <p className="text-[9px] text-slate-400 ml-1 mt-1 font-bold italic">* Email cannot be changed for security</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <input 
                                  type="text" 
                                  name="mobileNumber" 
                                  value={formData.mobileNumber || ''} 
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="+91 00000-00000"
                                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700"
                                />
                            </div>

                            {/* Doctor Specific Fields */}
                            {role === 'doctor' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                                        <input 
                                          type="text" 
                                          name="specialty" 
                                          value={formData.specialty || ''} 
                                          onChange={handleChange}
                                          disabled={!isEditing}
                                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                                        <input 
                                          type="number" 
                                          name="experience" 
                                          value={formData.experience || ''} 
                                          onChange={handleChange}
                                          disabled={!isEditing}
                                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Clinic</label>
                                        <input 
                                          type="text" 
                                          name="location" 
                                          value={formData.location || ''} 
                                          onChange={handleChange}
                                          disabled={!isEditing}
                                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Biography</label>
                                        <textarea 
                                          name="bio" 
                                          rows="4"
                                          value={formData.bio || ''} 
                                          onChange={handleChange}
                                          disabled={!isEditing}
                                          placeholder="Talk briefly about your professional journey..."
                                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700 resize-none"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qualifications / Degrees</label>
                                        <textarea 
                                          name="qualifications" 
                                          rows="3"
                                          value={formData.qualifications || ''} 
                                          onChange={handleChange}
                                          disabled={!isEditing}
                                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-60 font-medium text-slate-700 resize-none"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Button (Legacy) - Keeping it for layout consistency or alternative trigger */}
                        {isEditing && (
                            <div className="pt-8 border-t border-slate-50 flex justify-end">
                                <button type="submit" className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                                    Commit Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
