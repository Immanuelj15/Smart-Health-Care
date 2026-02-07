import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If the user is not logged in, redirect them to the homepage.
    // They can then click the "Login" button to open the modal.
    return <Navigate to="/" replace />;
  }

  // If they are logged in, show them the page they requested.
  return children;
};

export default ProtectedRoute;