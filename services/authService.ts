// >>> services/authService.ts

import axios from 'axios';
import { User } from '../types';
import { API_BASE } from '../constants'

const API_URL = API_BASE;
const TOKEN_KEY = 'transpobolivia_token';
const USER_KEY = 'transpobolivia_user';

// Función auxiliar para manejar la sesión
const manageSession = (accessToken: string): { user: User; token: string } => {
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const user: User = {
    id: payload.sub,
    email: payload.email,
    empresaId: payload.empresaId,
    nombre: payload.nombre || '',
    role: payload.empresaId ? 'operador' : 'user',
  };
  
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { user, token: accessToken };
};

export const authService = {
  register: async (nombre: string, email: string, contrasena: string): Promise<{ user: User; token: string }> => {
    const userData = {
      nombre,
      email: email.toLowerCase(),
      contrasena,
      role: 'user',
    };

    try {
      // SOLO HACEMOS UNA LLAMADA. El backend ahora devuelve el { access_token }
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { access_token } = response.data;
      return manageSession(access_token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error en el registro de cliente.');
      }
      throw new Error('No se pudo conectar con el servidor.');
    }
  },

  registerOperator: async (nombreEmpresa: string, nit: string, email: string, contrasena: string): Promise<{ user: User; token: string }> => {
    const operatorData = {
      nombre: nombreEmpresa,
      nit,
      email: email.toLowerCase(),
      contrasena,
      role: 'operador',
    };

    try {
      // SOLO HACEMOS UNA LLAMADA
      const response = await axios.post(`${API_URL}/auth/register`, operatorData);
      const { access_token } = response.data;
      return manageSession(access_token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error en el registro de operador.');
      }
      throw new Error('No se pudo conectar con el servidor.');
    }
  },

  login: async (email: string, contrasena: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.toLowerCase(),
        contrasena,
      });
      const { access_token } = response.data;
      return manageSession(access_token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || 'Credenciales inválidas.');
      }
      throw new Error('No se pudo conectar con el servidor.');
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentSession: (): { user: User; token: string } | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { user, token };
      } catch (e) { return null; }
    }
    return null;
  },
};