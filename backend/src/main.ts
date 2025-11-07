import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS correcto para dev: origen explícito y credenciales (si usas cookies).
  // En tu front usamos Authorization: Bearer, así que credenciales no son necesarias,
  // pero lo dejamos listo igualmente.
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
