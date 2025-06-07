// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Dashboard from './pages/Dashboard';
import InvoiceCreator from './pages/InvoiceCreator';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InvoiceProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
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
                </Routes>
              </div>
            </Router>
          </InvoiceProvider>
        </AuthProvider>
        {process.env.REACT_APP_DEBUG === 'true' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;