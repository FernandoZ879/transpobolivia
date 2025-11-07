// backend/src/auth/auth.module.ts

// 1. Importar forwardRef desde @nestjs/common
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// 2. El import de UsersModule ya existe, no hay que añadirlo
import { UsersModule } from '../users/users.module'; 
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    // 3. Envolver UsersModule en forwardRef
    forwardRef(() => UsersModule), // <-- ¡AQUÍ ESTÁ LA OTRA PARTE DE LA SOLUCIÓN!
    PassportModule,
    JwtModule.register({
      secret: 'TU_CLAVE_SECRETA_SUPER_SEGURA', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}