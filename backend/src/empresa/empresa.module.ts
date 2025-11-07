// backend/src/empresa/empresa.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { Empresa } from './empresa.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { Conductor } from '../conductores/conductor.entity';
import { Ruta } from '../rutas/ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Vehiculo, Conductor, Ruta])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
