import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentSets from './pages/DocumentSets';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import InvoiceCreator from './pages/InvoiceCreator';
import Login from './pages/Login';
import HandbookRoutes from './routes/handbookRoutes';
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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InvoiceProvider>
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
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document-sets"
                element={
                  <ProtectedRoute>
                    <DocumentSets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <Templates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
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
              <Route
                path="/handbooks/*"
                element={
                  <ProtectedRoute>
                    <HandbookRoutes />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </InvoiceProvider>
        </AuthProvider>
        {process.env.REACT_APP_DEBUG === 'true' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App; 