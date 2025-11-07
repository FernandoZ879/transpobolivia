// backend/src/vehiculos/vehiculo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('vehiculos')
@Unique(['patente'])
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 16, unique: true })
  patente: string;

  @Column()
  modelo: string;

  @Column('int')
  capacidad: number;

  @Column({ default: 'activo' })
  estado: 'activo' | 'inactivo' | 'mantenimiento';

  @Column()
  fechaUltimaRevision: string;

  @Column()
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    if (this.patente) this.patente = this.patente.trim().toUpperCase();
  }
}
