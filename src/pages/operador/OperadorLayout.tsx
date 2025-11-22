
import React, { Fragment } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';

// Import pages for the operator module
import OperadorDashboard from './OperadorDashboard';
import EmpresaPage from './EmpresaPage';
import VehiculosPage from './VehiculosPage';
import ConductoresPage from './ConductoresPage';
import RutasPage from './RutasPage';
import HorariosPage from './HorariosPage';
import MantenimientoPage from './MantenimientoPage';

const sidebarNavItems = [
  { href: '', text: 'Dashboard', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> },
  { href: 'empresa', text: 'Mi Empresa', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-5.25a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25V21M6.75 3v2.25" /></svg> },
  { href: 'vehiculos', text: 'Vehículos', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M11.25 3.375a.75.75 0 0 0-1.5 0V4.5h1.5V3.375Z" /><path fillRule="evenodd" d="M12.75 3.75a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H14.25v1.5h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V4.5h-1.5a.75.75 0 0 1-.75-.75Zm1.5 3h1.5V5.25h-1.5v1.5Z" clipRule="evenodd" /><path d="M1.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H1.5Z" /><path d="M4.5 18.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H4.5Z" /><path fillRule="evenodd" d="M22.5 12c0-4.073-2.91-7.46-6.825-8.485A.75.75 0 0 0 15 4.14v.36a.75.75 0 0 0 1.5 0V4.5a7.5 7.5 0 0 1 6 7.5c0 .63-.078 1.244-.228 1.834a.75.75 0 0 0 .445.895A9 9 0 0 0 6.6 18.36a.75.75 0 0 0 .898.445A7.5 7.5 0 0 1 12 19.5a.75.75 0 0 0 0-1.5 6 6 0 0 0-5.326-5.952.75.75 0 0 0-.65-1.121A9.001 9.001 0 0 0 22.5 12Z" clipRule="evenodd" /></svg> },
  { href: 'conductores', text: 'Conductores', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.025A6.721 6.721 0 0 1 9.5 19.5h.008c.008.026.017.052.026.078Z" /></svg> },
  { href: 'rutas', text: 'Rutas', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-11.25-1.518 1.518A2.25 2.25 0 0 1 13.5 6.75V15a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 15V6.75A2.25 2.25 0 0 1 6.75 4.5h4.218a2.25 2.25 0 0 1 1.518.632Z" /></svg> },
  { href: 'horarios', text: 'Horarios y Tarifas', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  { href: 'mantenimiento', text: 'Mantenimiento', icon: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a1.125 1.125 0 0 1 1.591 0L16.5 13.75m-5.08-3.582L6 16.5m5.08-3.582-2.471 2.471a1.125 1.125 0 0 0 0 1.591l.524.524a1.125 1.125 0 0 0 1.59 0l2.472-2.471m-5.08-3.582L3.75 9.172a2.652 2.652 0 0 0-2.652 2.652L3.75 15.5m-1.5-1.5 5.877 5.877m0 0L15.5 3.75m-3.75 3.75L3.75 15.5m0 0h11.25" /></svg> },
];

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
    const currentSection = sidebarNavItems.find(item => item.href === pathnames[1])?.text || 'Operador';
    
    return (
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link to="/operador" className="text-text-muted hover:text-primary">Panel Operador</Link>
                </li>
                {pathnames.length > 1 && (
                    <li className="flex items-center">
                        <span className="mx-2">/</span>
                        <span className="text-text font-medium">{currentSection}</span>
                    </li>
                )}
            </ol>
        </nav>
    );
};

const OperadorLayout: React.FC = () => {
  const base = "/operador/";
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <div className="bg-surface rounded-lg shadow-md p-4 sticky top-24">
          <nav className="flex flex-col gap-2">
            {sidebarNavItems.map(item => (
                <NavLink
                  key={item.href}
                  to={base + item.href}
                  end={item.href === ''}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                      ? 'bg-primary-light text-white' 
                      : 'text-text-muted hover:bg-background hover:text-primary'
                    }`
                  }
                >
                    {item.icon({className: "w-5 h-5"})}
                    <span>{item.text}</span>
                </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<OperadorDashboard />} />
          <Route path="empresa" element={<EmpresaPage />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
          <Route path="conductores" element={<ConductoresPage />} />
          <Route path="rutas" element={<RutasPage />} />
          <Route path="horarios" element={<HorariosPage />} />
          <Route path="mantenimiento" element={<MantenimientoPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default OperadorLayout;
