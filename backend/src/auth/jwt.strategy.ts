// backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_CLAVE_SECRETA_SUPER_SEGURA', // ¡Cambia esto en un proyecto real!
    });
  }

  async validate(payload: any) {
    // El payload es el contenido decodificado del JWT.
    // Lo que devolvamos aquí se adjuntará al objeto `request.user`.
    return { userId: payload.sub, email: payload.email, empresaId: payload.empresaId };
  }
}