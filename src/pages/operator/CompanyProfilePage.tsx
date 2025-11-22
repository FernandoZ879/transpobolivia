import React, { useState, useEffect } from 'react';
import { TransportService } from '../../services/api';

const CompanyProfilePage: React.FC = () => {
    const [profile, setProfile] = useState({
        razonSocial: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        sitioWeb: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await TransportService.getCompanyProfile();
                setProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TransportService.updateCompanyProfile(profile);
            setIsEditing(false);
            alert('Perfil de empresa actualizado correctamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al actualizar el perfil');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12">Cargando...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Perfil de Empresa</h1>
                <p className="text-gray-500">Administra la información de tu empresa.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                                value={profile.razonSocial}
                                onChange={e => setProfile({ ...profile, razonSocial: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                                value={profile.nit}
                                onChange={e => setProfile({ ...profile, nit: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                            value={profile.direccion}
                            onChange={e => setProfile({ ...profile, direccion: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                disabled={!isEditing}
                                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                                value={profile.telefono}
                                onChange={e => setProfile({ ...profile, telefono: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                disabled={!isEditing}
                                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                        <input
                            type="text"
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                            value={profile.sitioWeb}
                            onChange={e => setProfile({ ...profile, sitioWeb: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="btn-primary"
                            >
                                Editar Perfil
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Guardar Cambios
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
