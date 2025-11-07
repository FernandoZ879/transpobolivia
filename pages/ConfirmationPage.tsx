import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Viaje, Asiento } from '../types';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { viaje, selectedSeats } = (location.state as { viaje: Viaje; selectedSeats: Asiento[] }) || { viaje: null, selectedSeats: [] };

  if (!viaje || selectedSeats.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-accent mb-4">Error: Faltan datos de la reserva</h1>
        <p className="text-text-muted">No se pudo encontrar la información del viaje. Por favor, inicia la búsqueda de nuevo.</p>
        <Link to="/" className="mt-6 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const total = selectedSeats.length * viaje.precio;

  const handlePayment = () => {
    alert(`¡Gracias por tu compra!
    
Reserva confirmada para ${selectedSeats.length} pasajero(s).
Total pagado: Bs. ${total.toFixed(2)}.

Tu e-ticket con código QR ha sido enviado a tu correo electrónico y WhatsApp.
¡Buen viaje!`);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-4 inline-flex items-center gap-1 font-medium">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
            </svg>
            Volver a la selección
        </button>
      <div className="bg-surface p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-500 mx-auto mb-4">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.102 3.101-1.537-1.536a.75.75 0 0 0-1.06 1.06l2.067 2.067a.75.75 0 0 0 1.06 0l3.632-3.632Z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-extrabold text-primary">Casi Listo. ¡Confirma tu Compra!</h1>
            <p className="text-text-muted mt-2">Revisa los detalles de tu viaje antes de proceder al pago.</p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 my-6 grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold text-lg text-secondary mb-3">Detalles del Viaje</h3>
                <div className="space-y-2">
                    <p><strong className="text-text-muted w-24 inline-block">Empresa:</strong> {viaje.empresa}</p>
                    <p><strong className="text-text-muted w-24 inline-block">Ruta:</strong> {viaje.origen.nombre} → {viaje.destino.nombre}</p>
                    <p><strong className="text-text-muted w-24 inline-block">Fecha:</strong> {new Date(viaje.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p><strong className="text-text-muted w-24 inline-block">Salida:</strong> {viaje.horaSalida} hrs</p>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-secondary mb-3">Tu Reserva</h3>
                <div className="space-y-2">
                    <p><strong className="text-text-muted w-24 inline-block">Pasajeros:</strong> {selectedSeats.length}</p>
                    <p><strong className="text-text-muted w-24 inline-block">Asientos:</strong> {selectedSeats.map(s => s.numero).join(', ')}</p>
                    <p><strong className="text-text-muted w-24 inline-block">Precio/u:</strong> Bs. {viaje.precio.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <div className="text-center">
            <div className="mb-6">
                <span className="text-lg text-text-muted">Total a Pagar</span>
                <p className="text-5xl font-bold text-secondary">Bs. {total.toFixed(2)}</p>
            </div>
            <button
                onClick={handlePayment}
                className="w-full max-w-sm mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
                Pagar y Confirmar Reserva
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
