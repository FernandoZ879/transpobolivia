import React, { useState, useEffect } from 'react';
import { TransportService } from '../../services/api';
import { CIUDADES } from '../../constants';

const RoutesPage: React.FC = () => {
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newRoute, setNewRoute] = useState({
        nombre: '',
        origen: '',
        destino: '',
        precio: '',
        duracion: ''
    });

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setLoading(true);
        try {
            const data = await TransportService.getRoutes();
            setRoutes(data as any[]);
        } catch (error) {
            console.error("Error loading routes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TransportService.createRoute({ ...newRoute, precio: Number(newRoute.precio) });
            setShowModal(false);
            setNewRoute({ nombre: '', origen: '', destino: '', precio: '', duracion: '' });
            loadRoutes();
        } catch (error) {
            console.error("Error creating route", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta ruta?')) {
            try {
                await TransportService.deleteRoute(id);
                loadRoutes();
            } catch (error) {
                console.error("Error deleting route", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutas</h1>
                    <p className="text-gray-500">Administra las rutas de transporte de tu empresa.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nueva Ruta
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Cargando...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Origen</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Destino</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Duración</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Precio</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {routes.map((route) => (
                                <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{route.nombre}</td>
                                    <td className="p-4 text-gray-600">{route.origen}</td>
                                    <td className="p-4 text-gray-600">{route.destino}</td>
                                    <td className="p-4 text-gray-600">{route.duracion}</td>
                                    <td className="p-4 font-bold text-accent-600">{route.precio} Bs</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(route.id)}
                                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {routes.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No hay rutas registradas.</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Nueva Ruta</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Ruta</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newRoute.nombre} onChange={e => setNewRoute({ ...newRoute, nombre: e.target.value })} placeholder="La Paz - Santa Cruz" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg" value={newRoute.origen} onChange={e => setNewRoute({ ...newRoute, origen: e.target.value })} required>
                                        <option value="">Seleccionar</option>
                                        {CIUDADES.map(city => (
                                            <option key={city.id} value={city.id}>{city.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg" value={newRoute.destino} onChange={e => setNewRoute({ ...newRoute, destino: e.target.value })} required>
                                        <option value="">Seleccionar</option>
                                        {CIUDADES.map(city => (
                                            <option key={city.id} value={city.id}>{city.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                                    <input type="text" placeholder="ej. 8h" className="w-full p-2 border border-gray-300 rounded-lg" value={newRoute.duracion} onChange={e => setNewRoute({ ...newRoute, duracion: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs)</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" value={newRoute.precio} onChange={e => setNewRoute({ ...newRoute, precio: e.target.value })} required />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Ruta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutesPage;
