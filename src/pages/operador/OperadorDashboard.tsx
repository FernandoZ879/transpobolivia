import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { operadorService } from '../../services/operadorService';
import { TransportService } from '../../services/api';

const OperadorDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    vehiculosActivos: 0,
    conductores: 0,
    rutas: 0,
    alertas: 0,
    pasajerosHoy: 0,
    ingresosHoy: 0
  });
  const [proximasSalidas, setProximasSalidas] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Cargar Estadísticas Reales
        const resumen = await operadorService.getResumen();
        setStats(resumen);

        // 2. Cargar "Próximas Salidas" Reales
        const rutas = await operadorService.getRutas();
        const rutaIds = new Set(rutas.map(r => r.id));

        // Obtenemos todos los horarios (o idealmente un endpoint filtrado)
        const horarios = await TransportService.getSchedules();

        // Filtramos solo los horarios que pertenecen a mis rutas
        const misHorarios = horarios.filter((h: any) => rutaIds.has(h.rutaId));

        // Mapeamos a estructura visual
        const hoy = new Date().toISOString().split('T')[0];
        const salidas = misHorarios.slice(0, 5).map((h: any) => {
          const ruta = rutas.find(r => r.id === h.rutaId);
          return {
            id: h.id,
            ruta: ruta ? `${ruta.origen} - ${ruta.destino}` : 'Ruta no disp.',
            hora: h.horaSalida,
            fecha: hoy, // En un sistema real, esto vendría de "Viajes Generados"
            vehiculo: 'Bus Asignado',
            ocupacion: '0%' // Requiere endpoint de ocupación por viaje
          };
        });
        setProximasSalidas(salidas);

      } catch (e) {
        console.error("Error cargando dashboard", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <div className="p-10 text-center">Cargando Panel de Control...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-500">Visión general de la operación en tiempo real.</p>
        </div>
        <div className="text-right">
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Sistema Operativo</span>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-500 font-bold uppercase">Pasajeros Hoy</p>
          <p className="text-4xl font-bold text-slate-900 my-2">{stats.pasajerosHoy}</p>
          <p className="text-xs text-slate-400">Boletos vendidos para viajes de hoy</p>
        </div>
        <div className="card p-6 border-l-4 border-green-500">
          <p className="text-sm text-slate-500 font-bold uppercase">Ingresos Estimados</p>
          <p className="text-4xl font-bold text-slate-900 my-2">{stats.ingresosHoy} Bs</p>
          <p className="text-xs text-slate-400">Total ventas del día</p>
        </div>
        <div className="card p-6 border-l-4 border-orange-500">
          <p className="text-sm text-slate-500 font-bold uppercase">Alertas Flota</p>
          <p className="text-4xl font-bold text-slate-900 my-2">{stats.alertas}</p>
          <Link to="mantenimiento" className="text-xs text-blue-600 hover:underline">Ver vehículos pendientes</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabla Próximas Salidas */}
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Próximas Salidas Programadas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">Hora</th>
                  <th className="p-3">Ruta</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proximasSalidas.length > 0 ? proximasSalidas.map((salida) => (
                  <tr key={salida.id}>
                    <td className="p-3 font-bold text-slate-700">{salida.hora}</td>
                    <td className="p-3">{salida.ruta}</td>
                    <td className="p-3"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">Programado</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="p-4 text-center text-slate-400">No hay salidas próximas configuradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link to="horarios" className="btn-secondary inline-block text-xs">Gestionar Horarios</Link>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="vehiculos" className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center justify-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Flota ({stats.vehiculosActivos})</h4>
              <p className="text-xs text-slate-500">Gestionar buses</p>
            </div>
          </Link>
          <Link to="rutas" className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center justify-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Rutas ({stats.rutas})</h4>
              <p className="text-xs text-slate-500">Editar destinos</p>
            </div>
          </Link>
          <Link to="conductores" className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center justify-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Conductores ({stats.conductores})</h4>
              <p className="text-xs text-slate-500">Personal</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OperadorDashboard;
