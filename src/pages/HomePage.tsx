import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CIUDADES } from '../constants';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: today
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/search', { state: formData });
    };

    const handleBrowseAll = () => {
        // Redirige sin filtros para ver todo
        navigate('/search', { state: { date: today, origin: '', destination: '' } });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[650px] flex items-center justify-center bg-gray-900 overflow-hidden">
                {/* Imagen de fondo con fallback de color */}
                <div className="absolute inset-0 z-0 bg-gray-800">
                    <img
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1920&auto=format&fit=crop"
                        alt="Bus viajando por paisajes de Bolivia"
                        className="w-full h-full object-cover opacity-60"
                    />
                    {/* Gradiente para asegurar legibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl leading-tight">
                            Viaja por <span className="text-yellow-400">Bolivia</span> con Confianza
                        </h1>
                        <p className="text-xl text-gray-100 font-medium max-w-2xl mx-auto drop-shadow-md">
                            La plataforma oficial para conectar pasajeros con las mejores operadoras de transporte del país.
                        </p>
                    </div>

                    {/* Widget de Búsqueda */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                            {/* Origen */}
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Origen</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <select
                                        className="input-field pl-10 h-14 bg-white"
                                        value={formData.origin}
                                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                    >
                                        <option value="">Selecciona Origen</option>
                                        {CIUDADES.map(city => (
                                            <option key={city.id} value={city.id}>{city.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Destino */}
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Destino</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <select
                                        className="input-field pl-10 h-14 bg-white"
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                    >
                                        <option value="">Selecciona Destino</option>
                                        {CIUDADES.map(city => (
                                            <option key={city.id} value={city.id}>{city.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fecha */}
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Fecha de Salida</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <input
                                        type="date"
                                        className="input-field pl-10 h-14 bg-white"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        min={today}
                                    />
                                </div>
                            </div>

                            {/* Botón Buscar */}
                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                    BUSCAR PASAJES
                                </button>
                            </div>
                        </form>

                        {/* Botón Ver Todo Mejorado */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleBrowseAll}
                                className="group flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-all"
                            >
                                <span>Explorar todos los destinos y horarios</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">🛡️</div>
                            <h3 className="font-bold text-lg mb-2">Pagos Seguros</h3>
                            <p className="text-gray-600">Tus transacciones están protegidas y garantizadas.</p>
                        </div>
                        <div className="text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 text-2xl">⚡</div>
                            <h3 className="font-bold text-lg mb-2">Sin Filas</h3>
                            <p className="text-gray-600">Reserva desde tu celular y aborda directamente.</p>
                        </div>
                        <div className="text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">🚌</div>
                            <h3 className="font-bold text-lg mb-2">Las Mejores Flotas</h3>
                            <p className="text-gray-600">Trabajamos solo con empresas de transporte verificadas.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
