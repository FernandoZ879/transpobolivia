// types.ts

export interface Ciudad {
  id: string;
  nombre: string;
}

export interface Viaje {
  id: string; // viajeId (base64url de horarioId|fecha)
  origen: Ciudad;
  destino: Ciudad;
  fecha: string;
  horaSalida: string;
  horaLlegada?: string;
  empresa: string;
  logoEmpresa: string;
  precio: number;
  tipoBus: string;
  asientos?: Asiento[];
}

export enum EstadoAsiento {
  Disponible = 'disponible',
  Ocupado = 'ocupado',
  Seleccionado = 'seleccionado',
}

export interface Asiento {
  id: string;
  numero: number;
  piso: number;
  estado: EstadoAsiento;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'user' | 'operador' | 'super-admin';
  empresaId?: string;
}

// Operador

export interface Empresa {
  id: string;
  userId: string;
  nit: string;
  nombre: string;
  logoUrl: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface Vehiculo {
  id: string;
  empresaId: string;
  patente: string;
  modelo: string;
  capacidad: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  fechaUltimaRevision: string;
}

export interface Conductor {
  id: string;
  empresaId: string;
  nombre: string;
  cedula: string;
  tipoLicencia: 'A' | 'B' | 'C' | 'P';
  vencimientoLicencia: string;
  estado: 'activo' | 'inactivo';
}

export interface Parada {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

export interface Ruta {
  id: string;
  empresaId: string;
  nombre: string;
  origen: string;
  destino: string;
  paradas: Parada[];
}

export interface Horario {
  id: string;
  empresaId: string;
  rutaId: string;
  vehiculoId: string;
  dias: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo')[];
  horaSalida: string;
  tarifaGeneral: number;
}

export interface AlertaMantenimiento {
  id: string;
  vehiculoId: string;
  vehiculoPatente: string;
  mensaje: string;
  fechaVencimiento: string;
}
