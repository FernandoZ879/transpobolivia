import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Empresa } from '../../types';
import { operadorService } from '../../services/operadorService';
import { useAuth } from '../../contexts/AuthContext';

const EmpresaPage: React.FC = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Empresa>();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const data = await operadorService.getEmpresa();
                if (data) {
                    // Seteamos los valores del formulario
                    reset({
                        nombre: data.nombre || '',
                        nit: data.nit || '',
                        email: data.email || '',
                        telefono: data.telefono || '',
                        direccion: data.direccion || '',
                        logoUrl: data.logoUrl || ''
                    });
                }
            } catch (error) {
                console.error("Error cargando empresa:", error);
                setMessage({ type: 'error', text: 'No se pudieron cargar los datos de la empresa.' });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user, reset]);

    const onSubmit = async (data: Empresa) => {
        setMessage(null);
        try {
            await operadorService.updateEmpresa(data);
            setMessage({ type: 'success', text: 'Información actualizada correctamente.' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
        }
    };

    if (isLoading) return <div className="p-8 text-center">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Perfil de la Empresa</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">Operador Autorizado</span>
                </div>

                <div className="p-6">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sección Identidad */}
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b pb-2">Identidad Corporativa</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial / Razón Social</label>
                            <input {...register('nombre', { required: 'Requerido' })} className="input-field" />
                            {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIT (Número de Identificación Tributaria)</label>
                            <input {...register('nit', { required: 'Requerido' })} className="input-field" />
                            {errors.nit && <span className="text-red-500 text-xs">{errors.nit.message}</span>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo (Imagen pública)</label>
                            <div className="flex gap-2">
                                <input {...register('logoUrl')} className="input-field flex-1" placeholder="https://ejemplo.com/logo.png" />
                                <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                                    {/* Previsualización simple */}
                                    <img
                                        src="https://via.placeholder.com/40?text=Logo"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Recomendado: Imagen cuadrada, fondo transparente (PNG).</p>
                        </div>

                        {/* Sección Contacto */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b pb-2">Datos de Contacto</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico Público</label>
                            <input type="email" {...register('email', { required: 'Requerido' })} className="input-field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / Celular</label>
                            <input {...register('telefono', { required: 'Requerido' })} className="input-field" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Oficina Central</label>
                            <input {...register('direccion')} className="input-field" placeholder="Av. Principal #123, Zona..." />
                        </div>

                        <div className="md:col-span-2 pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full md:w-auto"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmpresaPage;
