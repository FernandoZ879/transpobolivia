// backend/src/rutas/horarios.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly repo: Repository<Horario>,
  ) {}

  findAll() {
    return this.repo.find({ order: { horaSalida: 'ASC' } });
  }

  findAllByEmpresa(empresaId: string) {
  return this.repo.find({
    where: { empresaId },
    relations: ['ruta', 'vehiculo'],
  });
}


  findByRuta(rutaId: string) {
    return this.repo.find({ where: { rutaId }, order: { horaSalida: 'ASC' } });
  }

  async findOne(id: string) {
    const h = await this.repo.findOne({ where: { id } });
    if (!h) throw new NotFoundException('Horario no encontrado');
    return h;
  }

  create(input: Partial<Horario>) {
    const h = this.repo.create(input);
    return this.repo.save(h);
  }

  async update(id: string, input: Partial<Horario>) {
    const h = await this.findOne(id);
    Object.assign(h, input);
    return this.repo.save(h);
  }

  async remove(id: string) {
    const h = await this.findOne(id);
    await this.repo.remove(h);
    return { success: true };
  }
}
