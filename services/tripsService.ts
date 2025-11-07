// services/tripsService.ts
import { API_BASE } from '../constants';

const base = API_BASE;

export const tripsService = {
  // Compatibilidad con el front actual
  async search(origen: string, destino: string, fecha: string) {
    const r = await fetch(`${base}/search/trips?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha=${encodeURIComponent(fecha)}`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async getSeats(viajeId: string): Promise<{ capacidad: number; seats: { numero: number; estado: 'disponible' | 'ocupado' }[] }> {
    const r = await fetch(`${base}/trips/${encodeURIComponent(viajeId)}/seats`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async reserveSeats(viajeId: string, _count: number, seatNumbers: number[], token: string) {
    const r = await fetch(`${base}/trips/${encodeURIComponent(viajeId)}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seats: seatNumbers }),
    });
    if (r.status === 409) {
      throw new Error('Uno o más asientos ya fueron reservados. Actualiza el mapa e intenta con otros.');
    }
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  // Métodos nuevos (por si los quieres usar luego)
  async buscarViajes(params: { origen: string; destino: string; fecha: string }) {
    return this.search(params.origen, params.destino, params.fecha);
  },
};
