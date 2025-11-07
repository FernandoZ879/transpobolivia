// backend/src/rutas/rutas.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request, Put, Param } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { Ruta } from './ruta.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  async findByEmpresa(@Request() req): Promise<Ruta[]> {
    const empresaId = req.user.empresaId;
    return this.rutasService.findByEmpresaId(empresaId);
  }

  @Post()
  async create(@Request() req, @Body() rutaData: Omit<Ruta, 'id' | 'empresa' | 'empresaId'>): Promise<Ruta> {
    const empresaId = req.user.empresaId;
    return this.rutasService.create({ ...rutaData, empresaId });
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: Partial<Ruta>): Promise<Ruta> {
    // Opcional: validar empresaId del recurso si quieres reforzar multi-tenant
    return this.rutasService.update(id, data);
  }
}
