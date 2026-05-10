/**
 * App.jsx – Root application component.
 * Defines all routes and authentication-based redirects.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Public route: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected route: Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect: / → /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;