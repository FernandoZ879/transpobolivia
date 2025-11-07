// backend/src/rutas/rutas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ruta } from './ruta.entity';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private rutasRepository: Repository<Ruta>,
  ) {}

  findByEmpresaId(empresaId: string): Promise<Ruta[]> {
    return this.rutasRepository.find({ where: { empresaId } });
  }

  create(rutaData: Omit<Ruta, 'id' | 'empresa'>): Promise<Ruta> {
    const nuevaRuta = this.rutasRepository.create(rutaData);
    return this.rutasRepository.save(nuevaRuta);
  }

  async update(id: string, updateData: Partial<Ruta>): Promise<Ruta> {
    await this.rutasRepository.update(id, updateData);
    const ruta = await this.rutasRepository.findOne({ where: { id } });
    if (!ruta) throw new NotFoundException('Ruta no encontrada');
    return ruta;
  }
}
