import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(nombre, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-primary text-center mb-2">Crea tu Cuenta</h1>
        <p className="text-text-muted text-center mb-6">Únete a la comunidad de viajeros de TranspoBolivia.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-text-muted mb-1">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light"
            />
          </div>
           <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-muted mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light"
            />
          </div>
          {error && <p className="text-accent text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 mt-4"
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
