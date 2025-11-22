import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Ruta, Parada } from '../../types';
import { operadorService } from '../../services/operadorService';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { CIUDADES } from '../../constants';
import 'leaflet/dist/leaflet.css';

// Helper ultra-defensivo para obtener nombre de ciudad
const getCityName = (idOrObj: any): string => {
  try {
    if (!idOrObj) return 'Desconocido';
    if (typeof idOrObj === 'string') {
      const city = CIUDADES.find(c => c.id === idOrObj);
      return city ? city.nombre : idOrObj;
    }
    if (typeof idOrObj === 'object') {
      return idOrObj.nombre || idOrObj.id || 'Ciudad sin nombre';
    }
    return String(idOrObj);
  } catch (e) {
    return 'Error';
  }
};

// Helper para renderizar textos seguros
const safeRender = (val: any): string => {
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') return JSON.stringify(val); // Fallback para debug
  return '';
};

// Helper para normalizar rutas del backend - convierte objetos ciudad a IDs
const normalizeRuta = (ruta: any): Ruta => {
  const normalized = { ...ruta };
  // Si origen o destino son objetos, extraer solo el ID
  if (typeof normalized.origen === 'object' && normalized.origen !== null) {
    normalized.origen = normalized.origen.id || normalized.origen.nombre || String(normalized.origen);
  }
  if (typeof normalized.destino === 'object' && normalized.destino !== null) {
    normalized.destino = normalized.destino.id || normalized.destino.nombre || String(normalized.destino);
  }
  normalized.paradas = Array.isArray(normalized.paradas) ? normalized.paradas : [];
  return normalized as Ruta;
};

const MapPicker: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={position}><Popup>Punto seleccionado</Popup></Marker> : null;
};

const RutasPage: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const { register, handleSubmit, setValue, reset, watch } = useForm<Parada>();
  const paradaValues = watch();

  const { register: regRuta, handleSubmit: subRuta, reset: resRuta } = useForm<{ nombre: string, origen: string, destino: string }>();

  const loadRutas = useCallback(async () => {
    try {
      const data = await operadorService.getRutas();
      console.log("Rutas cargadas:", data); // Debug
      const normalized = Array.isArray(data) ? data.map(normalizeRuta) : [];
      setRutas(normalized);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadRutas(); }, [loadRutas]);

  const handleCreateRuta = async (data: any) => {
    try {
      const nueva = await operadorService.createRuta({ ...data, paradas: [] });
      console.log("Ruta creada:", nueva); // Debug
      const normalized = normalizeRuta(nueva);
      setRutas(prev => [normalized, ...prev]);
      resRuta();
      alert("Ruta creada. Ahora selecciona la ruta para añadir paradas.");
    } catch (e) {
      console.error(e);
      alert("Error al crear ruta");
    }
  };

  const handleSaveParada = async (data: Parada) => {
    if (!selectedRuta) return;
    const currentParadas = Array.isArray(selectedRuta.paradas) ? selectedRuta.paradas : [];
    const nuevasParadas = data.id
      ? currentParadas.map(p => p.id === data.id ? data : p)
      : [...currentParadas, { ...data, id: Date.now().toString() }];

    try {
      const updated = await operadorService.updateRuta({ ...selectedRuta, paradas: nuevasParadas });
      const normalized = normalizeRuta(updated);
      setSelectedRuta(normalized);
      setRutas(rutas.map(r => r.id === normalized.id ? normalized : r));
      reset({ id: '', nombre: '', lat: 0, lng: 0 });
    } catch (e) {
      console.error(e);
      alert("Error al guardar parada");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
      {/* Panel Izquierdo */}
      <div className="md:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="card p-4 bg-blue-50 border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Nueva Ruta</h3>
          <form onSubmit={subRuta(handleCreateRuta)} className="space-y-3">
            <input {...regRuta('nombre', { required: true })} placeholder="Nombre (Ej: Directo LP-SCZ)" className="input-field text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <select {...regRuta('origen')} className="input-field text-sm">
                {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <select {...regRuta('destino')} className="input-field text-sm">
                {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full text-sm py-2">Crear Ruta</button>
          </form>
        </div>

        <div className="space-y-2">
          {rutas.map(r => (
            <div key={r.id}
              onClick={() => { setSelectedRuta(r); reset({ id: '', nombre: '', lat: 0, lng: 0 }); }}
              className={`card p-3 cursor-pointer transition-all border-l-4 ${selectedRuta?.id === r.id ? 'border-l-blue-600 bg-blue-50' : 'border-l-transparent hover:bg-gray-50'}`}>
              <p className="font-bold text-gray-800">{safeRender(r.nombre)}</p>
              <p className="text-xs text-gray-500">
                {getCityName(r.origen)} ➝ {getCityName(r.destino)} • {Array.isArray(r.paradas) ? r.paradas.length : 0} paradas
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="md:col-span-8 card flex flex-col h-full relative">
        {selectedRuta ? (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-20">
              <h2 className="font-bold text-lg">Editando: {safeRender(selectedRuta.nombre)}</h2>
              <button onClick={() => {
                if (confirm("¿Borrar ruta?")) {
                  operadorService.deleteRuta(selectedRuta.id).then(() => {
                    setSelectedRuta(null);
                    loadRutas();
                  });
                }
              }} className="text-red-500 text-sm hover:underline">Eliminar Ruta</button>
            </div>

            <div className="flex-1 bg-gray-100 relative z-0">
              <MapContainer center={[-16.5, -68.15]} zoom={6} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <MapPicker onLocationSelect={(lat, lng) => { setValue('lat', lat); setValue('lng', lng); }} />
                {Array.isArray(selectedRuta.paradas) && selectedRuta.paradas.map(p => (
                  <Marker key={p.id} position={[p.lat, p.lng]}>
                    <Popup>{safeRender(p.nombre)}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit(handleSaveParada)} className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-gray-500">Nombre Parada</label>
                  <input {...register('nombre', { required: true })} className="input-field" placeholder="Ej: Terminal Bimodal" />
                </div>
                <div className="w-24">
                  <label className="text-xs font-bold text-gray-500">Lat</label>
                  <input {...register('lat', { valueAsNumber: true })} className="input-field bg-gray-50" readOnly />
                </div>
                <div className="w-24">
                  <label className="text-xs font-bold text-gray-500">Lng</label>
                  <input {...register('lng', { valueAsNumber: true })} className="input-field bg-gray-50" readOnly />
                </div>
                <button type="submit" className="btn-secondary whitespace-nowrap">
                  {paradaValues.id ? 'Actualizar' : 'Añadir Parada'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Selecciona una ruta para editar sus paradas en el mapa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RutasPage;
