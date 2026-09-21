import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { assertAnyRole, hasRole } from '../common/utils/access-scope.util';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPaginated,
  normalizePagination,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { deleteClientGraph } from '../common/cascade-delete';
import { ClientResponseDto } from './dto/client-response.dto';
import {
  buildClientSearch,
  clientInclude,
  resolveClientOrderBy,
  toClientResponse,
} from './clients.mapper';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(
    actor: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<ClientResponseDto>> {
    if (hasRole(actor, UserRole.CLIENTE)) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    assertAnyRole(actor, [
      UserRole.ATENDENTE,
      UserRole.GERENTE,
      UserRole.ADMINISTRADOR,
    ]);

    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const where = buildClientSearch(search) ?? {};
    const orderBy = resolveClientOrderBy(query.orderBy);
    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        include: clientInclude,
        orderBy,
        skip,
        take,
      }),
      this.prisma.client.count({ where }),
    ]);

    return buildPaginated(
      clients.map((client) => toClientResponse(client)),
      page,
      pageSize,
      total,
    );
  }

  async findOne(actor: AuthenticatedUser, id: number): Promise<ClientResponseDto> {
    const client = await this.getClientOrThrow(id);
    this.assertCanAccessClient(actor, client);
    return toClientResponse(client);
  }

  async create(actor: AuthenticatedUser, dto: CreateClientDto): Promise<ClientResponseDto> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCpf = await this.prisma.client.findUnique({
      where: { cpf: dto.cpf },
    });
    if (existingCpf) {
      throw new ConflictException('CPF already registered');
    }

    const existingUserClient = await this.prisma.client.findUnique({
      where: { userId: dto.userId },
    });
    if (existingUserClient) {
      throw new ConflictException('User already has a client record');
    }

    await this.assertPreferredUnit(dto.preferredUnitId);

    const client = await this.prisma.client.create({
      data: dto,
      include: clientInclude,
    });
    this.logger.info('Client created', { clientId: client.id, actorId: actor.id });
    return toClientResponse(client);
  }

  async update(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.getClientOrThrow(id);
    this.assertCanUpdateClient(actor, client);

    if (dto.cpf) {
      const existing = await this.prisma.client.findFirst({
        where: { cpf: dto.cpf, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('CPF already registered');
      }
    }

    await this.assertPreferredUnit(dto.preferredUnitId);

    const updated = await this.prisma.client.update({
      where: { id },
      data: dto,
      include: clientInclude,
    });

    this.logger.info('Client updated', { clientId: id, actorId: actor.id });
    return toClientResponse(updated);
  }

  async remove(actor: AuthenticatedUser, id: number): Promise<void> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR, UserRole.GERENTE]);
    await this.getClientOrThrow(id);
    await this.prisma.$transaction((tx) => deleteClientGraph(tx, id));
    this.logger.info('Client removed', { clientId: id, actorId: actor.id });
  }

  private async getClientOrThrow(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: clientInclude,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  private assertCanAccessClient(
    actor: AuthenticatedUser,
    client: { userId: number },
  ): void {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      return;
    }

    if (hasRole(actor, UserRole.CLIENTE) && client.userId === actor.id) {
      return;
    }

    if (
      hasRole(actor, UserRole.ATENDENTE) ||
      hasRole(actor, UserRole.GERENTE)
    ) {
      return;
    }

    throw new ForbiddenException('Insufficient role permissions');
  }

  private async assertPreferredUnit(unitId?: number): Promise<void> {
    if (!unitId) {
      return;
    }
    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) {
      throw new NotFoundException('Preferred unit not found');
    }
  }

  private assertCanUpdateClient(
    actor: AuthenticatedUser,
    client: { userId: number },
  ): void {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      return;
    }

    if (hasRole(actor, UserRole.CLIENTE) && client.userId === actor.id) {
      return;
    }

    throw new ForbiddenException('Insufficient role permissions');
  }
}
