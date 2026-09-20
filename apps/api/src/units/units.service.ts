import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import {
  assertAnyRole,
  hasRole,
  resolveManagerUnitId,
} from '../common/utils/access-scope.util';
import { GeoService } from '../geo/geo.service';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitResponseDto } from './dto/unit-response.dto';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(actor: AuthenticatedUser): Promise<UnitResponseDto[]> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);

    const where = hasRole(actor, UserRole.ADMINISTRADOR)
      ? {}
      : { id: await resolveManagerUnitId(this.prisma, actor.id) };

    const units = await this.prisma.unit.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    return units.map((unit) => this.toResponse(unit));
  }

  async findOne(actor: AuthenticatedUser, id: number): Promise<UnitResponseDto> {
    await this.assertCanAccessUnit(actor, id);
    const unit = await this.getUnitOrThrow(id);
    return this.toResponse(unit);
  }

  async create(actor: AuthenticatedUser, dto: CreateUnitDto): Promise<UnitResponseDto> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);

    const coordinates = await this.geoService.geocodeAddress(dto.address);

    const unit = await this.prisma.unit.create({
      data: {
        ...dto,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      },
    });

    await this.prisma.stock.create({
      data: {
        unitId: unit.id,
        status: 'ATIVO',
      },
    });

    this.logger.info('Unit created', { unitId: unit.id, actorId: actor.id });
    return this.toResponse(unit);
  }

  async update(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateUnitDto,
  ): Promise<UnitResponseDto> {
    await this.assertCanAccessUnit(actor, id);
    await this.getUnitOrThrow(id);

    let latitude: number | null | undefined;
    let longitude: number | null | undefined;

    if (dto.address) {
      const coordinates = await this.geoService.geocodeAddress(dto.address);
      latitude = coordinates?.latitude ?? null;
      longitude = coordinates?.longitude ?? null;
    }

    const unit = await this.prisma.unit.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.address ? { latitude, longitude } : {}),
      },
    });

    this.logger.info('Unit updated', { unitId: id, actorId: actor.id });
    return this.toResponse(unit);
  }

  private async getUnitOrThrow(id: number) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
    return unit;
  }

  private async assertCanAccessUnit(
    actor: AuthenticatedUser,
    unitId: number,
  ): Promise<void> {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      return;
    }

    if (hasRole(actor, UserRole.GERENTE)) {
      const managerUnitId = await resolveManagerUnitId(this.prisma, actor.id);
      if (managerUnitId === unitId) {
        return;
      }
    }

    throw new ForbiddenException('Insufficient role permissions');
  }

  private toResponse(unit: {
    id: number;
    name: string;
    address: string;
    phone: string;
    status: UnitResponseDto['status'];
    registeredAt: Date;
    latitude: number | null;
    longitude: number | null;
  }): UnitResponseDto {
    return {
      id: unit.id,
      name: unit.name,
      address: unit.address,
      phone: unit.phone,
      status: unit.status,
      registeredAt: unit.registeredAt,
      latitude: unit.latitude,
      longitude: unit.longitude,
    };
  }
}
