// backend/src/vehiculos/vehiculos.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { Vehiculo } from './vehiculo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vehiculos')
@UseGuards(JwtAuthGuard)
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAllByEmpresa(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Vehiculo>, @Req() req: any) {
    return this.service.create({ ...body, empresaId: req.user.empresaId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Vehiculo>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
