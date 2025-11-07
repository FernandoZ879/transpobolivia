// backend/src/conductores/conductor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('conductores')
export class Conductor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  cedula: string;

  @Column()
  tipoLicencia: 'A' | 'B' | 'C' | 'P';

  @Column()
  vencimientoLicencia: string;

  @Column({ default: 'activo' })
  estado: 'activo' | 'inactivo';

  @Column()
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;
}
