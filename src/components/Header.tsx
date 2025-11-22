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
        <header className="bg-white shadow-sm sticky top-0 z-50 h-20 flex items-center">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo y Marca */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M11.25 3.375a.75.75 0 0 0-1.5 0V4.5h1.5V3.375Z" />
                            <path fillRule="evenodd" d="M12.75 3.75a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H14.25v1.5h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V4.5h-1.5a.75.75 0 0 1-.75-.75Zm1.5 3h1.5V5.25h-1.5v1.5Z" clipRule="evenodd" />
                            <path d="M1.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H1.5Z" />
                            <path d="M4.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H4.5Z" />
                            <path d="M8.25 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H8.25Z" />
                            <path fillRule="evenodd" d="M9.444 8.618a.75.75 0 0 1 .37.662v4.845a2.625 2.625 0 0 0 .97 2.037.75.75 0 0 0 1.11-.082c.29-.344.456-.78.456-1.232V9.28a.75.75 0 0 1 1.12.651v4.583c0 .857-.333 1.658-.937 2.247a2.46 2.46 0 0 1-1.583.67h-.01a2.46 2.46 0 0 1-1.583-.67 3.323 3.323 0 0 1-1.12-2.457v-4.583a.75.75 0 0 1 .75-.75c.21 0 .41.084.56.232ZM22.5 12c0-4.073-2.91-7.46-6.825-8.485A.75.75 0 0 0 15 4.14v.36a.75.75 0 0 0 1.5 0V4.5a7.5 7.5 0 0 1 6 7.5c0 .63-.078 1.244-.228 1.834a.75.75 0 0 0 .445.895A9 9 0 0 0 6.6 18.36a.75.75 0 0 0 .898.445A7.5 7.5 0 0 1 12 19.5a.75.75 0 0 0 0-1.5 6 6 0 0 0-5.326-5.952.75.75 0 0 0-.65-1.121A9.001 9.001 0 0 0 22.5 12Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">Transpo<span className="text-blue-600">Bolivia</span></span>
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Inicio
                    </Link>
                    <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Buscar Pasajes
                    </Link>

                    {!user && (
                        <Link to="/operador/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border-l pl-6 border-gray-300">
                            Soy Empresa
                        </Link>
                    )}
                </nav>

                {/* Área de Usuario */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            {user.role === 'operador' && (
                                <Link to="/operador" className="hidden md:block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 px-4 rounded-full transition-colors">
                                    Ir al Panel
                                </Link>
                            )}

                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-gray-900">{user.nombre.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 font-medium">Cerrar Sesión</button>
                            </div>

                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                                {user.nombre.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4 py-2">
                                Ingresar
                            </Link>
                            <Link to="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
