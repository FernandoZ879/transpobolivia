// backend/src/reservas/reservas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva } from './reserva.entity';
import { Horario } from '../horarios/horario.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Horario, Vehiculo])],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService]
})
export class ReservasModule {}
