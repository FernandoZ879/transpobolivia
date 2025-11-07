
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, contrasena: string) => Promise<User>;
  register: (nombre: string, email: string, contrasena: string) => Promise<void>;
  registerOperator: (nombreEmpresa: string, nit: string, email: string, contrasena: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Al cargar el componente, intentar recuperar la sesión del localStorage
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, contrasena: string): Promise<User> => {
    const { user, token } = await authService.login(email, contrasena);
    setUser(user);
    setToken(token);
    return user;
  };

  const register = async (nombre: string, email: string, contrasena: string) => {
    const { user, token } = await authService.register(nombre, email, contrasena);
    setUser(user);
    setToken(token);
  };

  const registerOperator = async (nombreEmpresa: string, nit: string, email: string, contrasena: string) => {
    const { user, token } = await authService.registerOperator(nombreEmpresa, nit, email, contrasena);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    registerOperator,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};