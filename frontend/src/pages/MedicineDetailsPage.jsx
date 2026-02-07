import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const MedicineDetailsPage = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/medicines/${id}`);
        setMedicine(data);
      } catch (error) {
        toast.error("Could not fetch medicine details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!medicine) return <div className="text-center py-10">Medicine not found.</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
        {/* Left Column: Image and Price */}
        <div>
          <div className="border rounded-lg p-4 flex justify-center items-center h-96">
            <img src={medicine.imageUrl} alt={medicine.name} className="max-h-full max-w-full object-contain"/>
          </div>
          <div className="mt-6 text-center">
             <p className="text-3xl font-bold">₹{medicine.price.toFixed(2)}</p>
             <button onClick={() => addToCart(medicine._id)} className="w-full mt-4 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600">
                Add to Cart
             </button>
          </div>
        </div>

        {/* Right Column: Details */}
        <div>
          <h1 className="text-4xl font-bold">{medicine.name}</h1>
          <p className="text-md text-gray-500 mt-2">Manufactured by {medicine.manufacturer}</p>
          <p className="text-md text-blue-600 font-semibold mt-1">Contains: {medicine.contains}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold border-b pb-2">Description</h2>
            <p className="mt-4 text-gray-700">{medicine.description}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold border-b pb-2">Side Effects</h2>
            <p className="mt-4 text-gray-700">{medicine.sideEffects}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold border-b pb-2">Usage</h2>
            <p className="mt-4 text-gray-700">{medicine.usageInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailsPage;