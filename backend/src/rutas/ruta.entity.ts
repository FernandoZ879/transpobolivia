// backend/src/rutas/ruta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Horario } from '../horarios/horario.entity';

export class Parada {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
}

@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  paradas: Parada[];

  @Column()
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @OneToMany(() => Horario, (h) => h.ruta)
  horarios: Horario[];
}
