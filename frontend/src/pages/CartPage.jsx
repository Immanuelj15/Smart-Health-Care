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
    return <div className="text-center py-10">Loading your cart...</div>;
  }
  
  const totalPrice = cart.items.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);

  if (qrCode) {
    return (
      <div className="container mx-auto py-10 text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Scan to Pay</h2>
        <img src={qrCode} alt="UPI QR Code" className="mx-auto" />
        <p className="mt-4 font-bold text-lg">Total Amount: ₹{totalPrice.toFixed(2)}</p>
        <p className="mt-2 text-gray-600">Your Order ID is: {orderId}</p>
        <p className="mt-6 text-sm text-red-600">
          After paying, your order will be confirmed manually by our team.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">My Cart ({cart.items.length} items)</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p>Your cart is empty.</p>
          <Link to="/medicines" className="text-blue-500 font-semibold mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Address Section */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Delivery Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address"
              className="w-full p-3 border rounded-lg"
            />
            <button 
              onClick={handleGetCurrentLocation}
              className="flex items-center space-x-2 text-blue-600 font-semibold mt-3 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              <span>Use my current location</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.medicine._id} className="flex items-center border-b pb-4">
                <img src={item.medicine.imageUrl} alt={item.medicine.name} className="w-20 h-20 object-contain rounded-md mr-4"/>
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.medicine.name}</h2>
                  <p className="text-sm text-gray-500">{item.medicine.manufacturer}</p>
                  <p className="font-semibold mt-2">₹{item.medicine.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center border rounded-md">
                  <button onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)} className="px-4 py-2 font-bold text-lg">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)} className="px-4 py-2 font-bold text-lg">+</button>
                </div>
                <button onClick={() => removeFromCart(item.medicine._id)} className="ml-6 text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div>
              <p className="text-xl font-bold">Payable Amount</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</p>
            </div>
            <button onClick={handleCheckout} className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold text-lg">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;