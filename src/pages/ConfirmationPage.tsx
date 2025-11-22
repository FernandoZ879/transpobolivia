import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransportService } from '../services/api';

const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedSeats, total, scheduleId } = location.state || { selectedSeats: [], total: 0, scheduleId: null };

    const [passenger, setPassenger] = useState({
        nombre: '',
        apellido: '',
        ci: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!scheduleId) {
            alert('Error: No se encontró el horario del viaje.');
            return;
        }

        try {
            // Fetch current schedule to get latest occupied seats
            const schedules = await TransportService.getSchedules() as any[];
            const currentSchedule = schedules.find((s: any) => s.id === scheduleId);

            if (!currentSchedule) {
                alert('Error: El horario ya no está disponible.');
                return;
            }

            // Update schedule with new occupied seats and passenger info
            const newOccupiedSeats = [...currentSchedule.occupiedSeats, ...selectedSeats];

            // Create passenger records for each seat
            const newPassengers = selectedSeats.map((seat: number) => ({
                seat,
                name: `${passenger.nombre} ${passenger.apellido}`,
                ci: passenger.ci
            }));

            const existingPassengers = currentSchedule.passengers || [];

            await TransportService.updateSchedule(scheduleId, {
                occupiedSeats: newOccupiedSeats,
                passengers: [...existingPassengers, ...newPassengers]
            });

            alert('¡Reserva Confirmada! Gracias por viajar con nosotros.');
            navigate('/');
        } catch (error) {
            console.error("Booking error", error);
            alert('Hubo un error al procesar tu reserva. Por favor intenta nuevamente.');
        }
    };

    if (selectedSeats.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900">No hay asientos seleccionados</h2>
                <button onClick={() => navigate('/')} className="mt-4 btn-primary">Volver al Inicio</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-primary-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Confirmar Reserva</h1>
                    <p className="opacity-90">Completa tus datos para finalizar la compra</p>
                </div>

                <div className="p-8">
                    <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Detalles del Viaje</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-blue-600">Asientos:</span>
                                <span className="font-medium text-gray-900">{selectedSeats.join(', ')}</span>
                            </div>
                            <div>
                                <span className="block text-blue-600">Total a Pagar:</span>
                                <span className="font-bold text-gray-900 text-lg">{total} Bs</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={passenger.nombre}
                                    onChange={e => setPassenger({ ...passenger, nombre: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={passenger.apellido}
                                    onChange={e => setPassenger({ ...passenger, apellido: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={passenger.ci}
                                onChange={e => setPassenger({ ...passenger, ci: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={passenger.email}
                                onChange={e => setPassenger({ ...passenger, email: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
                            >
                                Confirmar y Pagar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
