import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NutritionScannerPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [nutritionData, setNutritionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setNutritionData(null); // Reset previous results
        }
    };

    const handleScan = async () => {
        if (!selectedImage) {
            return toast.error("Please select an image first.");
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/nutrition/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setNutritionData(data);
            toast.success("Analysis complete!");

        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                        AI Nutrition Analysis
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Smart <span className="text-gradient">Plate Scanner</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
                        Harnessing advanced computer vision to decode your meals. Get instant caloric breakdowns and macronutrient insights from a single photo.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Upload Section */}
                    <div className="card-premium group relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 pl-4">Capture Meal</h2>

                        <div
                            className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 group-hover:border-indigo-400 ${previewUrl ? 'border-transparent bg-slate-50' : 'border-slate-200 hover:bg-slate-50/50'
                                }`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {previewUrl ? (
                                <div className="relative group/preview">
                                    <img src={previewUrl} alt="Preview" className="max-h-80 mx-auto rounded-2xl shadow-2xl ring-4 ring-white" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                        <button className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm">Change Image</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tap to upload or drag & drop</p>
                                    <p className="text-slate-500 font-medium text-xs mt-2">JPG, PNG supported (max 5MB)</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={isLoading || !selectedImage}
                            className="w-full mt-10 btn-premium py-4 font-black tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Analyzing Matrix...</span>
                                </>
                            ) : (
                                <>
                                    <span>🛰️</span>
                                    <span>Analyze Nutrition</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="card-premium h-full min-h-[500px] flex flex-col bg-white border-l-4 border-l-cyan-500 shadow-2xl shadow-slate-200/50">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Nutritional Insights</h2>

                        {nutritionData ? (
                            <div className="animate-in fade-in duration-700 flex-1">
                                <div className="mb-10 pb-6 border-b border-slate-50">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{nutritionData.category?.name || 'Detected Meal'}</h3>
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            AI CONFIDENCE: {(nutritionData.category?.probability * 100).toFixed(1)}%
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                            VERIFIED SCAN
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Calories</p>
                                        <p className="text-4xl font-black text-slate-900">
                                            {nutritionData.nutrition?.calories?.value || 0}
                                            <span className="text-sm ml-1 text-slate-400 font-bold uppercase">{nutritionData.nutrition?.calories?.unit || 'kcal'}</span>
                                        </p>
                                    </div>

                                    {[
                                        { label: 'Protein', value: nutritionData.nutrition?.protein, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
                                        { label: 'Carbs', value: nutritionData.nutrition?.carbs, color: 'text-cyan-600', bg: 'bg-cyan-50/50' },
                                        { label: 'Fats', value: nutritionData.nutrition?.fat, color: 'text-rose-600', bg: 'bg-rose-50/50' }
                                    ].map((nut) => (
                                        <div key={nut.label} className={`p-6 ${nut.bg} rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500`}>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">{nut.label}</p>
                                            <p className={`text-2xl font-black ${nut.color}`}>
                                                {nut.value?.value || 0}
                                                <span className="text-xs ml-1 text-slate-400 font-bold uppercase">{nut.value?.unit || 'g'}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-4">
                                        <span className="text-xl">💡</span>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                                            Disclaimer: Nutritional values are estimated by our AI based on visual mapping. For precise medical tracking, always consult with your nutritionist.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-40">
                                <div className="w-24 h-24 mb-6 relative">
                                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
                                    <div className="relative w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl">🥗</div>
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for Meal Scan</p>
                                <div className="mt-4 flex gap-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionScannerPage;
