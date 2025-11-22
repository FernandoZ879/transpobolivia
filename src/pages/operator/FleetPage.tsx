import React, { useState, useEffect } from 'react';
import { TransportService } from '../../services/api';

const FleetPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        patente: '',
        modelo: '',
        capacidad: '',
        fechaUltimaRevision: new Date().toISOString().split('T')[0],
        estado: 'activo' as 'activo' | 'inactivo' | 'mantenimiento'
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const data = await TransportService.getVehicles();
            setVehicles(data as any[]);
        } catch (error) {
            console.error("Error loading vehicles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TransportService.createVehicle({ ...newVehicle, capacidad: Number(newVehicle.capacidad) });
            setShowModal(false);
            setNewVehicle({ patente: '', modelo: '', capacidad: '', fechaUltimaRevision: new Date().toISOString().split('T')[0], estado: 'activo' });
            loadVehicles();
        } catch (error) {
            console.error("Error creating vehicle", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este vehículo?')) {
            try {
                await TransportService.deleteVehicle(id);
                loadVehicles();
            } catch (error) {
                console.error("Error deleting vehicle", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Flota</h1>
                    <p className="text-gray-500">Administra los vehículos de tu empresa.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo Vehículo
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Cargando...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Patente</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Modelo</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Capacidad</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Última Revisión</th>
                                <th className="p-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{vehicle.patente}</td>
                                    <td className="p-4 text-gray-600">{vehicle.modelo}</td>
                                    <td className="p-4 text-gray-600">{vehicle.capacidad} asientos</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.estado === 'activo' ? 'bg-green-100 text-green-800' : vehicle.estado === 'inactivo' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {vehicle.estado}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{vehicle.fechaUltimaRevision}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {vehicles.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No hay vehículos registrados.</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Nuevo Vehículo</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newVehicle.patente} onChange={e => setNewVehicle({ ...newVehicle, patente: e.target.value })} placeholder="Ej: ABC-123" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newVehicle.modelo} onChange={e => setNewVehicle({ ...newVehicle, modelo: e.target.value })} placeholder="Ej: Mercedes Benz 2020" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (asientos)</label>
                                <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" value={newVehicle.capacidad} onChange={e => setNewVehicle({ ...newVehicle, capacidad: e.target.value })} min="1" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Última Revisión</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={newVehicle.fechaUltimaRevision} onChange={e => setNewVehicle({ ...newVehicle, fechaUltimaRevision: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg" value={newVehicle.estado} onChange={e => setNewVehicle({ ...newVehicle, estado: e.target.value as 'activo' | 'inactivo' | 'mantenimiento' })}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Vehículo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetPage;
