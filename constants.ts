
import { Ciudad, Viaje, EstadoAsiento, Asiento } from './types';

export const CIUDADES: Ciudad[] = [
  { id: 'LPB', nombre: 'La Paz' },
  { id: 'CBB', nombre: 'Cochabamba' },
  { id: 'SRZ', nombre: 'Santa Cruz' },
  { id: 'SRE', nombre: 'Sucre' },
  { id: 'PSI', nombre: 'Potosí' },
  { id: 'ORU', nombre: 'Oruro' },
  { id: 'TJA', nombre: 'Tarija' },
];

const generarAsientos = (): Asiento[] => {
    const asientos: Asiento[] = [];
    const filas = 12;
    const asientosPorFila = 4;
    for (let i = 1; i <= filas; i++) {
        for (let j = 1; j <= asientosPorFila; j++) {
            const numero = (i - 1) * asientosPorFila + j;
            asientos.push({
                id: `P1-${numero}`,
                numero: numero,
                piso: 1,
                estado: Math.random() > 0.7 ? EstadoAsiento.Ocupado : EstadoAsiento.Disponible,
            });
        }
    }
    return asientos;
};

export const VIAJES_DISPONIBLES: Viaje[] = [
  {
    id: '1',
    origen: CIUDADES[0], // La Paz
    destino: CIUDADES[1], // Cochabamba
    fecha: '2024-08-15',
    horaSalida: '20:00',
    horaLlegada: '04:00',
    empresa: 'Trans Copacabana',
    logoEmpresa: 'https://picsum.photos/seed/copa/40/40',
    precio: 120,
    tipoBus: 'Bus Cama',
    asientos: generarAsientos(),
  },
  {
    id: '2',
    origen: CIUDADES[0], // La Paz
    destino: CIUDADES[1], // Cochabamba
    fecha: '2024-08-15',
    horaSalida: '21:30',
    horaLlegada: '05:30',
    empresa: 'Bolivar',
    logoEmpresa: 'https://picsum.photos/seed/bolivar/40/40',
    precio: 110,
    tipoBus: 'Semicama',
    asientos: generarAsientos(),
  },
  {
    id: '3',
    origen: CIUDADES[1], // Cochabamba
    destino: CIUDADES[2], // Santa Cruz
    fecha: '2024-08-16',
    horaSalida: '19:00',
    horaLlegada: '06:00',
    empresa: 'El Dorado',
    logoEmpresa: 'https://picsum.photos/seed/dorado/40/40',
    precio: 150,
    tipoBus: 'Bus Cama',
    asientos: generarAsientos(),
  },
];
export const API_BASE = 'http://localhost:3000';
