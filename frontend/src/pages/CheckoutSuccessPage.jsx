import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSuccessPage = () => {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-lg mx-auto text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. It is now being processed.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to My Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;