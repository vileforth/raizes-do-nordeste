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
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(actor: AuthenticatedUser): Promise<ClientResponseDto[]> {
    if (hasRole(actor, UserRole.CLIENTE)) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    assertAnyRole(actor, [
      UserRole.ATENDENTE,
      UserRole.GERENTE,
      UserRole.ADMINISTRADOR,
    ]);

    const clients = await this.prisma.client.findMany({
      orderBy: { id: 'asc' },
    });

    return clients.map((client) => this.toResponse(client));
  }

  async findOne(actor: AuthenticatedUser, id: number): Promise<ClientResponseDto> {
    const client = await this.getClientOrThrow(id);
    this.assertCanAccessClient(actor, client);
    return this.toResponse(client);
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

    const client = await this.prisma.client.create({ data: dto });
    this.logger.info('Client created', { clientId: client.id, actorId: actor.id });
    return this.toResponse(client);
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

    const updated = await this.prisma.client.update({
      where: { id },
      data: dto,
    });

    this.logger.info('Client updated', { clientId: id, actorId: actor.id });
    return this.toResponse(updated);
  }

  private async getClientOrThrow(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
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

  private toResponse(client: {
    id: number;
    userId: number;
    cpf: string;
    registeredAt: Date;
    active: boolean;
  }): ClientResponseDto {
    return {
      id: client.id,
      userId: client.userId,
      cpf: client.cpf,
      registeredAt: client.registeredAt,
      active: client.active,
    };
  }
}
