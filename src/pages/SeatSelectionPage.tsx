import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TransportService } from '../services/api';

const SeatSelectionPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const scheduleId = searchParams.get('scheduleId');

    const date = searchParams.get('date');

    const [schedule, setSchedule] = useState<any>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!scheduleId) return;
            try {
                // Usamos los nuevos endpoints públicos
                const [scheduleData, occupiedData] = await Promise.all([
                    TransportService.getScheduleById(scheduleId),
                    date ? TransportService.getOccupiedSeats(scheduleId, date) : Promise.resolve([])
                ]);

                setSchedule({
                    ...scheduleData,
                    occupiedSeats: occupiedData // Agregamos los asientos ocupados al objeto schedule
                });
            } catch (error) {
                console.error('Error fetching schedule:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [scheduleId, date]);

    const toggleSeat = (seatNum: number) => {
        if (schedule?.occupiedSeats?.includes(seatNum)) return; // Can't select occupied seats

        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, seatNum]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert('Por favor selecciona al menos un asiento');
            return;
        }
        const total = selectedSeats.length * (schedule?.price || 50);
        navigate('/confirmacion', {
            state: { selectedSeats, total, scheduleId }
        });
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Cargando...</div>;
    }

    if (!schedule) {
        return <div className="container mx-auto px-4 py-12 text-center">No se encontró el horario.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary-600 p-6 text-white">
                        <h1 className="text-2xl font-bold">Selección de Asientos</h1>
                        <p className="opacity-90">Elige tus asientos preferidos</p>
                    </div>

                    <div className="p-8">
                        {/* Bus Visual */}
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="text-center text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Frente del Bus</div>
                            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                                {Array.from({ length: 40 }, (_, i) => i + 1).map((seatNum) => {
                                    const isOccupied = schedule.occupiedSeats?.includes(seatNum);
                                    const isSelected = selectedSeats.includes(seatNum);
                                    const isAisle = seatNum % 4 === 2;

                                    return (
                                        <React.Fragment key={seatNum}>
                                            <button
                                                onClick={() => toggleSeat(seatNum)}
                                                disabled={isOccupied}
                                                className={`
                                                    w-12 h-12 rounded flex items-center justify-center text-sm font-bold transition-all
                                                    ${isOccupied ? 'bg-red-500 text-white cursor-not-allowed' :
                                                        isSelected ? 'bg-green-500 text-white shadow-lg scale-110' :
                                                            'bg-white border-2 border-gray-300 hover:border-primary-500 hover:shadow-md'}
                                                `}
                                            >
                                                {seatNum}
                                            </button>
                                            {isAisle && <div className="w-12"></div>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                                <span className="text-sm text-gray-600">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-600">Seleccionado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-500 rounded"></div>
                                <span className="text-sm text-gray-600">Ocupado</span>
                            </div>
                        </div>

                        {/* Summary */}
                        {selectedSeats.length > 0 && (
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-blue-600 mb-1">Asientos seleccionados</p>
                                        <p className="text-2xl font-bold text-blue-900">{selectedSeats.join(', ')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-blue-600 mb-1">Total a pagar</p>
                                        <p className="text-3xl font-bold text-blue-900">{selectedSeats.length * schedule.price} Bs</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 btn-secondary"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={selectedSeats.length === 0}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar a Datos Pasajero
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
