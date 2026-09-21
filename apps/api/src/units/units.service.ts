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
import {
  buildPaginated,
  normalizePagination,
  resolveOrderBy,
  searchContains,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { deleteUnitGraph } from '../common/cascade-delete';
import { UnitResponseDto } from './dto/unit-response.dto';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(
    actor: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<UnitResponseDto>> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);

    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const scope = hasRole(actor, UserRole.ADMINISTRADOR)
      ? {}
      : { id: await resolveManagerUnitId(this.prisma, actor.id) };
    const searchWhere = searchContains(['name', 'address'], search);
    const where = { ...scope, ...(searchWhere ?? {}) };
    const orderBy = resolveOrderBy(query.orderBy, ['id', 'name'], { id: 'asc' });

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({ where, orderBy, skip, take }),
      this.prisma.unit.count({ where }),
    ]);

    return buildPaginated(
      units.map((unit) => this.toResponse(unit)),
      page,
      pageSize,
      total,
    );
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

  async remove(actor: AuthenticatedUser, id: number): Promise<void> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);
    await this.getUnitOrThrow(id);
    await this.prisma.$transaction((tx) => deleteUnitGraph(tx, id));
    this.logger.info('Unit removed', { unitId: id, actorId: actor.id });
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
