// >>> backend/src/conductores/conductores.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { Conductor } from './conductor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get()
  async findByEmpresa(@Request() req): Promise<Conductor[]> {
    return this.conductoresService.findByEmpresaId(req.user.empresaId);
  }

  @Post()
  async create(@Request() req, @Body() conductorData: Omit<Conductor, 'id' | 'empresa' | 'empresaId'>): Promise<Conductor> {
    return this.conductoresService.create({ ...conductorData, empresaId: req.user.empresaId });
  }
    
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Conductor>): Promise<Conductor> {
    return this.conductoresService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.conductoresService.remove(id);
  }
}