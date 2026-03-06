import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, getCart, updateQuantity, removeFromCart } = useCart();
  const [address, setAddress] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    getCart();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser.');
    }
    const loadingToast = toast.loading('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
          const { data } = await axios.get(url);
          if (data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted;
            setAddress(formattedAddress);
            toast.success('Location found!', { id: loadingToast });
          } else {
            toast.error('Could not determine address.', { id: loadingToast });
          }
        } catch (error) {
          toast.error('Could not fetch address details.', { id: loadingToast });
        }
      },
      () => {
        toast.error('Unable to retrieve your location. Please check browser permissions.', { id: loadingToast });
      }
    );
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      return toast.error("Please enter a delivery address.");
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/checkout/generate-upi-qr', { address }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(data.qrCode);
      setOrderId(data.orderId);
    } catch (error) {
      toast.error("Failed to proceed to checkout.");
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalPrice = cart.items.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);

  if (qrCode) {
    return (
      <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto card-premium text-center border-indigo-100 shadow-2xl shadow-indigo-100/50 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">💱</div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Finalize Payment</h2>
          <p className="text-slate-500 font-medium mb-8">Scan the UPI QR code below to complete your order within 15 minutes.</p>

          <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-inner mb-8">
            <img src={qrCode} alt="UPI QR Code" className="mx-auto w-full aspect-square object-contain" />
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payable Amount</span>
              <span className="text-xl font-black text-indigo-600">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{orderId}</span>
            </div>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 mb-8">
            <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest leading-relaxed">
              ⚠️ After successful payment, our medical dispatch team will verify and confirm your order manually. Keep this screen open for confirmation.
            </p>
          </div>

          <button
            onClick={() => setQrCode('')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
          >
            ← Cancel and Edit Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
              Checkout Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Shopping <span className="text-gradient">Bag.</span></h1>
            <p className="text-slate-500 font-medium mt-2">{cart.items.length} premium health products ready for delivery.</p>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-24 card-premium border-dashed border-2 border-slate-200 bg-white/50 animate-in fade-in duration-700">
            <div className="text-6xl mb-8">🛍️</div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Portfolio is Empty</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Your health journey starts with the right essentials. Explore our curated pharmacy store.</p>
            <Link to="/medicines" className="btn-premium px-12 py-4 shadow-xl shadow-indigo-100">
              Begin Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className="card-premium group hover:border-indigo-100 transition-all duration-500 shadow-xl shadow-slate-200/40">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-indigo-600">📍</span> Delivery Protocol
                  </h2>
                  <button
                    onClick={handleGetCurrentLocation}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    Auto-Detect Location
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full coordinate or residential address"
                    className="relative w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="card-premium !p-0 overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-50 bg-white">
                  <h2 className="text-xl font-bold text-slate-900">Items Selection</h2>
                </div>
                <div className="grid grid-cols-1 divide-y divide-slate-50">
                  {cart.items.map((item) => (
                    <div key={item.medicine._id} className="p-6 flex items-center group bg-white hover:bg-slate-50/50 transition-colors duration-500">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl p-4 flex items-center justify-center mr-6 border border-slate-50 group-hover:bg-white transition-colors">
                        <img src={item.medicine.imageUrl} alt={item.medicine.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{item.medicine.category}</p>
                        <h2 className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{item.medicine.name}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tight">{item.medicine.manufacturer}</p>
                        <p className="text-xl font-black text-slate-900 mt-3 tracking-tighter">₹{item.medicine.price.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                          <button onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition-all font-bold">-</button>
                          <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition-all font-bold">+</button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.medicine._id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                          title="Remove from bag"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="card-premium sticky top-32 bg-slate-900 border-none shadow-2xl shadow-indigo-900/20 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black tracking-tight mb-8">Bill Summary</h2>

                  <div className="space-y-4 mb-10 py-6 border-y border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Subtotal</span>
                      <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Medical Surcharge</span>
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">Included</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Standard Delivery</span>
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                      <p className="text-4xl font-black text-white tracking-tighter">₹{totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full btn-premium py-5 text-sm font-black tracking-widest bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  >
                    <span>🔐</span>
                    <span>Confirm Order</span>
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 grayscale opacity-50">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secured by UPI Matrix</span>
                  </div>
                </div>
              </div>

              <Link to="/medicines" className="mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all">
                <span>←</span>
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;