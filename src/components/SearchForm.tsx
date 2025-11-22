import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CIUDADES } from '../constants';
import { Ciudad } from '../types';

const SearchForm: React.FC = () => {
  const [origen, setOrigen] = useState<string>(CIUDADES[0].id);
  const [destino, setDestino] = useState<string>(CIUDADES[1].id);
  const today = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState<string>(today);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origen === destino) {
      setError("El origen y el destino no pueden ser iguales.");
      return;
    }
    setError('');
    navigate('/seleccionar-asientos', { state: { origen, destino, fecha } });
  };

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="col-span-1 md:col-span-1">
          <label htmlFor="origen" className="block text-sm font-medium text-text-muted mb-1">Origen</label>
          <select
            id="origen"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
          >
            {CIUDADES.map((ciudad: Ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label htmlFor="destino" className="block text-sm font-medium text-text-muted mb-1">Destino</label>
          <select
            id="destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
          >
            {CIUDADES.map((ciudad: Ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label htmlFor="fecha" className="block text-sm font-medium text-text-muted mb-1">Fecha de Viaje</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            min={today}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
             </svg>
            Buscar Viaje
          </button>
        </div>
      </form>
      {error && <p className="text-accent text-sm text-center mt-3">{error}</p>}
    </div>
  );
};

export default SearchForm;
