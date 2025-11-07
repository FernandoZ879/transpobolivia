// backend/src/empresa/empresa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  create(empresaData: Omit<Empresa, 'id' | 'user'>): Promise<Empresa> {
    const nuevaEmpresa = this.empresaRepository.create(empresaData);
    return this.empresaRepository.save(nuevaEmpresa);
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({ where: { id } });
    if (!empresa) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
    }
    return empresa;
  }

  async update(id: string, updateData: Partial<Empresa>): Promise<Empresa> {
    await this.empresaRepository.update(id, updateData);
    const updatedEmpresa = await this.findOne(id);
    return updatedEmpresa;
  }
}