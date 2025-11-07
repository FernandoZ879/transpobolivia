import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Ruta, Parada } from '../../types';
import { operadorService } from '../../services/operadorService';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { CIUDADES } from '../../constants';

const MapPicker: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
};

const RutasPage: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<Parada>();
  const paradaFormValues = watch();

  const loadRutas = useCallback(async () => {
    try {
      setRutas(await operadorService.getRutas());
    } catch (error) {
      console.error('Error al cargar rutas:', error);
      setRutas([]);
    }
  }, []);

  useEffect(() => { loadRutas(); }, [loadRutas]);

  const handleSelectRuta = (ruta: Ruta) => setSelectedRuta(ruta);

  const onAddOrUpdateParada = async (data: Parada) => {
    if (!selectedRuta) return;
    let updatedParadas: Parada[];
    if (data.id) {
      updatedParadas = selectedRuta.paradas.map(p => p.id === data.id ? data : p);
    } else {
      updatedParadas = [...selectedRuta.paradas, { ...data, id: `p-${Date.now()}` }];
    }
    const updatedRuta = await operadorService.updateRuta({ ...selectedRuta, paradas: updatedParadas });
    setSelectedRuta(updatedRuta);
    setRutas(rutas.map(r => r.id === updatedRuta.id ? updatedRuta : r));
    reset({ id: '', nombre: '', lat: 0, lng: 0 });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue('lat', parseFloat(lat.toFixed(6)));
    setValue('lng', parseFloat(lng.toFixed(6)));
  };

  const initialPosition: [number, number] = useMemo(() => [-16.5, -68.15], []);

  // Form para crear nueva ruta
  const { register: regRuta, handleSubmit: submitRuta, reset: resetRuta, formState: { isSubmitting: creatingRuta } } = useForm<{
    nombre: string; origen: string; destino: string;
  }>({
    defaultValues: { nombre: '', origen: CIUDADES[0].id, destino: CIUDADES[1].id },
  });

  const onCreateRuta = async (data: { nombre: string; origen: string; destino: string }) => {
    const nueva = await operadorService.createRuta({ ...data, paradas: [] });
    setRutas(prev => [nueva, ...prev]);
    resetRuta({ nombre: '', origen: CIUDADES[0].id, destino: CIUDADES[1].id });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h1 className="text-2xl font-bold text-primary">Rutas</h1>

        <div className="bg-surface rounded-lg shadow-md p-4 space-y-3">
          <h3 className="font-bold text-secondary">Crear nueva ruta</h3>
          <form onSubmit={submitRuta(onCreateRuta)} className="space-y-2">
            <div>
              <label className="text-sm text-text-muted">Nombre</label>
              <input {...regRuta('nombre', { required: true })} className="w-full p-2 border rounded" placeholder="Ej: La Paz - Cochabamba" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-text-muted">Origen</label>
                <select {...regRuta('origen')} className="w-full p-2 border rounded">
                  {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-text-muted">Destino</label>
                <select {...regRuta('destino')} className="w-full p-2 border rounded">
                  {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={creatingRuta} className="w-full bg-primary text-white font-bold py-2 rounded">
              {creatingRuta ? 'Creando...' : 'Crear Ruta'}
            </button>
          </form>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-4 space-y-2">
          {rutas.map(ruta => (
            <button
              key={ruta.id}
              onClick={() => handleSelectRuta(ruta)}
              className={`w-full text-left p-3 rounded-md transition-colors ${selectedRuta?.id === ruta.id ? 'bg-primary text-white' : 'hover:bg-background'}`}
            >
              <p className="font-bold">{ruta.nombre}</p>
              <p className="text-xs">{ruta.paradas.length} paradas</p>
            </button>
          ))}
          {rutas.length === 0 && <p className="text-center p-4 text-sm text-text-muted">No hay rutas registradas.</p>}
        </div>
      </div>

      <div className="md:col-span-2 bg-surface rounded-lg shadow-md p-6">
        {selectedRuta ? (
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Gestionar Paradas para: {selectedRuta.nombre}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Paradas Actuales</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {selectedRuta.paradas.map(parada => (
                    <li key={parada.id} className="flex justify-between items-center bg-background p-2 rounded-md">
                      <span>{parada.nombre}</span>
                      <button onClick={() => reset(parada)} className="text-xs text-primary hover:underline">Editar</button>
                    </li>
                  ))}
                </ul>
                {selectedRuta.paradas.length === 0 && <p className="text-sm text-text-muted">No hay paradas definidas.</p>}
              </div>

              <form onSubmit={handleSubmit(onAddOrUpdateParada)} className="space-y-3">
                <h3 className="font-bold">{paradaFormValues.id ? 'Editando Parada' : 'Añadir Nueva Parada'}</h3>
                <input type="hidden" {...register('id')} />
                <div>
                  <label className="text-sm font-medium text-text-muted">Nombre Parada</label>
                  <input {...register('nombre', { required: true })} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-text-muted">Latitud</label>
                    <input type="number" step="any" {...register('lat', { required: true, valueAsNumber: true })} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">Longitud</label>
                    <input type="number" step="any" {...register('lng', { required: true, valueAsNumber: true })} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
                  </div>
                </div>
                <p className="text-xs text-text-muted">Haz clic en el mapa para seleccionar la ubicación.</p>
                <div className="h-48 w-full rounded-lg overflow-hidden z-0">
                  <MapContainer center={initialPosition} zoom={7} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                    <MapPicker onLocationSelect={handleLocationSelect} />
                    {paradaFormValues.lat && paradaFormValues.lng && <Marker position={[paradaFormValues.lat, paradaFormValues.lng]} />}
                  </MapContainer>
                </div>
                <div className="flex justify-end gap-2">
                  {paradaFormValues.id && <button type="button" onClick={() => reset({ id: '', nombre: '', lat: 0, lng: 0 })} className="bg-gray-200 text-text px-3 py-2 rounded-md text-sm">Cancelar Edición</button>}
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">{paradaFormValues.id ? 'Actualizar' : 'Añadir'}</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted">Selecciona una ruta para ver y gestionar sus paradas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RutasPage;
