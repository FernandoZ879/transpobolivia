import React, { useState, useEffect, useCallback } from 'react';
import { AlertaMantenimiento } from '../../types';
import { operadorService } from '../../services/operadorService';
import { useAuth } from '../../contexts/AuthContext';

const MantenimientoPage: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaMantenimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadAlertas = useCallback(async () => {
    setIsLoading(true);
    setAlertas(await operadorService.getAlertasMantenimiento());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadAlertas();
  }, [user, loadAlertas]);

  const handleMarcarRevisado = async (vehiculoId: string) => {
    alert(`Vehículo con ID ${vehiculoId} marcado para revisión. (Demo)`);
    const vehiculos = await operadorService.getVehiculos();
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      vehiculo.fechaUltimaRevision = new Date().toISOString().split('T')[0];
      await operadorService.updateVehiculo(vehiculo);
      loadAlertas();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Alertas de Mantenimiento</h1>
      {isLoading ? (
        <p>Cargando alertas...</p>
      ) : (
        <div className="bg-surface rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {alertas.length > 0 ? alertas.map(alerta => (
              <li key={alerta.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-text">Vehículo: {alerta.vehiculoPatente}</p>
                    <p className="text-sm text-text-muted">{alerta.mensaje}</p>
                    <p className="text-xs text-accent">Vencimiento: {alerta.fechaVencimiento}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarcarRevisado(alerta.vehiculoId)}
                  className="bg-secondary/20 hover:bg-secondary/40 text-secondary-dark font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap">
                  Marcar como Revisado
                </button>
              </li>
            )) : (
              <li className="p-6 text-center text-text-muted">
                ¡Excelente! No hay alertas de mantenimiento pendientes.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MantenimientoPage;
