// >>> backend/src/users/users.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { EmpresaService } from '../empresa/empresa.service';
import * as bcrypt from 'bcrypt';

export interface RegisterOperatorDto {
  nombre: string;
  email: string;
  contrasena: string;
  role: 'operador';
  nit: string;
}

export interface RegisterUserDto {
  nombre: string;
  email: string;
  contrasena: string;
  role: 'user';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly empresaService: EmpresaService,
  ) {}

  async create(userData: RegisterUserDto | RegisterOperatorDto): Promise<User> {
    const email = userData.email.toLowerCase();
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

    if (userData.role === 'operador') {
      const newUserEntity = this.usersRepository.create({
        nombre: userData.nombre,
        email,
        contrasena: hashedPassword,
        role: userData.role,
      });
      const savedUser = await this.usersRepository.save(newUserEntity);
      
      const empresa = await this.empresaService.create({
        nombre: userData.nombre,
        nit: userData.nit,
        email,
        userId: savedUser.id,
        telefono: '',
        direccion: '',
        logoUrl: '',
      });

      savedUser.empresaId = empresa.id;
      return this.usersRepository.save(savedUser);

    } else {
      const newUserEntity = this.usersRepository.create({ ...userData, email, contrasena: hashedPassword });
      return this.usersRepository.save(newUserEntity);
    }
  }

  // CORRECCIÓN: Cambiado el tipo de retorno a Promise<User | null>
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }
}