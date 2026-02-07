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
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4 text-teal-700">AI Nutrition Scanner</h1>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Upload a photo of your meal to get an instant nutritional breakdown.
                    Our AI analyzes the food and estimates calories, macronutrients, and more.
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-start text-left">

                    {/* Upload Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-semibold mb-4">Upload Food Photo</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p>Click or drag to upload an image</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={isLoading || !selectedImage}
                            className="w-full mt-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Analyzing...' : 'Scan NuTrition'}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border h-full">
                        <h2 className="text-xl font-semibold mb-4">Nutritional Info</h2>

                        {nutritionData ? (
                            <div className="animate-fade-in">
                                <div className="mb-6 pb-4 border-b">
                                    <h3 className="text-2xl font-bold text-gray-800">{nutritionData.category?.name || 'Unknown Food'}</h3>
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mt-2">
                                        Confidence: {(nutritionData.category?.probability * 100).toFixed(1)}%
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 uppercase font-bold">Calories</p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {nutritionData.nutrition?.calories?.value} {nutritionData.nutrition?.calories?.unit}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 uppercase font-bold">Protein</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {nutritionData.nutrition?.protein?.value}{nutritionData.nutrition?.protein?.unit}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 uppercase font-bold">Carbs</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {nutritionData.nutrition?.carbs?.value}{nutritionData.nutrition?.carbs?.unit}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 uppercase font-bold">Fats</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {nutritionData.nutrition?.fat?.value}{nutritionData.nutrition?.fat?.unit}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-6 text-xs text-center text-gray-400">
                                    * Values are estimates based on visual analysis.
                                </p>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p>Upload an image to see results here</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NutritionScannerPage;
