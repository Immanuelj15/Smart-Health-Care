import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientBookingsPage from './PatientBookingsPage';
import DoctorDashboardPage from './DoctorDashboardPage';
import AdminDashboardPage from './AdminDashboardPage';

const DashboardRouter = () => {
  const { role } = useAuth();

  switch (role) {
    case 'patient':
      return <PatientBookingsPage />
    case 'doctor':
      return <DoctorDashboardPage />;
    case 'admin':
      return <AdminDashboardPage />;
    default:
      return <div>Loading dashboard...</div>;
  }
};

export default DashboardRouter;
