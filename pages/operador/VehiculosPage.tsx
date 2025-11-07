// pages/operador/VehiculosPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Vehiculo } from '../../types';
import { operadorService } from '../../services/operadorService';

const estadosVehiculo: Vehiculo['estado'][] = ['activo', 'inactivo', 'mantenimiento'];

const VehiculoForm: React.FC<{
  vehiculo?: Vehiculo;
  onSave: () => void;
  onCancel: () => void;
}> = ({ vehiculo, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<Vehiculo, 'id' | 'empresaId' | 'empresa'>>({
    defaultValues: vehiculo || {
      patente: '',
      modelo: '',
      capacidad: 40,
      estado: 'activo',
      fechaUltimaRevision: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: Omit<Vehiculo, 'id' | 'empresaId' | 'empresa'>) => {
    try {
      if (vehiculo?.id) {
        await operadorService.updateVehiculo(vehiculo.id, data);
      } else {
        await operadorService.addVehiculo(data);
      }
      onSave();
    } catch (error: any) {
      console.error('Error al guardar vehículo:', error);
      alert(error.message || 'Error al guardar vehículo');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-4">{vehiculo ? 'Editar' : 'Añadir'} Vehículo</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="patente" className="block text-sm font-medium text-text-muted">Patente</label>
            <input id="patente" {...register('patente', { required: 'La patente es obligatoria' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.patente && <p className="text-accent text-xs mt-1">{errors.patente.message}</p>}
          </div>
          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-text-muted">Modelo</label>
            <input id="modelo" {...register('modelo', { required: 'El modelo es obligatorio' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.modelo && <p className="text-accent text-xs mt-1">{errors.modelo.message}</p>}
          </div>
          <div>
            <label htmlFor="capacidad" className="block text-sm font-medium text-text-muted">Capacidad</label>
            <input id="capacidad" type="number" {...register('capacidad', { required: 'La capacidad es obligatoria', valueAsNumber: true })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.capacidad && <p className="text-accent text-xs mt-1">{errors.capacidad.message}</p>}
          </div>
          <div>
            <label htmlFor="fechaUltimaRevision" className="block text-sm font-medium text-text-muted">Última Revisión</label>
            <input id="fechaUltimaRevision" type="date" {...register('fechaUltimaRevision', { required: 'La fecha es obligatoria' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.fechaUltimaRevision && <p className="text-accent text-xs mt-1">{errors.fechaUltimaRevision.message}</p>}
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-text-muted">Estado</label>
            <select id="estado" {...register('estado')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {estadosVehiculo.map(estado => (
                <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-text font-bold py-2 px-4 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VehiculosPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | undefined>(undefined);

  const loadVehiculos = useCallback(async () => {
    try {
      const data = await operadorService.getVehiculos();
      setVehiculos(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setVehiculos([]);
    }
  }, []);

  useEffect(() => {
    loadVehiculos();
  }, [loadVehiculos]);

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedVehiculo(undefined);
    loadVehiculos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await operadorService.deleteVehiculo(id);
        loadVehiculos();
      } catch (e: any) {
        alert(e.message || 'Error al eliminar vehículo');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestión de Vehículos</h1>
        <button onClick={() => { setSelectedVehiculo(undefined); setIsFormOpen(true); }} className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg">
          Añadir Vehículo
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-text-muted">
          <thead className="text-xs text-text uppercase bg-background">
            <tr>
              <th scope="col" className="px-6 py-3">Patente</th>
              <th scope="col" className="px-6 py-3">Modelo</th>
              <th scope="col" className="px-6 py-3">Capacidad</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Última Revisión</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map(v => (
              <tr key={v.id} className="bg-surface border-b hover:bg-background/50">
                <th scope="row" className="px-6 py-4 font-medium text-text whitespace-nowrap">{v.patente}</th>
                <td className="px-6 py-4">{v.modelo}</td>
                <td className="px-6 py-4">{v.capacidad}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${v.estado === 'activo' ? 'bg-green-100 text-green-800' : v.estado === 'inactivo' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {v.estado}
                  </span>
                </td>
                <td className="px-6 py-4">{v.fechaUltimaRevision}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setSelectedVehiculo(v); setIsFormOpen(true); }} className="font-medium text-primary hover:underline">Editar</button>
                  <button onClick={() => handleDelete(v.id)} className="font-medium text-accent hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehiculos.length === 0 && <p className="text-center p-4 text-text-muted">No hay vehículos registrados.</p>}
      </div>

      {isFormOpen && (
        <VehiculoForm
          vehiculo={selectedVehiculo}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default VehiculosPage;
