import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './horario.entity';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Horario])],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService],
})
export class HorariosModule {}
