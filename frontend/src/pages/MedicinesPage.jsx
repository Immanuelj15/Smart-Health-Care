import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// Dummy data for category images.
const categoryImages = {
  'All': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
  'Pain Relief': 'https://images.pexels.com/photos/5999828/pexels-photo-5999828.jpeg',
  'Immunity': 'https://images.pexels.com/photos/7692340/pexels-photo-7692340.jpeg',
  'Vitamins & Supplements': 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg',
  'Skin Care': 'https://images.pexels.com/photos/3762465/pexels-photo-3762465.jpeg',
  'Heart Care': 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
  'Diabetes Essentials': 'https://images.pexels.com/photos/6620956/pexels-photo-6620956.jpeg',
  'Baby Care': 'https://images.pexels.com/photos/3662843/pexels-photo-3662843.jpeg',
};

// This is the card for a single product in the main grid
const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart?.items.find(item => item.medicine._id === product._id);

  return (
     <Link to={`/medicines/${product._id}`}>
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between text-center hover:shadow-xl transition-shadow">
      <div>
        <div className="h-40 mb-4 bg-white rounded-md p-2 flex items-center justify-center">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain"/>
        </div>
        <h2 className="font-semibold text-md h-12">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-2">{product.manufacturer}</p>
      </div>
      <div>
        <p className="text-lg font-bold mt-2">₹{product.price.toFixed(2)}</p>
        {cartItem ? (
          <div className="flex items-center justify-center border rounded-md w-full mt-3">
            <button onClick={() => updateQuantity(product._id, cartItem.quantity - 1)} className="px-4 py-1 font-bold text-lg">-</button>
            <span className="px-4 py-1">{cartItem.quantity}</span>
            <button onClick={() => updateQuantity(product._id, cartItem.quantity + 1)} className="px-4 py-1 font-bold text-lg">+</button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="w-full mt-3 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400 font-semibold"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
    </Link>
  );
};

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/medicines');
        setMedicines(data);
        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to fetch medicines. Please ensure the backend server is running.');
        toast.error("Could not fetch medicines.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines
    .filter(med => selectedCategory === 'All' || med.category === selectedCategory)
    .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const categories = ['All', ...new Set(medicines.map(med => med.category))];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-teal-700 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Your Health, Delivered.</h1>
          <p className="text-lg mt-2 mb-6">Order medicines and health products online.</p>
          <div className="mt-6 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for Medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full p-4 border rounded-lg text-black"
            />
            {isSearchFocused && searchTerm.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-10">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map(med => {
                    const cartItem = cart?.items.find(item => item.medicine._id === med._id);
                    return (
                      <div key={med._id} className="flex items-center justify-between p-3 hover:bg-gray-100 border-b text-left">
                        <div className="flex items-center">
                          <img src={med.imageUrl} alt={med.name} className="w-12 h-12 object-contain mr-4"/>
                          <div>
                            <p className="font-semibold text-gray-800">{med.name}</p>
                            <p className="text-sm text-gray-500">₹{med.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {cartItem ? (
                            <div className="flex items-center border rounded-md">
                              <button onClick={() => updateQuantity(med._id, cartItem.quantity - 1)} className="px-3 py-1 font-bold text-lg">-</button>
                              <span className="px-3">{cartItem.quantity}</span>
                              <button onClick={() => updateQuantity(med._id, cartItem.quantity + 1)} className="px-3 py-1 font-bold text-lg">+</button>
                            </div>
                          ) : (
                            med.stock > 0 ? (
                              <button onClick={() => addToCart(med._id)} className="px-4 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">ADD</button>
                            ) : (
                              <span className="text-sm text-red-500">Unavailable</span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-gray-500 text-center">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        {/* Shop by Categories Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Shop by Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-center p-2 rounded-lg hover:shadow-lg transition-all ${
                  selectedCategory === category ? 'ring-2 ring-teal-500 shadow-lg' : 'shadow-md'
                }`}
              >
                <div className="bg-gray-100 rounded-lg h-32 w-32 mx-auto flex items-center justify-center overflow-hidden">
                  <img src={categoryImages[category] || 'https://via.placeholder.com/128'} alt={category} className="h-full w-full object-cover"/>
                </div>
                <h4 className="mt-2 font-medium">{category}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* All Products Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">
            {selectedCategory === 'All' ? 'All Products' : `Showing products in ${selectedCategory}`}
          </h3>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => ( <ProductCard key={med._id} product={med} /> ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No products found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;