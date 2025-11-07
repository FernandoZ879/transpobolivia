// pages/operador/EmpresaPage.tsx

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Empresa } from '../../types';
import { operadorService } from '../../services/operadorService';
import { useAuth } from '../../contexts/AuthContext';

const EmpresaPage: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Empresa>();
    const { user } = useAuth(); // Aún necesitamos el usuario para saber si hay una sesión activa
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchEmpresa = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await operadorService.getEmpresa();
                if (data) {
                    setEmpresa(data);
                    reset(data);
                }
            } catch (error) {
                console.error("Error al cargar datos de la empresa", error);
                // Aquí puedes agregar un manejo de errores más visible para el usuario
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmpresa();
    }, [user, reset]); // El efecto se ejecuta cuando el usuario o la función reset cambian

    const onSubmit = async (data: Empresa) => {
        if (!empresa) return;
        setIsSuccess(false);
        try {
            const updatedData = { ...empresa, ...data };
            const result = await operadorService.updateEmpresa(updatedData);
            setEmpresa(result); // Actualizamos el estado con los datos de respuesta
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error("Error al guardar cambios de la empresa", error);
            // Manejar error en el formulario
        }
    };

    if (isLoading) {
        return <div>Cargando datos de la empresa...</div>;
    }

    if (!empresa) {
        return <div>No se encontraron datos de la empresa.</div>
    }

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-primary mb-4">Datos de mi Empresa</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-text-muted">Nombre de la Empresa</label>
                        <input id="nombre" {...register('nombre', { required: 'El nombre es obligatorio' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        {errors.nombre && <p className="text-accent text-xs mt-1">{errors.nombre.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="nit" className="block text-sm font-medium text-text-muted">NIT</label>
                        <input id="nit" {...register('nit', { required: 'El NIT es obligatorio' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                         {errors.nit && <p className="text-accent text-xs mt-1">{errors.nit.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-muted">Email de Contacto</label>
                        <input id="email" type="email" {...register('email', { required: 'El email es obligatorio' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                         {errors.email && <p className="text-accent text-xs mt-1">{errors.email.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-text-muted">Teléfono</label>
                        <input id="telefono" {...register('telefono', { required: 'El teléfono es obligatorio' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        {errors.telefono && <p className="text-accent text-xs mt-1">{errors.telefono.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="direccion" className="block text-sm font-medium text-text-muted">Dirección</label>
                        <input id="direccion" {...register('direccion')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-text-muted">URL del Logo</label>
                        <input id="logoUrl" {...register('logoUrl')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-4">
                    {isSuccess && <p className="text-green-600 text-sm">¡Datos guardados con éxito!</p>}
                    <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmpresaPage;
