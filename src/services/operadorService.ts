// services/operadorService.ts
import { Empresa, Vehiculo, Conductor, Ruta, Horario } from '../types';
import { API_BASE } from '../constants';

const base = API_BASE;

const authHeaders = () => {
  const token = localStorage.getItem('transpobolivia_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const json = async (r: Response) => {
  const text = await r.text();
  if (!r.ok) {
    try {
      const obj = text ? JSON.parse(text) : {};
      throw new Error(typeof obj === 'string' ? obj : JSON.stringify(obj));
    } catch {
      throw new Error(text || 'Error en la solicitud');
    }
  }
  return text ? JSON.parse(text) : null;
};

// Ayudante para firmas con objeto que incluye id
const isObjectWithId = (arg: any): arg is { id: string } =>
  typeof arg === 'object' && arg !== null && typeof arg.id === 'string';

// Tipos auxiliares para Horarios
type DiaSemana = Horario['dias'][number];
const DIAS_VALIDOS: readonly DiaSemana[] = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
] as const;

type SaveHorarioDTO = Omit<Horario, 'id' | 'empresaId'>;
type UpdateHorarioDTO = Partial<Omit<Horario, 'empresaId'>>;

const normalizeDias = (dias: string[] | SaveHorarioDTO['dias']): SaveHorarioDTO['dias'] => {
  // Filtra/normaliza por si llega string[]
  return (dias as string[])
    .map(d => (typeof d === 'string' ? d.trim() : d))
    .filter((d): d is DiaSemana => DIAS_VALIDOS.includes(d as DiaSemana));
};

export const operadorService = {
  // Empresa
  async getEmpresa(): Promise<Empresa> {
    return json(
      await fetch(`${base}/empresa/me`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      }),
    );
  },

  async updateEmpresa(data: Partial<Empresa>): Promise<Empresa> {
    return json(
      await fetch(`${base}/empresa`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      }),
    );
  },

  async getResumen(): Promise<{
    vehiculosActivos: number;
    conductores: number;
    rutas: number;
    alertas: number;
    pasajerosHoy: number;
    ingresosHoy: number;
  }> {
    const [summaryRes, alertasRes] = await Promise.all([
      fetch(`${base}/empresa/summary`, { headers: { ...authHeaders() } }),
      fetch(`${base}/mantenimiento/alertas`, { headers: { ...authHeaders() } }),
    ]);
    const summary = await json(summaryRes);
    const alertas = await json(alertasRes);
    return { ...summary, alertas: Array.isArray(alertas) ? alertas.length : 0 };
  },

  // Vehículos
  async getVehiculos(): Promise<Vehiculo[]> {
    return json(await fetch(`${base}/vehiculos`, { headers: { ...authHeaders() } }));
  },

  async addVehiculo(data: Omit<Vehiculo, 'id' | 'empresaId' | 'empresa'>): Promise<Vehiculo> {
    return json(
      await fetch(`${base}/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      }),
    );
  },

  async updateVehiculo(arg1: any, arg2?: any): Promise<Vehiculo> {
    const id = isObjectWithId(arg1) ? arg1.id : arg1;
    const data = isObjectWithId(arg1) ? { ...arg1 } : arg2 || {};
    delete (data as any).id;
    return json(
      await fetch(`${base}/vehiculos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      }),
    );
  },

  async deleteVehiculo(id: string): Promise<void> {
    await json(
      await fetch(`${base}/vehiculos/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }),
    );
  },

  // Conductores
  async getConductores(): Promise<Conductor[]> {
    return json(await fetch(`${base}/conductores`, { headers: { ...authHeaders() } }));
  },

  async addConductor(data: Omit<Conductor, 'id' | 'empresaId' | 'empresa'>): Promise<Conductor> {
    return json(
      await fetch(`${base}/conductores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      }),
    );
  },

  async updateConductor(data: Partial<Conductor> & { id: string }): Promise<Conductor> {
    const { id, ...updateData } = data;
    return json(
      await fetch(`${base}/conductores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updateData),
      }),
    );
  },

  // Rutas
  async getRutas(): Promise<Ruta[]> {
    return json(await fetch(`${base}/rutas`, { headers: { ...authHeaders() } }));
  },

  async createRuta(data: Omit<Ruta, 'id' | 'empresaId'> & { paradas?: Ruta['paradas'] }): Promise<Ruta> {
    const payload = { ...data, paradas: data.paradas || [] };
    return json(
      await fetch(`${base}/rutas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      }),
    );
  },

  async updateRuta(ruta: Ruta): Promise<Ruta> {
    return json(
      await fetch(`${base}/rutas/${ruta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(ruta),
      }),
    );
  },

  async deleteRuta(id: string): Promise<void> {
    await json(await fetch(`${base}/rutas/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }));
  },

  // Horarios
  async getHorariosByRuta(rutaId: string): Promise<Horario[]> {
    return json(
      await fetch(`${base}/horarios?rutaId=${encodeURIComponent(rutaId)}`, {
        headers: { ...authHeaders() },
      }),
    );
  },

  async saveHorario(data: SaveHorarioDTO): Promise<Horario> {
    const payload: SaveHorarioDTO = {
      ...data,
      dias: normalizeDias(data.dias),
      tarifaGeneral: Number((data as any).tarifaGeneral ?? 0),
    };
    return json(
      await fetch(`${base}/horarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      }),
    );
  },

  async updateHorario(id: string, data: UpdateHorarioDTO): Promise<Horario> {
    const payload: UpdateHorarioDTO = {
      ...data,
      dias: data.dias ? normalizeDias(data.dias as any) : undefined,
      tarifaGeneral: data.tarifaGeneral != null ? Number(data.tarifaGeneral) : undefined,
    };
    return json(
      await fetch(`${base}/horarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      }),
    );
  },

  async deleteHorario(id: string): Promise<void> {
    await json(
      await fetch(`${base}/horarios/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      }),
    );
  },

  // Mantenimiento
  async getAlertasMantenimiento(): Promise<any[]> {
    return json(await fetch(`${base}/mantenimiento/alertas`, { headers: { ...authHeaders() } }));
  },
};
