// src/pages/UnauthorizedPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-20">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-4">Access Denied</h2>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, you do not have the necessary permissions to access this page.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedPage;