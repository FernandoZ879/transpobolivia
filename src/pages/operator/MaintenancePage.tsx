import React, { useState } from 'react';

const MaintenancePage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newLog, setNewLog] = useState({
        vehiculoId: '',
        tipo: '',
        descripcion: '',
        costo: '',
        fecha: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const log = { ...newLog, id: Math.random().toString(36).substr(2, 9), costo: Number(newLog.costo) };
        setLogs([...logs, log]);
        setShowModal(false);
        setNewLog({ vehiculoId: '', tipo: '', descripcion: '', costo: '', fecha: '' });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            setLogs(logs.filter(l => l.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registro de Mantenimiento</h1>
                    <p className="text-gray-500">Lleva un registro del mantenimiento de tu flota.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo Registro
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Vehículo</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Descripción</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Costo</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-600">{log.fecha}</td>
                                <td className="p-4 font-medium text-gray-900">{log.vehiculoId}</td>
                                <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{log.tipo}</span></td>
                                <td className="p-4 text-gray-600">{log.descripcion}</td>
                                <td className="p-4 font-bold text-accent-600">{log.costo} Bs</td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(log.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No hay registros de mantenimiento.</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Nuevo Registro de Mantenimiento</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo (Placa)</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" value={newLog.vehiculoId} onChange={e => setNewLog({ ...newLog, vehiculoId: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mantenimiento</label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg" value={newLog.tipo} onChange={e => setNewLog({ ...newLog, tipo: e.target.value })} required>
                                    <option value="">Seleccionar</option>
                                    <option value="Preventivo">Preventivo</option>
                                    <option value="Correctivo">Correctivo</option>
                                    <option value="Neumáticos">Neumáticos</option>
                                    <option value="Revisión Técnica">Revisión Técnica</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea className="w-full p-2 border border-gray-300 rounded-lg" rows={3} value={newLog.descripcion} onChange={e => setNewLog({ ...newLog, descripcion: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                    <input type="date" className="w-full p-2 border border-gray-300 rounded-lg" value={newLog.fecha} onChange={e => setNewLog({ ...newLog, fecha: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Costo (Bs)</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" value={newLog.costo} onChange={e => setNewLog({ ...newLog, costo: e.target.value })} required />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Registro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenancePage;
