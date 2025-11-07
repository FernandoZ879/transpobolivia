// backend/src/rutas/rutas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { Ruta } from './ruta.entity';
import { Horario } from '../horarios/horario.entity';
import { HorariosService } from '../horarios/horarios.service';
import { HorariosController } from '../horarios/horarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ruta, Horario])],
  controllers: [RutasController, HorariosController],
  providers: [RutasService, HorariosService],
  exports: [TypeOrmModule],
})
export class RutasModule {}
