import axios from 'axios';

// Cambia a false para conectar con tu backend NestJS real
const USE_MOCK = false;
const API_URL = '/api'; // Proxy configurado en Nginx

export const api = axios.create({
    baseURL: API_URL,
});

// Añadimos token automáticamente si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('transpobolivia_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const TransportService = {
    // --- CLIENTE: BÚSQUEDA ---

    // Buscar viajes (permite parámetros vacíos)
    searchTrips: async (origen?: string, destino?: string, fecha?: string) => {
        let url = '/search/trips?';
        if (origen) url += `origen=${origen}&`;
        if (destino) url += `destino=${destino}&`;
        if (fecha) url += `fecha=${fecha}&`;

        const response = await api.get(url);
        return response.data;
    },

    // --- OPERADOR ---

    // Perfil de empresa
    getCompanyProfile: async () => {
        const response = await api.get('/empresa/me');
        return response.data;
    },
    updateCompanyProfile: async (data: any) => {
        const response = await api.put('/empresa', data);
        return response.data;
    },

    // Rutas
    getRoutes: async () => {
        const response = await api.get('/rutas');
        return response.data;
    },
    createRoute: async (data: any) => {
        const response = await api.post('/rutas', data);
        return response.data;
    },
    deleteRoute: async (id: string) => {
        await api.delete(`/rutas/${id}`);
    },

    // Vehículos
    getVehicles: async () => {
        const response = await api.get('/vehiculos');
        return response.data;
    },
    createVehicle: async (data: any) => {
        const response = await api.post('/vehiculos', data);
        return response.data;
    },
    deleteVehicle: async (id: string) => {
        await api.delete(`/vehiculos/${id}`);
    },

    // Horarios (AQUÍ ESTABA EL ERROR, FALTABAN MÉTODOS)
    getSchedules: async () => {
        const response = await api.get('/horarios');
        return response.data;
    },
    getSchedulesByRoute: async (rutaId: string) => {
        const response = await api.get(`/horarios?rutaId=${rutaId}`);
        return response.data;
    },
    createSchedule: async (data: any) => {
        const response = await api.post('/horarios', data);
        return response.data;
    },
    updateSchedule: async (id: string, data: any) => {
        const response = await api.patch(`/horarios/${id}`, data);
        return response.data;
    },
    deleteSchedule: async (id: string) => {
        await api.delete(`/horarios/${id}`);
    },

    // Conductores
    getDrivers: async () => {
        const response = await api.get('/conductores');
        return response.data;
    },
    createDriver: async (data: any) => {
        const response = await api.post('/conductores', data);
        return response.data;
    },
    deleteDriver: async (id: string) => {
        await api.delete(`/conductores/${id}`);
    },

    // Mantenimiento
    getAlertas: async () => {
        const response = await api.get('/mantenimiento/alertas');
        return response.data;
    },

    // --- PUBLIC / CLIENT ---
    getScheduleById: async (id: string) => {
        const response = await api.get(`/search/schedule/${id}`);
        return response.data;
    },
    getOccupiedSeats: async (scheduleId: string, date: string) => {
        const response = await api.get(`/reservas/ocupados?horarioId=${scheduleId}&fechaViaje=${date}`);
        return response.data;
    }
};
