// >>> backend/src/users/users.controller.ts

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService, RegisterOperatorDto, RegisterUserDto } from './users.service'; // Asegúrate que RegisterUserDto esté importado
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
    ) {}

  @Post('auth/register')
  // LA CORRECCIÓN ESTÁ EN ESTA LÍNEA: "RegisterUserDto" en lugar de "RegisterUser-Dto"
  async register(@Body() userData: RegisterOperatorDto | RegisterUserDto) {
    // 1. Creamos el usuario como antes.
    const user = await this.usersService.create(userData);
    
    // 2. Usamos el AuthService para generar un token para este nuevo usuario.
    // Esto es lo que hará el login automático de forma segura en el backend.
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    // Esta función no cambia, sigue funcionando para el login manual.
    return this.authService.login(req.user);
  }
}