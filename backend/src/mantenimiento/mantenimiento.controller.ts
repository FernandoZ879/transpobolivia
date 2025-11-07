// backend/src/mantenimiento/mantenimiento.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

@UseGuards(JwtAuthGuard)
@Controller('mantenimiento')
export class MantenimientoController {
  constructor(
    @InjectRepository(Vehiculo) private vehiculosRepo: Repository<Vehiculo>,
  ) {}

  @Get('alertas')
  async alertas(@Request() req) {
    const vehiculos = await this.vehiculosRepo.find({ where: { empresaId: req.user.empresaId } });
    const hoy = new Date();
    const dias = (d1: Date, d2: Date) => Math.ceil((d1.getTime() - d2.getTime()) / (1000*60*60*24));

    const alertas = vehiculos.flatMap(v => {
      const venc = new Date(v.fechaUltimaRevision);
      // Próxima revisión a 180 días; alerta si faltan <= 7 días o si ya venció
      const proxima = new Date(venc);
      proxima.setDate(venc.getDate() + 180);
      const faltan = dias(proxima, hoy);
      if (faltan <= 7) {
        return [{
          id: `${v.id}-${proxima.toISOString().slice(0,10)}`,
          vehiculoId: v.id,
          vehiculoPatente: v.patente,
          mensaje: faltan < 0 ? 'Revisión técnica vencida' : 'Próxima revisión técnica',
          fechaVencimiento: proxima.toISOString().slice(0,10),
        }];
      }
      return [];
    });

    return alertas;
  }
}
