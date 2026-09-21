import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SupportStatus, SupportTicket } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import {
  resolveClientId,
  resolveEmployeeUnitId,
} from '../common/helpers/employee-scope.helper';
import { EmailService } from '../email/email.service';
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
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { deleteSupportTicketsByIds } from '../common/cascade-delete';
import { buildSupportProtocol } from './support-protocol';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    dto: CreateSupportDto,
    user: AuthenticatedUser,
  ): Promise<SupportTicket> {
    const clientId = await resolveClientId(this.prisma, user.id);
    const protocol = await this.generateUniqueProtocol();

    const ticket = await this.prisma.$transaction(async (tx) => {
      const created = await tx.supportTicket.create({
        data: {
          clientId,
          protocol,
          type: dto.type,
          description: dto.description,
          status: SupportStatus.ABERTO,
        },
      });

      await tx.supportHistory.create({
        data: {
          supportTicketId: created.id,
          userId: user.id,
          status: SupportStatus.ABERTO,
          notes: 'Ticket opened',
        },
      });

      return created;
    });

    await this.emailService.sendEmail({
      to: user.email,
      subject: `Support ticket ${protocol}`,
      html: `<p>Your support ticket ${protocol} was created.</p>`,
    });

    this.logger.info('Support ticket created', {
      ticketId: ticket.id,
      protocol,
    });
    return ticket;
  }

  async findAll(
    user: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<SupportTicket>> {
    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const scope = await this.buildListScope(user);
    const searchWhere = searchContains(['protocol', 'description'], search);
    const where = { ...scope, ...(searchWhere ?? {}) };
    const orderBy = resolveOrderBy(query.orderBy, ['id', 'openedAt', 'protocol'], {
      openedAt: 'desc',
    });
    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({ where, orderBy, skip, take }),
      this.prisma.supportTicket.count({ where }),
    ]);
    return buildPaginated(tickets, page, pageSize, total);
  }

  private async buildListScope(
    user: AuthenticatedUser,
  ): Promise<Prisma.SupportTicketWhereInput> {
    if (user.roles.includes(UserRole.ADMINISTRADOR) || user.roles.includes(UserRole.ATENDENTE)) {
      return {};
    }
    if (user.roles.includes(UserRole.GERENTE)) {
      const unitId = await resolveEmployeeUnitId(this.prisma, user.id);
      return { client: { orders: { some: { unitId } } } };
    }
    const clientId = await resolveClientId(this.prisma, user.id);
    return { clientId };
  }

  async findOne(id: number): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { histories: true },
    });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }
    return ticket;
  }

  async update(
    id: number,
    dto: UpdateSupportDto,
    user: AuthenticatedUser,
  ): Promise<SupportTicket> {
    const existing = await this.findOne(id);
    const nextStatus = dto.status ?? existing.status;

    const ticket = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.supportTicket.update({
        where: { id },
        data: {
          status: nextStatus,
          responsibleUserId: dto.responsibleUserId ?? existing.responsibleUserId,
        },
      });

      if (dto.status && dto.status !== existing.status) {
        await tx.supportHistory.create({
          data: {
            supportTicketId: id,
            userId: user.id,
            status: dto.status,
            notes: dto.notes,
          },
        });
      }

      return updated;
    });

    this.logger.info('Support ticket updated', { ticketId: id });
    return ticket;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.$transaction((tx) => deleteSupportTicketsByIds(tx, [id]));
    this.logger.info('Support ticket removed', { ticketId: id });
  }

  private async generateUniqueProtocol(): Promise<string> {
    const count = await this.prisma.supportTicket.count();
    let protocol = buildSupportProtocol(count + 1);
    let attempts = 0;

    while (attempts < 5) {
      const existing = await this.prisma.supportTicket.findUnique({
        where: { protocol },
        select: { id: true },
      });
      if (!existing) {
        return protocol;
      }
      attempts += 1;
      protocol = buildSupportProtocol(count + 1 + attempts);
    }

    return `${buildSupportProtocol(count + 1)}-${Date.now()}`;
  }
}
