
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
            <path d="M11.25 3.375a.75.75 0 0 0-1.5 0V4.5h1.5V3.375Z" />
            <path fillRule="evenodd" d="M12.75 3.75a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H14.25v1.5h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V4.5h-1.5a.75.75 0 0 1-.75-.75Zm1.5 3h1.5V5.25h-1.5v1.5Z" clipRule="evenodd" />
            <path d="M1.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H1.5Z" />
            <path d="M4.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H4.5Z" />
            <path d="M8.25 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H8.25Z" />
            <path fillRule="evenodd" d="M9.444 8.618a.75.75 0 0 1 .37.662v4.845a2.625 2.625 0 0 0 .97 2.037.75.75 0 0 0 1.11-.082c.29-.344.456-.78.456-1.232V9.28a.75.75 0 0 1 1.12.651v4.583c0 .857-.333 1.658-.937 2.247a2.46 2.46 0 0 1-1.583.67h-.01a2.46 2.46 0 0 1-1.583-.67 3.323 3.323 0 0 1-1.12-2.457v-4.583a.75.75 0 0 1 .75-.75c.21 0 .41.084.56.232ZM22.5 12c0-4.073-2.91-7.46-6.825-8.485A.75.75 0 0 0 15 4.14v.36a.75.75 0 0 0 1.5 0V4.5a7.5 7.5 0 0 1 6 7.5c0 .63-.078 1.244-.228 1.834a.75.75 0 0 0 .445.895A9 9 0 0 0 6.6 18.36a.75.75 0 0 0 .898.445A7.5 7.5 0 0 1 12 19.5a.75.75 0 0 0 0-1.5 6 6 0 0 0-5.326-5.952.75.75 0 0 0-.65-1.121A9.001 9.001 0 0 0 22.5 12Z" clipRule="evenodd" />
           </svg>
          <span className="text-xl font-bold text-primary">Transpo<span className="text-secondary">Bolivia</span></span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'operador' && (
                <Link to="/operador" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                  Panel Operador
                </Link>
              )}
              <span className="text-sm font-medium text-text-muted hidden sm:block">Hola, {user.nombre.split(' ')[0]}</span>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Registrarse</Link>
              <Link to="/login" className="text-sm font-medium bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-full transition-colors">Iniciar Sesión</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
