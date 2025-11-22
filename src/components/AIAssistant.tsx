import React, { useState } from 'react';
import { obtenerSugerenciaDeViaje } from '../services/geminiService';

const apiKey = process.env.API_KEY;

const AIAssistant: React.FC = () => {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!apiKey) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim()) {
      setError('Por favor, ingresa una pregunta.');
      return;
    }
    setIsLoading(true);
    setError('');
    setRespuesta('');
    try {
      const result = await obtenerSugerenciaDeViaje(pregunta);
      setRespuesta(result);
    } catch (err) {
      setError('Ocurrió un error al obtener la respuesta.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 border-l-4 border-primary-light p-6 rounded-lg mt-12">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
            <path fillRule="evenodd" d="M9.315 7.585a.75.75 0 0 1 .369-.632l4.25-2.5a.75.75 0 0 1 .913.632v5.408a.75.75 0 0 1-.22.53l-2.073 2.073a.75.75 0 0 1-1.06 0L9.47 13.28a.75.75 0 0 1-.22-.53V7.585Z" clipRule="evenodd" />
            <path d="M11.963 18.97a.75.75 0 0 1-1.06-1.06l1.06-1.061a.75.75 0 0 1 1.06 1.06l-1.06 1.06Z" />
            <path d="M14.038 18.97a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06l-1.06 1.06Z" />
            <path d="M12 20.25a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-.75-.75Z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM3.75 12a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
            <h3 className="text-lg font-bold text-primary">Asistente de Viaje IA</h3>
            <p className="text-sm text-text-muted mb-4">¿No sabes a dónde ir? ¡Pregúntame! Ej: "Actividades para 3 días en Sucre".</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="w-full flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light"
                disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                {isLoading ? 'Pensando...' : 'Preguntar'}
                </button>
            </form>
            {error && <p className="text-accent mt-2 text-sm">{error}</p>}
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-text-muted mt-2">Buscando las mejores ideas para ti...</p>
        </div>
      )}

      {respuesta && (
        <div className="mt-4 p-4 bg-surface rounded-lg">
          <p className="text-text whitespace-pre-wrap font-sans">{respuesta}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
