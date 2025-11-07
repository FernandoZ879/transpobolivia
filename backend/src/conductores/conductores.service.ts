// >>> backend/src/conductores/conductores.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from './conductor.entity';

@Injectable()
export class ConductoresService {
  constructor(
    @InjectRepository(Conductor)
    private conductoresRepository: Repository<Conductor>,
  ) {}

  findByEmpresaId(empresaId: string): Promise<Conductor[]> {
    return this.conductoresRepository.find({ where: { empresaId } });
  }

  create(conductorData: Omit<Conductor, 'id' | 'empresa'>): Promise<Conductor> {
    const nuevoConductor = this.conductoresRepository.create(conductorData);
    return this.conductoresRepository.save(nuevoConductor);
  }

  async update(id: string, updateData: Partial<Conductor>): Promise<Conductor> {
    await this.conductoresRepository.update(id, updateData);
    const conductor = await this.conductoresRepository.findOne({ where: { id } });
    if (!conductor) throw new NotFoundException('Conductor no encontrado');
    return conductor;
  }

  async remove(id: string): Promise<void> {
    const result = await this.conductoresRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Conductor no encontrado');
    }
  }
}