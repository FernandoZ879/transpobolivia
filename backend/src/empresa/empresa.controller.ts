// backend/src/empresa/empresa.controller.ts
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Empresa } from './empresa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { Conductor } from '../conductores/conductor.entity';
import { Ruta } from '../rutas/ruta.entity';

@UseGuards(JwtAuthGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(
    private readonly empresaService: EmpresaService,
    @InjectRepository(Vehiculo) private vehiculosRepo: Repository<Vehiculo>,
    @InjectRepository(Conductor) private conductoresRepo: Repository<Conductor>,
    @InjectRepository(Ruta) private rutasRepo: Repository<Ruta>,
  ) {}

  @Get('me')
  async getMyEmpresa(@Request() req) {
    const empresaId = req.user.empresaId;
    return this.empresaService.findOne(empresaId);
  }

  @Put()
  async updateMyEmpresa(@Request() req, @Body() updateData: Partial<Empresa>) {
    const empresaId = req.user.empresaId;
    return this.empresaService.update(empresaId, updateData);
  }

  @Get('summary')
  async summary(@Request() req) {
    const empresaId = req.user.empresaId;
    const [vehActivos, conductores, rutas] = await Promise.all([
      this.vehiculosRepo.count({ where: { empresaId, estado: 'activo' } }),
      this.conductoresRepo.count({ where: { empresaId } }),
      this.rutasRepo.count({ where: { empresaId } }),
    ]);
    // Para alertas, el frontend ya consulta /mantenimiento/alertas
    return {
      vehiculosActivos: vehActivos,
      conductores,
      rutas,
    };
  }
}
