import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Banners } from '@/pages/Banners';
import { Payments } from '@/pages/Payments';
import { Plans } from '@/pages/Plans';
import { Services } from '@/pages/Services';
import { Agenda } from '@/pages/Agenda';
import { Microchips } from '@/pages/Microchips';
import { Cashbacks } from '@/pages/Cashbacks';
import { Reports } from '@/pages/Reports';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import './App.css';

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-white text-black">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/banners"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Banners />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Plans />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Services />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agenda"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Agenda />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/microchips"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Microchips />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashbacks"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Cashbacks />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;