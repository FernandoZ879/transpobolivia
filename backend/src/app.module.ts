// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmpresaModule } from './empresa/empresa.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { AuthModule } from './auth/auth.module';
import { ConductoresModule } from './conductores/conductores.module';
import { RutasModule } from './rutas/rutas.module';
import { ReservasModule } from './reservas/reservas.module';
import { SearchModule } from './search/search.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER, // Usaremos variables de entorno
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    EmpresaModule,
    VehiculosModule,
    AuthModule,
    ConductoresModule,
    RutasModule,
    ReservasModule,
    SearchModule,
    MantenimientoModule,
    HorariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
