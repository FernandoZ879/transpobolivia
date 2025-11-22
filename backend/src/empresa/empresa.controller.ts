// backend/src/empresa/empresa.controller.ts
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Empresa } from './empresa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { Conductor } from '../conductores/conductor.entity';
import { Ruta } from '../rutas/ruta.entity';
import { Reserva } from '../reservas/reserva.entity';
import { Horario } from '../horarios/horario.entity';

@UseGuards(JwtAuthGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(
    private readonly empresaService: EmpresaService,
    @InjectRepository(Vehiculo) private vehiculosRepo: Repository<Vehiculo>,
    @InjectRepository(Conductor) private conductoresRepo: Repository<Conductor>,
    @InjectRepository(Ruta) private rutasRepo: Repository<Ruta>,
    // Inyectamos repositorios para el dashboard
    @InjectRepository(Reserva) private reservasRepo: Repository<Reserva>,
    @InjectRepository(Horario) private horariosRepo: Repository<Horario>,
  ) { }

  @Get('me')
  async getMyEmpresa(@Request() req) {
    const empresaId = req.user.empresaId;
    return this.empresaService.findOne(empresaId);
  }

  @Put()
  async updateMyEmpresa(@Request() req, @Body() updateData: Partial<Empresa>) {
    const empresaId = req.user.empresaId;
    return this.empresaService.update(empresaId, updateData);
  }

  @Get('summary')
  async summary(@Request() req) {
    const empresaId = req.user.empresaId;

    // 1. Conteos básicos
    const [vehActivos, conductores, rutas] = await Promise.all([
      this.vehiculosRepo.count({ where: { empresaId, estado: 'activo' } }),
      this.conductoresRepo.count({ where: { empresaId } }),
      this.rutasRepo.count({ where: { empresaId } }),
    ]);

    // 2. Calcular ventas de hoy (aproximado real)
    const today = new Date().toISOString().split('T')[0];

    // Obtenemos horarios de esta empresa para buscar reservas asociadas
    const misHorarios = await this.horariosRepo.find({ where: { empresaId }, select: ['id', 'tarifaGeneral'] });
    const horarioIds = misHorarios.map(h => h.id);

    let pasajerosHoy = 0;
    let ingresosHoy = 0;

    if (horarioIds.length > 0) {
      const reservasHoy = await this.reservasRepo.createQueryBuilder('reserva')
        .where('reserva.horarioId IN (:...ids)', { ids: horarioIds })
        .andWhere('reserva.fechaViaje = :today', { today })
        .andWhere('reserva.estado = :estado', { estado: 'pagado' }) // Solo pagados cuentan como ingreso
        .getMany();

      pasajerosHoy = reservasHoy.length;

      // Calcular dinero
      reservasHoy.forEach(r => {
        const h = misHorarios.find(mh => mh.id === r.horarioId);
        if (h) ingresosHoy += Number(h.tarifaGeneral);
      });
    }

    return {
      vehiculosActivos: vehActivos,
      conductores,
      rutas,
      pasajerosHoy,
      ingresosHoy
    };
  }
}
