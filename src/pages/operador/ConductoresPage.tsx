import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Conductor } from '../../types';
import { operadorService } from '../../services/operadorService';

type ConductorFormInput = Omit<Conductor, 'id' | 'empresaId'>;

const ConductorForm: React.FC<{
  conductor?: Conductor;
  onSave: () => void;
  onCancel: () => void;
}> = ({ conductor, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConductorFormInput>({
    defaultValues: conductor || {
      nombre: '',
      cedula: '',
      tipoLicencia: 'A',
      vencimientoLicencia: '',
      estado: 'activo',
    },
  });

  const onSubmit = async (data: ConductorFormInput) => {
    if (conductor?.id) {
      await operadorService.updateConductor({ ...data, id: conductor.id });
    } else {
      await operadorService.addConductor(data);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-4">{conductor ? 'Editar' : 'Añadir'} Conductor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-text-muted">Nombre Completo</label>
            <input id="nombre" {...register('nombre', { required: 'El nombre es requerido' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.nombre && <p className="text-accent text-xs mt-1">{errors.nombre.message}</p>}
          </div>
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-text-muted">Cédula de Identidad</label>
            <input id="cedula" {...register('cedula', { required: 'La cédula es requerida' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.cedula && <p className="text-accent text-xs mt-1">{errors.cedula.message}</p>}
          </div>
          <div>
            <label htmlFor="tipoLicencia" className="block text-sm font-medium text-text-muted">Tipo de Licencia</label>
            <select id="tipoLicencia" {...register('tipoLicencia')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="P">P</option>
            </select>
          </div>
          <div>
            <label htmlFor="vencimientoLicencia" className="block text-sm font-medium text-text-muted">Vencimiento de Licencia</label>
            <input id="vencimientoLicencia" type="date" {...register('vencimientoLicencia', { required: 'La fecha es requerida' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.vencimientoLicencia && <p className="text-accent text-xs mt-1">{errors.vencimientoLicencia.message}</p>}
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-text-muted">Estado</label>
            <select id="estado" {...register('estado')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-text font-bold py-2 px-4 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConductoresPage: React.FC = () => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState<Conductor | undefined>(undefined);

  const loadData = useCallback(async () => {
    try {
      setConductores(await operadorService.getConductores());
    } catch (error) {
      console.error('Error al cargar conductores:', error);
      setConductores([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedConductor(undefined);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestión de Conductores</h1>
        <button onClick={() => { setSelectedConductor(undefined); setIsFormOpen(true); }} className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg">
          Añadir Conductor
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-text-muted">
          <thead className="text-xs text-text uppercase bg-background">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Cédula</th>
              <th className="px-6 py-3">Licencia</th>
              <th className="px-6 py-3">Vencimiento</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {conductores.map(c => (
              <tr key={c.id} className="bg-surface border-b hover:bg-background/50">
                <td className="px-6 py-4 font-medium text-text">{c.nombre}</td>
                <td className="px-6 py-4">{c.cedula}</td>
                <td className="px-6 py-4">{c.tipoLicencia}</td>
                <td className="px-6 py-4">{c.vencimientoLicencia}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${c.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => { setSelectedConductor(c); setIsFormOpen(true); }} className="font-medium text-primary hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {conductores.length === 0 && <p className="text-center p-4">No hay conductores registrados.</p>}
      </div>
      {isFormOpen && (
        <ConductorForm
          conductor={selectedConductor}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ConductoresPage;
