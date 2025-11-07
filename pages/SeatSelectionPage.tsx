import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Viaje, Asiento, EstadoAsiento } from '../types';
import SeatMap from '../components/SeatMap';
import { tripsService } from '../services/tripsService';
import { useAuth } from '../contexts/AuthContext';

const SeatSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [capacidad, setCapacidad] = useState<number>(0);
  const [mapaAsientos, setMapa] = useState<Asiento[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Asiento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const params = (location.state as any) || {};
  const origen = params.origen;
  const destino = params.destino;
  const fecha = params.fecha;

  useEffect(() => {
    const load = async () => {
      if (!origen || !destino || !fecha) {
        setError('Faltan datos de búsqueda.');
        setIsLoading(false);
        return;
      }
      try {
        // Buscar viajes en backend
        const trips = await tripsService.search(origen, destino, fecha);
        if (trips.length === 0) {
          setError('No se encontraron viajes para tu búsqueda.');
          setIsLoading(false);
          return;
        }
        // MVP: tomar el primero
        const picked = trips[0];
        setViaje(picked as any);

        // Obtener mapa de asientos real
        const seatData = await tripsService.getSeats(picked.id);
        setCapacidad(seatData.capacidad);

        const asientosAdaptados: Asiento[] = seatData.seats.map(s => ({
          id: `S${s.numero}`,
          numero: s.numero,
          piso: 1,
          estado:
            s.estado === 'ocupado'
              ? EstadoAsiento.Ocupado
              : EstadoAsiento.Disponible,
        }));
        setMapa(asientosAdaptados);
        setSelectedSeats([]);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Error al cargar el viaje.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [origen, destino, fecha]);

  const handleSeatSelect = (asiento: Asiento) => {
    if (asiento.estado === EstadoAsiento.Ocupado) return;
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === asiento.id);
      if (isSelected) {
        return prev.filter(s => s.id !== asiento.id);
      } else {
        return [...prev, asiento];
      }
    });
  };

  const total = viaje ? selectedSeats.length * (viaje.precio || 0) : 0;

  const handleConfirm = async () => {
    if (!viaje) return;
    if (selectedSeats.length === 0) {
      alert('Por favor, selecciona al menos un asiento.');
      return;
    }
    if (!token) {
      alert('Debes iniciar sesión para reservar.');
      return;
    }
    try {
      const seatNums = selectedSeats.map(s => s.numero);
      await tripsService.reserveSeats(viaje.id, seatNums.length, seatNums, token);
      navigate('/confirmacion', { state: { viaje, selectedSeats } });
    } catch (e: any) {
      alert(e.message || 'Error al reservar asientos.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-muted">Cargando detalles del viaje...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-accent">
        <p>{error}</p>
      </div>
    );
  }

  if (!viaje) {
    return (
      <div className="text-center py-10">
        <p>No se encontró el viaje.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline mb-4 inline-flex items-center gap-1 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
               fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 
              10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 
              0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
              clipRule="evenodd" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Selecciona tus Asientos
        </h1>
        <p className="text-text-muted mb-6">
          Elige tus asientos preferidos en el mapa del bus.
        </p>
        <SeatMap
          asientos={mapaAsientos}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
      </div>

      <aside className="lg:col-span-1">
        <div className="bg-surface p-6 rounded-xl shadow-lg sticky top-24">
          <h2 className="text-2xl font-bold text-primary border-b pb-3 mb-4">
            Resumen de tu Viaje
          </h2>

          <div className="flex items-center gap-4 mb-4">
            {viaje.logoEmpresa && (
              <img
                src={viaje.logoEmpresa}
                alt={`Logo ${viaje.empresa}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-bold">{viaje.empresa}</h3>
              <p className="text-sm text-text-muted">{viaje.tipoBus}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <p><strong>Origen:</strong> {viaje.origen.nombre}</p>
            <p><strong>Destino:</strong> {viaje.destino.nombre}</p>
            <p><strong>Fecha:</strong> {new Date(
              viaje.fecha + 'T00:00:00'
            ).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Horario:</strong> {viaje.horaSalida} {viaje.horaLlegada && ` - ${viaje.horaLlegada}`}</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-bold mb-2">Asientos Seleccionados:</h4>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSeats.map(s => (
                  <span key={s.id}
                        className="bg-primary-light text-white px-3 py-1 rounded-full text-sm font-medium">
                    {s.numero}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">Ningún asiento seleccionado.</p>
            )}

                        <div className="flex justify-between items-center text-2xl font-bold mt-4">
              <span>Total:</span>
              <span>${total}</span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-primary-dark transition-colors"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SeatSelectionPage;
