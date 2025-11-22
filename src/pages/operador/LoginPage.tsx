
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OperadorLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role !== 'operador' && loggedInUser.role !== 'super-admin') {
        logout();
        setError('Acceso denegado. Esta área es solo para personal autorizado.');
        setIsLoading(false);
        return;
      }
      navigate('/operador');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">Portal para Empresas</h1>
        <p className="text-gray-500 text-center mb-6">Accede para gestionar tu flota, rutas y ventas.</p>

        {/* Example Credentials */}
        <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg mb-4 text-center">
          <p><strong>Demo:</strong> operador@transpo.bo / password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Aún no tienes una cuenta para tu empresa?{' '}
          <Link to="/operador/register" className="font-medium text-orange-600 hover:underline">
            Regístrala aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OperadorLoginPage;
