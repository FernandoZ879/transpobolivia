// backend/src/vehiculos/vehiculos.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly repo: Repository<Vehiculo>,
  ) {}

  findAll() {
    return this.repo.find();
  }
  
  findAllByEmpresa(empresaId: string) {
  return this.repo.find({ where: { empresaId } });
}


  async findOne(id: string) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    return v;
  }

  async create(input: Partial<Vehiculo>) {
    try {
      const v = this.repo.create(input);
      return await this.repo.save(v);
    } catch (e: any) {
      // MySQL/MariaDB ER_DUP_ENTRY, PostgreSQL 23505
      if (e.code === 'ER_DUP_ENTRY' || e.code === '23505') {
        throw new ConflictException('Matrícula ya registrada');
      }
      throw e;
    }
  }

  async update(id: string, input: Partial<Vehiculo>) {
    const v = await this.findOne(id);
    Object.assign(v, input);
    try {
      return await this.repo.save(v);
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY' || e.code === '23505') {
        throw new ConflictException('Matrícula ya registrada');
      }
      throw e;
    }
  }

  async remove(id: string) {
    const v = await this.findOne(id);
    await this.repo.remove(v);
    return { success: true };
  }
}
