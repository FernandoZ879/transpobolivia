// backend/src/reservas/reservas.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Post()
  reservar(@Body() body: { usuarioId: string; horarioId: string; fechaViaje: string; asientoNumero: number }) {
    return this.service.reservar(body);
  }

  @Post(':id/confirmar-pago')
  confirmar(@Param('id') id: string) {
    return this.service.confirmarPago(id);
  }

  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.service.cancelar(id);
  }

  @Get('ocupados')
  asientosOcupados(@Query('horarioId') horarioId: string, @Query('fechaViaje') fechaViaje: string) {
    return this.service.asientosOcupados(horarioId, fechaViaje);
  }
}
