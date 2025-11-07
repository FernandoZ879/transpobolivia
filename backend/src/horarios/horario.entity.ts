// backend/src/rutas/horario.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Ruta } from '../rutas/ruta.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value == null ? null : parseFloat(value)),
};

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  empresaId: string;

  @Column()
  rutaId: string;

  @ManyToOne(() => Ruta, (r) => r.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rutaId' })
  ruta: Ruta;

  @Column()
  vehiculoId: string;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  dias: string[]; // ['Lunes','Martes',...]

  @Column()
  horaSalida: string; // HH:mm

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  tarifaGeneral: number;
}
