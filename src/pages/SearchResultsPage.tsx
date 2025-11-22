import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransportService } from '../services/api';
import { CIUDADES } from '../constants';

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialState = location.state || {};

    const [filters, setFilters] = useState({
        origin: initialState.origin || '',
        destination: initialState.destination || '',
        date: initialState.date || new Date().toISOString().split('T')[0],
        minPrice: 0,
        maxPrice: 500,
        company: ''
    });

    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await TransportService.searchTrips(filters.origin, filters.destination, filters.date);
                setTrips(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError('No pudimos cargar los viajes. Intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [filters.origin, filters.destination, filters.date]);

    const filteredTrips = useMemo(() => {
        return trips.filter(trip => {
            const matchesPrice = trip.precio >= filters.minPrice && trip.precio <= filters.maxPrice;
            const matchesCompany = filters.company ? trip.empresa === filters.company : true;
            return matchesPrice && matchesCompany;
        });
    }, [trips, filters.minPrice, filters.maxPrice, filters.company]);

    const uniqueCompanies = useMemo(() => [...new Set(trips.map(t => t.empresa))], [trips]);

    const handleSelect = (viajeId: string, scheduleId: string) => {
        const token = localStorage.getItem('transpobolivia_token');
        if (!token) {
            // Si no está logueado, redirigir a login guardando la intención
            navigate('/login', { state: { from: location } });
            return;
        }
        // Usamos scheduleId (UUID) en lugar de viajeId (encoded) para la selección de asientos
        navigate(`/seleccionar-asientos?scheduleId=${scheduleId}&date=${filters.date}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filtros */}
                <aside className="w-full lg:w-1/4 space-y-6">
                    <div className="card p-6">
                        <h2 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Filtros</h2>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origen</label>
                            <select
                                className="input-field text-sm"
                                value={filters.origin}
                                onChange={e => setFilters({ ...filters, origin: e.target.value })}
                            >
                                <option value="">Cualquier origen</option>
                                {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destino</label>
                            <select
                                className="input-field text-sm"
                                value={filters.destination}
                                onChange={e => setFilters({ ...filters, destination: e.target.value })}
                            >
                                <option value="">Cualquier destino</option>
                                {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                            <input
                                type="date"
                                className="input-field text-sm"
                                value={filters.date}
                                onChange={e => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>

                        <div className="mb-6 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máx: {filters.maxPrice} Bs</label>
                            <input
                                type="range"
                                min="0" max="500" step="10"
                                value={filters.maxPrice}
                                onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                        </div>

                        {uniqueCompanies.length > 0 && (
                            <div className="mb-4 pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="company"
                                            checked={filters.company === ''}
                                            onChange={() => setFilters({ ...filters, company: '' })}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-600">Todas</span>
                                    </label>
                                    {uniqueCompanies.map(comp => (
                                        <label key={comp} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="company"
                                                value={comp}
                                                checked={filters.company === comp}
                                                onChange={() => setFilters({ ...filters, company: comp })}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-600">{comp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Resultados */}
                <main className="w-full lg:w-3/4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Viajes Disponibles</h1>
                        <p className="text-gray-500 text-sm">
                            {filters.origin ? filters.origin : 'Cualquier lugar'} a {filters.destination ? filters.destination : 'cualquier destino'} • {filters.date}
                        </p>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium">Buscando las mejores opciones...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-4 rounded-lg text-red-700 border border-red-100 text-center">{error}</div>
                    ) : filteredTrips.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🚌</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No encontramos viajes</h3>
                            <p className="text-gray-500">Intenta cambiar la fecha o relajar los filtros de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTrips.map((trip) => (
                                <div key={trip.id} className="card p-5 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-center">
                                    {/* Info Empresa y Hora */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden border border-gray-200">
                                                {trip.logoEmpresa ? <img src={trip.logoEmpresa} alt={trip.empresa} className="w-full h-full object-cover" /> : trip.empresa.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{trip.empresa}</h3>
                                                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100">{trip.tipoBus}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-center md:text-left gap-4">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">{trip.horaSalida}</p>
                                                {/* CORRECCIÓN AQUÍ: Renderizar string, no objeto */}
                                                <p className="text-sm text-gray-500 font-medium">{typeof trip.origen === 'object' ? trip.origen.nombre : trip.origen}</p>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center px-4">
                                                <span className="text-xs text-gray-400 mb-1">{trip.duracionEstimada}</span>
                                                <div className="w-full h-px bg-gray-300 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-400">--:--</p>
                                                {/* CORRECCIÓN AQUÍ: Renderizar string, no objeto */}
                                                <p className="text-sm text-gray-500 font-medium">{typeof trip.destino === 'object' ? trip.destino.nombre : trip.destino}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Precio y Acción */}
                                    <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between items-center gap-2 bg-gray-50 md:bg-transparent -mx-5 md:mx-0 p-4 md:p-0 mt-2 md:mt-0 rounded-b-xl md:rounded-none">
                                        <div className="text-left md:text-center">
                                            <p className="text-xs text-gray-500">Precio por persona</p>
                                            <p className="text-3xl font-bold text-secondary-600">{trip.precio} <span className="text-sm font-normal text-gray-600">Bs</span></p>
                                        </div>
                                        <div className="flex flex-col items-end md:items-center w-auto">
                                            <button
                                                onClick={() => handleSelect(trip.id, trip.scheduleId)}
                                                className="btn-primary py-2 px-8 text-sm w-full md:w-auto whitespace-nowrap"
                                            >
                                                Seleccionar
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2 font-medium">{trip.disponibles} asientos libres</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchResultsPage;
