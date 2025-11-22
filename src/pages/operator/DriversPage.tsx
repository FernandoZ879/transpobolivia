import React, { useState, useEffect } from 'react';
import { TransportService } from '../../services/api';

const DriversPage: React.FC = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newDriver, setNewDriver] = useState({
        nombre: '',
        cedula: '',
        tipoLicencia: 'A',
        vencimientoLicencia: '',
        estado: 'activo'
    });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        setLoading(true);
        try {
            const data = await TransportService.getDrivers();
            setDrivers(data);
        } catch (error) {
            console.error('Error loading drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TransportService.createDriver(newDriver);
            setShowModal(false);
            setNewDriver({ nombre: '', cedula: '', tipoLicencia: 'A', vencimientoLicencia: '', estado: 'activo' });
            loadDrivers();
        } catch (error) {
            console.error('Error creating driver:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este conductor?')) {
            try {
                await TransportService.deleteDriver(id);
                loadDrivers();
            } catch (error) {
                console.error('Error deleting driver:', error);
            }
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12">Cargando...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Conductores</h1>
                    <p className="text-gray-500">Administra los conductores de tu empresa.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo Conductor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Nombre Completo</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Cédula</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Licencia</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">{driver.nombre}</td>
                                <td className="p-4 text-gray-600">{driver.cedula}</td>
                                <td className="p-4 text-gray-600">{driver.tipoLicencia}</td>
                                <td className="p-4 text-gray-600">{driver.vencimientoLicencia}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${driver.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {driver.estado}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(driver.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {drivers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No hay conductores registrados.</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Nuevo Conductor</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newDriver.nombre} onChange={e => setNewDriver({ ...newDriver, nombre: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newDriver.cedula} onChange={e => setNewDriver({ ...newDriver, cedula: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Licencia</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg" value={newDriver.tipoLicencia} onChange={e => setNewDriver({ ...newDriver, tipoLicencia: e.target.value })} required>
                                        <option value="A">Categoría A</option>
                                        <option value="B">Categoría B</option>
                                        <option value="C">Categoría C</option>
                                        <option value="P">Categoría P</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento Licencia</label>
                                    <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={newDriver.vencimientoLicencia} onChange={e => setNewDriver({ ...newDriver, vencimientoLicencia: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select className="w-full p-2 border border-gray-300 rounded-lg" value={newDriver.estado} onChange={e => setNewDriver({ ...newDriver, estado: e.target.value })}>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Conductor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriversPage;
