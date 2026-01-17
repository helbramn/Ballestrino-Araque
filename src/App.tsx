import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { EncargosPage } from './pages/EncargosPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PropertyFormPage } from './pages/admin/PropertyFormPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { QuizPage } from './pages/QuizPage';
import { ScrollToTop } from './components/layout/ScrollToTop';

import { FavoritesProvider } from './contexts/FavoritesContext';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <FavoritesProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="propiedades" element={<PropertiesPage />} />
                <Route path="propiedad/:id" element={<PropertyDetailPage />} />
                <Route path="favoritos" element={<FavoritesPage />} />
                <Route path="encargos" element={<EncargosPage />} />
                <Route path="inversores" element={<InvestorsPage />} />
              </Route>

              {/* Admin Login (Public) */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Quiz Page (Standalone) */}
              <Route path="/quiz" element={<QuizPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="properties/new" element={<PropertyFormPage />} />
                <Route path="properties/:id/edit" element={<PropertyFormPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
            {/* Global Noise Overlay */}
            <div className="bg-noise"></div>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
