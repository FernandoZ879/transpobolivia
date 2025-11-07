// backend/src/conductores/conductores.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductoresController } from './conductores.controller';
import { ConductoresService } from './conductores.service';
import { Conductor } from './conductor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conductor])],
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}