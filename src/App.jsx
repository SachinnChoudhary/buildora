import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CustomRequestPage from './pages/CustomRequestPage';
import CheckoutPage from './pages/CheckoutPage';
import FreelancerDashboardPage from './pages/FreelancerDashboardPage';
import FreelancerUploadPage from './pages/FreelancerUploadPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } />

        {/* Protected Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/custom-request" element={
          <ProtectedRoute>
            <CustomRequestPage />
          </ProtectedRoute>
        } />

        <Route path="/checkout/:projectId" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />

        {/* Protected Freelancer Routes */}
        <Route path="/freelancer/dashboard" element={
          <ProtectedRoute>
            <FreelancerDashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/freelancer/upload" element={
          <ProtectedRoute>
            <FreelancerUploadPage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
