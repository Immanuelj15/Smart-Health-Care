import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import All Pages & Components
import PublicHomePage from './pages/PublicHomePage';
import SurgeriesPage from './pages/SurgeriesPage';
import SurgeryDetailsPage from './pages/SurgeryDetailsPage';
import DashboardRouter from './pages/DashboardRouter';
import FindDoctorPage from './pages/FindDoctorPage';
import DoctorSearchResultsPage from './pages/DoctorSearchResultsPage';
import BookingPage from './pages/BookingPage';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetailsPage from './pages/MedicineDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import NutritionScannerPage from './pages/NutritionScannerPage';
import VideoCallPage from './pages/VideoCallPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ChatBot from './components/common/ChatBot';
import AdminLoginPage from './pages/AdminLoginPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';

// Import Contexts, Modals, and Layout
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider } from './context/ModalContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <Router>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <CartProvider>
            <ModalProvider>
              <Toaster position="top-center" />
              <LoginModal />
              <RegisterModal />
              <Navigation />
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<PublicHomePage />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/register/admin" element={<AdminRegisterPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
                  <Route path="/find-doctors" element={<ProtectedRoute><FindDoctorPage /></ProtectedRoute>} />
                  <Route path="/doctors/search" element={<ProtectedRoute><DoctorSearchResultsPage /></ProtectedRoute>} />
                  <Route path="/medicines" element={<ProtectedRoute><MedicinesPage /></ProtectedRoute>} />
                  <Route path="/medicines/:id" element={<ProtectedRoute><MedicineDetailsPage /></ProtectedRoute>} />
                  <Route path="/surgeries" element={<ProtectedRoute><SurgeriesPage /></ProtectedRoute>} />
                  <Route path="/surgeries/:id" element={<ProtectedRoute><SurgeryDetailsPage /></ProtectedRoute>} />
                  <Route path="/book-appointment/:doctorId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
                  <Route path="/symptom-checker" element={<ProtectedRoute><SymptomCheckerPage /></ProtectedRoute>} />
                  <Route path="/nutrition-scanner" element={<ProtectedRoute><NutritionScannerPage /></ProtectedRoute>} />
                  <Route path="/video-call/:roomId" element={<ProtectedRoute><VideoCallPage /></ProtectedRoute>} />
                  <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordsPage /></ProtectedRoute>} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <ChatBot />
            </ModalProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;