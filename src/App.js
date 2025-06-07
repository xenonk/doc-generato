import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Dashboard from './pages/Dashboard';
import InvoiceCreator from './pages/InvoiceCreator';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page (To be implemented)</div>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice/create"
        element={
          <ProtectedRoute>
            <InvoiceCreator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice/:id/edit"
        element={
          <ProtectedRoute>
            <InvoiceCreator />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; 