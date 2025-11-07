// pages/operador/OperadorDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { operadorService } from '../../services/operadorService';

const quickLinks = [
  {
    to: '/operador/vehiculos',
    title: 'Gestionar Vehículos',
    description: 'Añade, edita y revisa tu flota.',
    icon: (p: any) => (
      <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           strokeWidth={1.5} stroke="currentColor">
        <path d="M11.25 3.375a.75.75 0 0 0-1.5 0V4.5h1.5V3.375Z" />
        <path fillRule="evenodd" d="M12.75 3.75a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H14.25v1.5h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V4.5h-1.5a.75.75 0 0 1-.75-.75Zm1.5 3h1.5V5.25h-1.5v1.5Z" clipRule="evenodd" />
        <path d="M1.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H1.5Z" />
        <path d="M4.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H4.5Z" />
        <path fillRule="evenodd" d="M22.5 12c0-4.073-2.91-7.46-6.825-8.485A.75.75 0 0 0 15 4.14v.36a.75.75 0 0 0 1.5 0V4.5a7.5 7.5 0 0 1 6 7.5c0 .63-.078 1.244-.228 1.834a.75.75 0 0 0 .445.895A9 9 0 0 0 6.6 18.36a.75.75 0 0 0 .898.445A7.5 7.5 0 0 1 12 19.5a.75.75 0 0 0 0-1.5 6 6 0 0 0-5.326-5.952.75.75 0 0 0-.65-1.121A9.001 9.001 0 0 0 22.5 12Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/operador/rutas',
    title: 'Definir Rutas',
    description: 'Crea nuevas rutas y gestiona paradas.',
    icon: (p: any) => (
      <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-11.25-1.518 1.518A2.25 2.25 0 0 1 13.5 6.75V15a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 15V6.75A2.25 2.25 0 0 1 6.75 4.5h4.218a2.25 2.25 0 0 1 1.518.632Z" />
      </svg>
    ),
  },
  {
    to: '/operador/mantenimiento',
    title: 'Ver Alertas',
    description: 'Revisa mantenimientos pendientes.',
    icon: (p: any) => (
      <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a1.125 1.125 0 0 1 1.591 0L16.5 13.75m-5.08-3.582L6 16.5m5.08-3.582-2.471 2.471a1.125 1.125 0 0 0 0 1.591l.524.524a1.125 1.125 0 0 0 1.59 0l2.472-2.471m-5.08-3.582L3.75 9.172a2.652 2.652 0 0 0-2.652 2.652L3.75 15.5m-1.5-1.5 5.877 5.877" />
      </svg>
    ),
  },
];

const OperadorDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resumen, setResumen] = useState<{
    vehiculosActivos: number;
    conductores: number;
    rutas: number;
    alertas: number;
  }>({
    vehiculosActivos: 0,
    conductores: 0,
    rutas: 0,
    alertas: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await operadorService.getResumen();
        setResumen({
          vehiculosActivos: data.vehiculosActivos || 0,
          conductores: data.conductores || 0,
          rutas: data.rutas || 0,
          alertas: data.alertas || 0,
        });
      } catch (e) {
        console.error('Error cargando resumen', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary">Bienvenido al Panel de Operador</h1>
        <p className="text-text-muted mt-1">
          Administra tu empresa, flota, rutas y horarios desde un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map(link => (
          <Link
            to={link.to}
            key={link.to}
            className="bg-surface p-6 rounded-lg shadow-md hover:shadow-xl hover:border-primary border-2 border-transparent transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {link.icon({
                  className: 'w-8 h-8 text-primary',
                })}
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary group-hover:text-secondary">{link.title}</h3>
                <p className="text-sm text-text-muted">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Resumen Rápido</h2>

        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 text-text-muted">Cargando datos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{resumen.vehiculosActivos}</p>
              <p className="text-sm text-text-muted">Vehículos Activos</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">{resumen.conductores}</p>
              <p className="text-sm text-text-muted">Conductores</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">{resumen.rutas}</p>
              <p className="text-sm text-text-muted">Rutas Definidas</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-accent">{resumen.alertas}</p>
              <p className="text-sm text-text-muted">Alertas de Mantenimiento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperadorDashboard;
