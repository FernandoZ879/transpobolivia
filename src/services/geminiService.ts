
import { GoogleGenAI } from "@google/genai";

// Asumimos que la API Key está configurada en las variables de entorno del entorno de ejecución.
// ¡No la codifiques directamente en el código!
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API Key de Google GenAI no encontrada. Las funciones de IA estarán deshabilitadas.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Obtiene una sugerencia de viaje o responde una pregunta usando Gemini.
 * @param pregunta La pregunta o solicitud del usuario.
 * @returns Una cadena con la respuesta generada por el modelo.
 */
export const obtenerSugerenciaDeViaje = async (pregunta: string): Promise<string> => {
  if (!apiKey) {
    return "La función de asistente de IA no está disponible. Falta la clave de API.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Eres un asistente de viajes experto en Bolivia. Responde de forma amigable y útil. El usuario pregunta: "${pregunta}"`,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        thinkingConfig: { thinkingBudget: 0 } // Deshabilitar para baja latencia
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    return "Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.";
  }
};
