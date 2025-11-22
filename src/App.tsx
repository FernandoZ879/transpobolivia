import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import OperatorLayout from './layouts/OperatorLayout';

// Public Pages
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OperadorLoginPage from './pages/operador/LoginPage';
import OperadorRegisterPage from './pages/operador/RegisterPage';

// Client Pages
import SeatSelectionPage from './pages/SeatSelectionPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';

// Operator Pages
import DashboardPage from './pages/operator/DashboardPage';
import RoutesPage from './pages/operator/RoutesPage';
import SchedulesPage from './pages/operator/SchedulesPage';
import FleetPage from './pages/operator/FleetPage';
import DriversPage from './pages/operator/DriversPage';
import MaintenancePage from './pages/operator/MaintenancePage';
import CompanyProfilePage from './pages/operator/CompanyProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/operador/login" element={<OperadorLoginPage />} />
            <Route path="/operador/register" element={<OperadorRegisterPage />} />

            {/* Client Booking Flow */}
            <Route path="/seleccionar-asientos" element={<SeatSelectionPage />} />
            <Route path="/confirmacion" element={<ConfirmationPage />} />
          </Route>

          {/* Operator Routes - Protected */}
          <Route
            path="/operador"
            element={
              <ProtectedRoute requiredRole="operador">
                <OperatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="rutas" element={<RoutesPage />} />
            <Route path="horarios" element={<SchedulesPage />} />
            <Route path="vehiculos" element={<FleetPage />} />
            <Route path="conductores" element={<DriversPage />} />
            <Route path="mantenimiento" element={<MaintenancePage />} />
            <Route path="perfil" element={<CompanyProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
