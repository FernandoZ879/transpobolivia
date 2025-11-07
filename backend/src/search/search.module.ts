// backend/src/search/search.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { Ruta } from '../rutas/ruta.entity';
import { Horario } from '../horarios/horario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { ReservasModule } from '../reservas/reservas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ruta, Horario, Empresa, Vehiculo]), ReservasModule],
  controllers: [SearchController],
})
export class SearchModule {}
