// backend/src/users/users.module.ts

// 1. Importar forwardRef desde @nestjs/common
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { EmpresaModule } from '../empresa/empresa.module';
// 2. Importar el módulo que necesitamos
import { AuthModule } from '../auth/auth.module'; 

@Module({
  // 3. Añadir AuthModule envuelto en forwardRef a los imports
  imports: [
    TypeOrmModule.forFeature([User]), 
    EmpresaModule,
    forwardRef(() => AuthModule), // <-- ¡AQUÍ ESTÁ LA SOLUCIÓN!
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}