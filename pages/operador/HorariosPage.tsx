import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Ruta, Vehiculo, Horario } from '../../types';
import { operadorService } from '../../services/operadorService';

type HorarioForm = {
  vehiculoId: string;
  diasText: string;
  horaSalida: string;
  tarifaGeneral: number;
};

type DiaSemana = Horario['dias'][number]; 
const DIAS_VALIDOS: DiaSemana[] = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

const HorariosPage: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [selectedRutaId, setSelectedRutaId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<HorarioForm>({
    defaultValues: {
      vehiculoId: '',
      diasText: '',
      horaSalida: '08:00',
      tarifaGeneral: 0,
    },
  });

  const rutasById = useMemo(() => {
    const map = new Map<string, Ruta>();
    rutas.forEach(r => map.set(r.id, r));
    return map;
  }, [rutas]);

  const vehiculosById = useMemo(() => {
    const map = new Map<string, Vehiculo>();
    vehiculos.forEach(v => map.set(v.id, v));
    return map;
  }, [vehiculos]);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const [rs, vs] = await Promise.all([
          operadorService.getRutas(),
          operadorService.getVehiculos(),
        ]);
        setRutas(rs || []);
        setVehiculos(vs || []);
      } catch (e: any) {
        setError(e.message || 'Error al cargar rutas/vehículos');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedRutaId) {
        setHorarios([]);
        return;
      }
      try {
        setError(null);
        const hs = await operadorService.getHorariosByRuta(selectedRutaId);
        setHorarios(hs || []);
      } catch (e: any) {
        setError(e.message || 'Error al cargar horarios');
      }
    })();
  }, [selectedRutaId]);

  const onSubmit = async (data: HorarioForm) => {
    try {
      setError(null);
      if (!selectedRutaId) {
        setError('Selecciona una ruta');
        return;
      }
      if (!data.vehiculoId) {
        setError('Selecciona un vehículo');
        return;
      }

      const dias = data.diasText
        ? data.diasText
            .split(',')
            .map(d => d.trim())
            .filter((d): d is DiaSemana => DIAS_VALIDOS.includes(d as DiaSemana))
        : [];

      await operadorService.saveHorario({
        rutaId: selectedRutaId,
        vehiculoId: data.vehiculoId,
        dias,
        horaSalida: data.horaSalida,
        tarifaGeneral: Number(data.tarifaGeneral || 0),
      });
      setShowModal(false);
      reset({ vehiculoId: '', diasText: '', horaSalida: '08:00', tarifaGeneral: 0 });
      const hs = await operadorService.getHorariosByRuta(selectedRutaId);
      setHorarios(hs || []);
    } catch (e: any) {
      setError(e.message || 'Error al guardar horario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar horario?')) return;
    try {
      setError(null);
      await operadorService.deleteHorario(id);
      const hs = await operadorService.getHorariosByRuta(selectedRutaId);
      setHorarios(hs || []);
    } catch (e: any) {
      setError(e.message || 'Error al eliminar horario');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-primary">Horarios</h1>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}

      <div className="bg-surface p-4 rounded shadow flex items-center gap-3">
        <label htmlFor="rutaSel" className="text-sm text-text-muted">Ruta</label>
        <select
          id="rutaSel"
          className="border p-2 rounded"
          value={selectedRutaId}
          onChange={(e) => setSelectedRutaId(e.target.value)}
        >
          <option value="">-- Selecciona una ruta --</option>
          {rutas.map(r => (
            <option key={r.id} value={r.id}>
              {r.nombre || `${r.origen} → ${r.destino}`}
            </option>
          ))}
        </select>

        <button
          className="ml-auto bg-primary text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={() => setShowModal(true)}
          disabled={!selectedRutaId}
        >
          Añadir Horario
        </button>
      </div>

      <div className="bg-surface p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-secondary mb-3">Listado</h2>
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Ruta</th>
              <th className="p-2 text-left">Vehículo</th>
              <th className="p-2 text-left">Días</th>
              <th className="p-2 text-left">Hora salida</th>
              <th className="p-2 text-left">Tarifa</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map(h => {
              const ruta = rutasById.get(h.rutaId);
              const veh = vehiculosById.get(h.vehiculoId);
              return (
                <tr key={h.id} className="border-t">
                  <td className="p-2">{ruta?.nombre || `${ruta?.origen} → ${ruta?.destino}`}</td>
                  <td className="p-2">{veh?.patente || h.vehiculoId}</td>
                  <td className="p-2">{Array.isArray(h.dias) ? h.dias.join(', ') : ''}</td>
                  <td className="p-2">{h.horaSalida}</td>
                  <td className="p-2">Bs. {Number(h.tarifaGeneral ?? 0).toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <button
                      className="text-accent hover:underline"
                      onClick={() => handleDelete(h.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {horarios.length === 0 && (
              <tr><td colSpan={6} className="p-3 text-center text-gray-500">No hay horarios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded shadow w-full max-w-lg">
            <h3 className="text-lg font-bold text-primary mb-4">Nuevo Horario</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm text-text-muted mb-1">Vehículo</label>
                <select
                  className="border p-2 rounded w-full"
                  {...register('vehiculoId', { required: true })}
                >
                  <option value="">-- Selecciona --</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.patente} — {v.modelo} ({v.capacidad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Días (coma)</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Lunes,Martes"
                  {...register('diasText')}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                                <div>
                  <label className="block text-sm text-text-muted mb-1">Hora de salida</label>
                  <input
                    type="time"
                    className="border p-2 rounded w-full"
                    {...register('horaSalida', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Tarifa (Bs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="border p-2 rounded w-full"
                    {...register('tarifaGeneral', { required: true, valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-200 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorariosPage;
