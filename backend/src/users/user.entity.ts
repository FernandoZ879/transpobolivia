
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Le dice a TypeORM que esta clase define una tabla llamada 'users'
export class User {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único y universal
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true }) // El email debe ser único
  email: string;

  @Column()
  contrasena: string; // En un proyecto real, esto debería estar encriptado

  @Column()
  role: string; // 'user' o 'operador'

  @Column({ nullable: true }) // Puede ser nulo para los clientes
  empresaId: string;
}