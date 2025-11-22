import { Controller, Get, Query, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ruta } from '../rutas/ruta.entity';
import { Horario } from '../horarios/horario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { ReservasService } from '../reservas/reservas.service';

const CITY_NAMES: Record<string, string> = {
  LPB: 'La Paz', CBB: 'Cochabamba', SRZ: 'Santa Cruz', SRE: 'Sucre', PSI: 'Potosí', ORU: 'Oruro', TJA: 'Tarija', BEN: 'Trinidad', PAN: 'Cobija'
};

function dayName(dateStr: string): string {
  const parts = dateStr.split('-');
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const names = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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
  ) { }

  @Get('trips')
  async searchTrips(
    @Query('origen') origen?: string,
    @Query('destino') destino?: string,
    @Query('fecha') fecha?: string,
  ) {
    const targetDate = fecha || new Date().toISOString().split('T')[0];
    const dia = dayName(targetDate);

    const whereRuta: any = {};
    if (origen) whereRuta.origen = origen;
    if (destino) whereRuta.destino = destino;

    const rutas = await this.rutasRepo.find({ where: whereRuta });
    if (rutas.length === 0) return [];

    const horarios = await this.horariosRepo.find({
      where: { rutaId: In(rutas.map(r => r.id)) },
      order: { horaSalida: 'ASC' }
    });

    // Filtrar por día de operación (recurrente) O fecha específica
    const filtrados = horarios.filter(h => {
      if (h.fecha) {
        return h.fecha === targetDate;
      }
      return (h.dias || []).includes(dia);
    });
    if (filtrados.length === 0) return [];

    const empresas = await this.empresaRepo.findBy({ id: In(filtrados.map(h => h.empresaId)) });
    const empresaById = new Map(empresas.map(e => [e.id, e]));

    const vehiculos = await this.vehiculoRepo.findBy({ id: In(filtrados.map(h => h.vehiculoId)) });
    const vehiculoById = new Map(vehiculos.map(v => [v.id, v]));

    return Promise.all(filtrados.map(async h => {
      const ruta = rutas.find(r => r.id === h.rutaId)!;
      const emp = empresaById.get(h.empresaId);
      const veh = vehiculoById.get(h.vehiculoId);
      const viajeId = this.reservasService.encodeViajeId(h.id, targetDate);

      const ocupados = await this.reservasService.asientosOcupados(h.id, targetDate);
      const capacidad = veh ? veh.capacidad : 40;
      const disponibles = Math.max(0, capacidad - ocupados.length);

      return {
        id: viajeId,
        scheduleId: h.id,
        // ENVIAMOS STRINGS SIMPLES PARA EVITAR ERROR REACT #31
        origen: CITY_NAMES[ruta.origen] || ruta.origen,
        destino: CITY_NAMES[ruta.destino] || ruta.destino,
        fecha: targetDate,
        horaSalida: h.horaSalida,
        empresa: emp?.nombre || 'Empresa',
        logoEmpresa: emp?.logoUrl || '',
        precio: Number(h.tarifaGeneral),
        tipoBus: veh ? veh.modelo : 'Bus Estándar',
        disponibles: disponibles,
        capacidad: capacidad,
        duracionEstimada: '8h'
      };
    }));
  }

  @Get('schedule/:id')
  async getSchedule(@Param('id') id: string) {
    const horario = await this.horariosRepo.findOne({ where: { id } });
    if (!horario) throw new Error('Horario no encontrado');

    const vehiculo = await this.vehiculoRepo.findOne({ where: { id: horario.vehiculoId } });

    return {
      ...horario,
      price: Number(horario.tarifaGeneral), // Alias for frontend compatibility
      capacidad: vehiculo ? vehiculo.capacidad : 40
    };
  }
}
