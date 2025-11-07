// backend/src/reservas/reservas.service.ts
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { Horario } from '../horarios/horario.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

const HOLD_MINUTES = 10;

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva) private readonly reservasRepo: Repository<Reserva>,
    @InjectRepository(Horario) private readonly horariosRepo: Repository<Horario>,
    @InjectRepository(Vehiculo) private readonly vehiculosRepo: Repository<Vehiculo>,
    private readonly dataSource: DataSource,
  ) {}

  // Compatibilidad con SearchController
  encodeViajeId(horarioId: string, fecha: string): string {
    return Buffer.from(`${horarioId}|${fecha}`).toString('base64url');
  }

  decodeViajeId(viajeId: string): { horarioId: string; fecha: string } {
    try {
      const decoded = Buffer.from(viajeId, 'base64url').toString('utf8');
      const [horarioId, fecha] = decoded.split('|');
      if (!horarioId || !fecha) throw new Error();
      return { horarioId, fecha };
    } catch {
      throw new BadRequestException('viajeId inválido');
    }
  }

  async cleanupExpired() {
    await this.reservasRepo.update(
      { estado: 'reservado', expiresAt: LessThan(new Date()) },
      { estado: 'cancelado', expiresAt: null },
    );
  }

  async getSeats(viajeId: string) {
    const { horarioId, fecha } = this.decodeViajeId(viajeId);
    const horario = await this.horariosRepo.findOne({ where: { id: horarioId } });
    if (!horario) throw new BadRequestException('Horario no encontrado');
    const vehiculo = await this.vehiculosRepo.findOne({ where: { id: horario.vehiculoId } });
    if (!vehiculo) throw new BadRequestException('Vehículo no encontrado');

    const now = new Date();
    const reservas = await this.reservasRepo.find({
      where: [
        { horarioId, fechaViaje: fecha, estado: 'pagado' },
        { horarioId, fechaViaje: fecha, estado: 'reservado' },
      ],
    });

    const ocupados = new Set(
      reservas
        .filter((r) => r.estado === 'pagado' || (r.estado === 'reservado' && r.expiresAt && r.expiresAt.getTime() > now.getTime()))
        .map((r) => r.asientoNumero),
    );

    const seats = Array.from({ length: vehiculo.capacidad }).map((_, idx) => ({
      numero: idx + 1,
      estado: ocupados.has(idx + 1) ? 'ocupado' : 'disponible',
    }));

    return { capacidad: vehiculo.capacidad, seats };
  }

  async reserveSeats(viajeId: string, seatNumbers: number[], userId?: string) {
    const { horarioId, fecha } = this.decodeViajeId(viajeId);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Reserva);

      // Chequear conflictos
      for (const n of seatNumbers) {
        const conflict = await repo.findOne({
          where: [
            { horarioId, fechaViaje: fecha, asientoNumero: n, estado: 'pagado' },
            { horarioId, fechaViaje: fecha, asientoNumero: n, estado: 'reservado', expiresAt: MoreThan(now) },
          ],
          lock: { mode: 'pessimistic_read' },
        });
        if (conflict) {
          throw new ConflictException('Uno o más asientos ya fueron reservados.');
        }
      }

      // Insertar reservas
      const entities = seatNumbers.map((n) =>
        repo.create({
          usuarioId: userId || '',
          horarioId,
          fechaViaje: fecha,
          asientoNumero: n,
          estado: 'reservado',
          expiresAt,
        }),
      );
      await repo.insert(entities);
      return { ok: true, reserved: seatNumbers };
    });
  }

  async confirmarPago(reservaId: string) {
    const r = await this.reservasRepo.findOne({ where: { id: reservaId } });
    if (!r) throw new NotFoundException('Reserva no encontrada');
    if (r.estado === 'pagado') return r;
    if (r.estado === 'reservado' && r.expiresAt && r.expiresAt.getTime() < Date.now()) {
      throw new ConflictException('La reserva expiró');
    }
    r.estado = 'pagado';
    r.expiresAt = null;
    return this.reservasRepo.save(r);
  }
  // Aliases para compatibilidad con controladores antiguos:
async reservar(payload: { horarioId: string; fechaViaje: string; asientoNumero: number; usuarioId?: string }) {
  // Redirigimos al nuevo reserveSeats usando viajeId temporal
  const viajeId = this.encodeViajeId(payload.horarioId, payload.fechaViaje);
  return this.reserveSeats(viajeId, [payload.asientoNumero], payload.usuarioId);
}

async cancelar(reservaId: string) {
  const r = await this.reservasRepo.findOne({ where: { id: reservaId } });
  if (!r) throw new NotFoundException('Reserva no encontrada');
  r.estado = 'cancelado';
  r.expiresAt = null;
  return this.reservasRepo.save(r);
}

async asientosOcupados(horarioId: string, fecha: string): Promise<number[]> {
  const reservas = await this.reservasRepo.find({
    where: [
      { horarioId, fechaViaje: fecha, estado: 'pagado' },
      { horarioId, fechaViaje: fecha, estado: 'reservado' },
    ],
  });
  const now = new Date();
  return reservas
    .filter((r) => r.estado === 'pagado' || (r.expiresAt && r.expiresAt.getTime() > now.getTime()))
    .map((r) => r.asientoNumero);
}

}
