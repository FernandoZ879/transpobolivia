// backend/src/mantenimiento/mantenimiento.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MantenimientoController } from './mantenimiento.controller';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  controllers: [MantenimientoController],
})
export class MantenimientoModule {}
