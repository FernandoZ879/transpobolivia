import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Ruta, Vehiculo, Horario } from '../../types';
import { operadorService } from '../../services/operadorService';

// Extendemos el tipo para el formulario localmente
type HorarioForm = {
  vehiculoId: string;
  diasText: string; // input helper "Lunes, Martes"
  horaSalida: string;
  tarifaGeneral: number;
  // Añadimos lógica visual de fechas (aunque el backend por ahora use recurrencia simple)
  fechaInicio?: string;
  fechaFin?: string;
};

const DIAS_OPTIONS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorariosPage: React.FC = () => {
  // ... (estados iguales a tu código original)
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [selectedRutaId, setSelectedRutaId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook Form
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<HorarioForm>();

  // Helpers de selección de días
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    setValue('diasText', newDays.join(','));
  };

  // Carga de datos (Igual que antes)
  useEffect(() => {
    const loadInit = async () => {
      const [r, v] = await Promise.all([operadorService.getRutas(), operadorService.getVehiculos()]);
      setRutas(r); setVehiculos(v);
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (selectedRutaId) {
      operadorService.getHorariosByRuta(selectedRutaId).then(setHorarios);
    }
  }, [selectedRutaId]);

  const onSubmit = async (data: HorarioForm) => {
    try {
      if (selectedDays.length === 0) { alert("Selecciona al menos un día"); return; }

      await operadorService.saveHorario({
        rutaId: selectedRutaId,
        vehiculoId: data.vehiculoId,
        dias: selectedDays as any, // Casteo simple
        horaSalida: data.horaSalida,
        tarifaGeneral: data.tarifaGeneral
      });

      setShowModal(false);
      reset();
      setSelectedDays([]);
      // Recargar tabla
      operadorService.getHorariosByRuta(selectedRutaId).then(setHorarios);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar itinerario?")) {
      await operadorService.deleteHorario(id);
      operadorService.getHorariosByRuta(selectedRutaId).then(setHorarios);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-900">Itinerarios y Tarifas</h1>
      </div>

      {/* Selector de Ruta Principal */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">Seleccionar Ruta a Gestionar</label>
          <select
            className="input-field"
            value={selectedRutaId}
            onChange={(e) => setSelectedRutaId(e.target.value)}
          >
            <option value="">-- Selecciona una ruta --</option>
            {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre} ({r.origen} - {r.destino})</option>)}
          </select>
        </div>
        <div className="md:self-end">
          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedRutaId}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nuevo Itinerario
          </button>
        </div>
      </div>

      {/* Tabla de Horarios */}
      {selectedRutaId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Hora Salida</th>
                <th className="p-4 font-semibold text-gray-700">Días de Operación</th>
                <th className="p-4 font-semibold text-gray-700">Vehículo Asignado</th>
                <th className="p-4 font-semibold text-gray-700">Tarifa Base</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {horarios.map(h => {
                const veh = vehiculos.find(v => v.id === h.vehiculoId);
                return (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-900 text-lg">{h.horaSalida}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {h.dias.map(d => (
                          <span key={d} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs border border-primary-100">
                            {d.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {veh ? `${veh.modelo} (${veh.capacidad} pax)` : 'No asignado'}
                    </td>
                    <td className="p-4 font-medium text-secondary-600">
                      {h.tarifaGeneral} Bs
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(h.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
                    </td>
                  </tr>
                )
              })}
              {horarios.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay itinerarios programados para esta ruta.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nuevo Horario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Programar Salida Recurrente</h2>
            <p className="text-sm text-gray-500 mb-4">Define los días y horas en que los buses saldrán automáticamente para que los clientes puedan comprar en cualquier fecha futura.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días de la semana</label>
                <div className="flex flex-wrap gap-2">
                  {DIAS_OPTIONS.map(day => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedDays.includes(day) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora Salida</label>
                  <input type="time" {...register('horaSalida', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa (Bs)</label>
                  <input type="number" step="1" {...register('tarifaGeneral', { required: true })} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo Asignado</label>
                <select {...register('vehiculoId', { required: true })} className="input-field">
                  <option value="">Seleccionar bus...</option>
                  {vehiculos.map(v => <option key={v.id} value={v.id}>{v.patente} - {v.modelo} ({v.tipo || 'Estándar'})</option>)}
                </select>
              </div>

              {/* Simulación de Vigencia para UX */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Válido Desde (Opcional)</label>
                  <input type="date" className="input-field text-xs" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hasta (Opcional)</label>
                  <input type="date" className="input-field text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Programación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorariosPage;
