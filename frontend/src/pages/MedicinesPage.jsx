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
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
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
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
        setMedicines(data);
        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to fetch medicines.');
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
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">Your Health, <span className="text-gradient">Delivered.</span></h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Get medicines and health products delivered to your doorstep with our trusted pharma network.</p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 space-x-3">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search for medicines, vitamins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full py-3 text-slate-700 font-medium focus:outline-none bg-transparent"
                />
              </div>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                Search
              </button>
            </div>

            {isSearchFocused && searchTerm.length > 0 && (
              <div className="absolute top-full left-0 right-0 glass-dark mt-4 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                {filteredMedicines.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
                    {filteredMedicines.map(med => {
                      const cartItem = cart?.items.find(item => item.medicine._id === med._id);
                      return (
                        <div key={med._id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                          <div className="flex items-center space-x-4 text-left">
                            <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center">
                              <img src={med.imageUrl} alt={med.name} className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{med.name}</p>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">₹{med.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {cartItem ? (
                              <div className="flex items-center bg-white/10 rounded-lg p-1">
                                <button onClick={() => updateQuantity(med._id, cartItem.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-md transition-colors">-</button>
                                <span className="w-8 text-center text-white font-bold">{cartItem.quantity}</span>
                                <button onClick={() => updateQuantity(med._id, cartItem.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-md transition-colors">+</button>
                              </div>
                            ) : (
                              med.stock > 0 ? (
                                <button onClick={() => addToCart(med._id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">ADD IT</button>
                              ) : (
                                <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-1 rounded">Stock Out</span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-slate-400 text-center font-medium">No results for "{searchTerm}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
        {/* Shop by Categories Section */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shop by Categories</h3>
              <p className="text-slate-500 font-medium">Explore health essentials curated for you.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`group text-center p-3 rounded-2xl transition-all duration-500 flex flex-col items-center ${selectedCategory === category
                    ? 'bg-indigo-50 shadow-xl shadow-indigo-100 scale-105 border-indigo-200 border'
                    : 'bg-white hover:shadow-lg hover:-translate-y-1'
                  }`}
              >
                <div className="bg-slate-50 rounded-2xl h-24 w-24 mb-4 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                  <img src={categoryImages[category] || 'https://via.placeholder.com/128'} alt={category} className="h-full w-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">{category}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* All Products Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategory === 'All' ? 'Available Products' : `Top items in ${selectedCategory}`}
            </h3>
            <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full uppercase tracking-widest">
              {filteredMedicines.length} Items Found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curating pharmacy...</p>
            </div>
          ) : error ? (
            <div className="text-center card-premium py-16 bg-red-50/30 border-red-100">
              <p className="text-red-600 font-bold mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-premium px-10"
              >
                Retry Fetch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => (
                  <div key={med._id} className="card-premium group relative flex flex-col h-full uppercase hover:shadow-indigo-500/10">
                    <Link to={`/medicines/${med._id}`} className="flex-1 flex flex-col">
                      <div className="relative h-48 mb-6 bg-slate-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-slate-50 group-hover:bg-white transition-colors duration-500">
                        <img src={med.imageUrl} alt={med.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-sm" />
                        <div className="absolute top-4 right-4 h-6 w-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[10px] shadow-sm">
                          ❤️
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-[10px] font-black text-indigo-600 tracking-widest mb-1">{med.category}</p>
                        <h2 className="font-bold text-slate-900 leading-tight h-10 overflow-hidden text-sm line-clamp-2">{med.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{med.manufacturer}</p>
                      </div>
                    </Link>

                    <div className="mt-6">
                      <div className="flex justify-between items-end mb-4">
                        <p className="text-xl font-black text-slate-900 tracking-tight">₹{med.price.toFixed(2)}</p>
                        {med.stock <= 5 && med.stock > 0 && (
                          <p className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Low Stock</p>
                        )}
                      </div>

                      {(() => {
                        const cartItem = cart?.items.find(item => item.medicine._id === med._id);
                        return cartItem ? (
                          <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                            <button onClick={() => updateQuantity(med._id, cartItem.quantity - 1)} className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-all">-</button>
                            <span className="font-black text-slate-900">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(med._id, cartItem.quantity + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition-all">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(med._id)}
                            disabled={med.stock === 0}
                            className="w-full btn-premium py-3 text-sm font-black shadow-lg shadow-indigo-500/10 disabled:bg-slate-300 disabled:shadow-none bg-gradient-to-r"
                          >
                            {med.stock > 0 ? 'Add To Bag' : 'Out Of Stock'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-4xl mb-4">💊</div>
                  <p className="text-slate-500 font-bold tracking-widest uppercase">No health products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;