// backend/src/horarios/horarios.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('horarios')
@UseGuards(JwtAuthGuard)
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAllByEmpresa(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    if (!body.vehiculoId) {
      throw new Error('Debe seleccionar un vehículo');
    }
    return this.service.create({
      ...body,
      empresaId: req.user.empresaId,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
