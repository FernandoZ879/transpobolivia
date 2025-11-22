import React, { useState, useEffect } from 'react';
import { TransportService } from '../../services/api';

const SchedulesPage: React.FC = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        rutaId: '',
        vehiculoId: '',
        horaSalida: '',
        tarifaGeneral: '',
        fecha: '', // Nuevo campo para fecha específica
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [schedulesData, routesData, vehiclesData] = await Promise.all([
                TransportService.getSchedules(),
                TransportService.getRoutes(),
                TransportService.getVehicles()
            ]);
            setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
            setRoutes(Array.isArray(routesData) ? routesData : []);
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        } catch (error) {
            console.error("Error loading data", error);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TransportService.createSchedule({
                ...newSchedule,
                tarifaGeneral: Number(newSchedule.tarifaGeneral),
                // Si hay fecha, enviamos dias vacío o null, el backend prioriza fecha
                dias: newSchedule.fecha ? [] : newSchedule.dias
            });
            setShowModal(false);
            setNewSchedule({
                rutaId: '',
                vehiculoId: '',
                horaSalida: '',
                tarifaGeneral: '',
                fecha: '',
                dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
            });
            loadData();
        } catch (error) {
            console.error("Error creating schedule", error);
            alert("Error al crear horario. Revisa los datos.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este horario?')) {
            try {
                await TransportService.deleteSchedule(id);
                loadData();
            } catch (error) {
                console.error("Error deleting schedule", error);
            }
        }
    };

    // Helper seguro para obtener nombre
    const getRouteName = (id: string) => {
        const route = routes.find(r => r.id === id);
        return route ? route.nombre : 'Ruta Desconocida';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Horarios</h1>
                    <p className="text-gray-500">Programación de salidas y asignación de vehículos.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo Horario
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Cargando...</div>
            ) : (
                <div className="card">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Ruta</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Salida</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Fecha / Días</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tarifa</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedules.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{getRouteName(schedule.rutaId)}</td>
                                    <td className="p-4 text-gray-900 font-bold">{schedule.horaSalida}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        {schedule.fecha ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{schedule.fecha}</span>
                                        ) : (
                                            <span className="text-gray-500">Todos los días</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600">{schedule.tarifaGeneral} Bs</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(schedule.id)}
                                            className="text-red-600 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded hover:bg-red-100"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {schedules.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No hay horarios registrados.</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Nuevo Horario</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ruta</label>
                                <select
                                    className="input-field"
                                    value={newSchedule.rutaId}
                                    onChange={e => setNewSchedule({ ...newSchedule, rutaId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar Ruta</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Vehículo</label>
                                <select
                                    className="input-field"
                                    value={newSchedule.vehiculoId}
                                    onChange={e => setNewSchedule({ ...newSchedule, vehiculoId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar Vehículo</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.modelo} ({v.patente})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hora Salida</label>
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={newSchedule.horaSalida}
                                        onChange={e => setNewSchedule({ ...newSchedule, horaSalida: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Precio (Bs)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={newSchedule.tarifaGeneral}
                                        onChange={e => setNewSchedule({ ...newSchedule, tarifaGeneral: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha Específica (Opcional)</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={newSchedule.fecha}
                                    onChange={e => setNewSchedule({ ...newSchedule, fecha: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Si seleccionas una fecha, el viaje será único para ese día. Si lo dejas vacío, será todos los días.</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulesPage;
