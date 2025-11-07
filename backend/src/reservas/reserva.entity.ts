// backend/src/reservas/reserva.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('reservas')
@Index(['horarioId', 'fechaViaje', 'asientoNumero'])
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuarioId: string;

  @Column()
  horarioId: string;

  @Column({ type: 'date' })
  fechaViaje: string; // YYYY-MM-DD

  @Column('int')
  asientoNumero: number;

  @Column({ default: 'reservado' })
  estado: 'reservado' | 'pagado' | 'cancelado';

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
