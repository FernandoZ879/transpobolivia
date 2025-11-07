// backend/src/search/search.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ruta } from '../rutas/ruta.entity';
import { Horario } from '../horarios/horario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { ReservasService } from '../reservas/reservas.service';

const CITY_NAMES: Record<string,string> = {
  LPB: 'La Paz', CBB: 'Cochabamba', SRZ: 'Santa Cruz', SRE: 'Sucre', PSI: 'Potosí', ORU: 'Oruro', TJA: 'Tarija'
};

function dayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const names = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  return names[d.getDay()];
}

@Controller('search')
export class SearchController {
  constructor(
    @InjectRepository(Ruta) private rutasRepo: Repository<Ruta>,
    @InjectRepository(Horario) private horariosRepo: Repository<Horario>,
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(Vehiculo) private vehiculoRepo: Repository<Vehiculo>,
    private reservasService: ReservasService,
  ) {}

  @Get('trips')
  async searchTrips(
    @Query('origen') origen?: string,
    @Query('destino') destino?: string,
    @Query('fecha') fecha?: string,
  ) {
    if (!origen || !destino || !fecha) throw new BadRequestException('origen, destino y fecha son requeridos');
    const dia = dayName(fecha);

    const rutas = await this.rutasRepo.find({ where: { origen, destino } });
    if (rutas.length === 0) return [];

    const horarios = await this.horariosRepo.find({ where: { rutaId: In(rutas.map(r => r.id)) } });
    const filtrados = horarios.filter(h => (h.dias || []).includes(dia));

    const empresas = await this.empresaRepo.findByIds(filtrados.map(h => h.empresaId));
    const empresaById = new Map(empresas.map(e => [e.id, e]));
    const vehiculos = await this.vehiculoRepo.findByIds(filtrados.map(h => h.vehiculoId));
    const vehiculoById = new Map(vehiculos.map(v => [v.id, v]));

    return filtrados.map(h => {
      const ruta = rutas.find(r => r.id === h.rutaId)!;
      const emp = empresaById.get(h.empresaId);
      const veh = vehiculoById.get(h.vehiculoId);
      const viajeId = this.reservasService.encodeViajeId(h.id, fecha);
      return {
        id: viajeId,
        origen: { id: ruta.origen, nombre: CITY_NAMES[ruta.origen] || ruta.origen },
        destino: { id: ruta.destino, nombre: CITY_NAMES[ruta.destino] || ruta.destino },
        fecha,
        horaSalida: h.horaSalida,
        horaLlegada: '', // opcional si no calculas
        empresa: emp?.nombre || 'Empresa',
        logoEmpresa: emp?.logoUrl || '',
        precio: Number(h.tarifaGeneral),
        tipoBus: veh ? veh.modelo : 'Bus',
      };
    });
  }
}
