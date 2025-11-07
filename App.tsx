import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OperadorLayout from './pages/operador/OperadorLayout';
import OperadorLoginPage from './pages/operador/LoginPage';
import OperadorRegisterPage from './pages/operador/RegisterPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Rutas Públicas de Clientes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Nuevas Rutas Públicas de Operadores */}
                <Route path="/operador/login" element={<OperadorLoginPage />} />
                <Route path="/operador/register" element={<OperadorRegisterPage />} />

                {/* Rutas Protegidas de Clientes */}
                <Route
                  path="/seleccionar-asientos"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <SeatSelectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmacion"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <ConfirmationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas Protegidas de Operadores */}
                <Route
                  path="/operador/*"
                  element={
                    <ProtectedRoute allowedRoles={['operador', 'super-admin']}>
                      <OperadorLayout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
