import {
  ConflictException,
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
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPaginated,
  normalizePagination,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import {
  buildEmployeeSearch,
  employeeInclude,
  resolveEmployeeOrderBy,
  toEmployeeResponse,
} from './employees.mapper';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(
    actor: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<EmployeeResponseDto>> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);

    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const scope = hasRole(actor, UserRole.ADMINISTRADOR)
      ? {}
      : { unitId: await resolveManagerUnitId(this.prisma, actor.id) };
    const searchWhere = buildEmployeeSearch(search);
    const where = { ...scope, ...(searchWhere ?? {}) };
    const orderBy = resolveEmployeeOrderBy(query.orderBy);

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: employeeInclude,
        orderBy,
        skip,
        take,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return buildPaginated(
      employees.map((employee) => toEmployeeResponse(employee)),
      page,
      pageSize,
      total,
    );
  }

  async findOne(actor: AuthenticatedUser, id: number): Promise<EmployeeResponseDto> {
    const employee = await this.getEmployeeOrThrow(id);
    await this.assertCanAccessEmployee(actor, employee.unitId);
    return toEmployeeResponse(employee);
  }

  async create(
    actor: AuthenticatedUser,
    dto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    assertAnyRole(actor, [UserRole.GERENTE, UserRole.ADMINISTRADOR]);
    await this.assertCanAccessEmployee(actor, dto.unitId);

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const unit = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const existingRegistration = await this.prisma.employee.findUnique({
      where: { registrationNumber: dto.registrationNumber },
    });
    if (existingRegistration) {
      throw new ConflictException('Registration number already exists');
    }

    const existingUserEmployee = await this.prisma.employee.findUnique({
      where: { userId: dto.userId },
    });
    if (existingUserEmployee) {
      throw new ConflictException('User already has an employee record');
    }

    const employee = await this.prisma.employee.create({
      data: dto,
      include: employeeInclude,
    });
    this.logger.info('Employee created', {
      employeeId: employee.id,
      actorId: actor.id,
    });
    return toEmployeeResponse(employee);
  }

  async update(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.getEmployeeOrThrow(id);
    await this.assertCanAccessEmployee(actor, employee.unitId);

    if (dto.unitId !== undefined) {
      await this.assertCanAccessEmployee(actor, dto.unitId);
      const unit = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
    }

    if (dto.registrationNumber) {
      const existing = await this.prisma.employee.findFirst({
        where: { registrationNumber: dto.registrationNumber, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Registration number already exists');
      }
    }

    const updated = await this.prisma.employee.update({
      where: { id },
      data: dto,
      include: employeeInclude,
    });

    this.logger.info('Employee updated', { employeeId: id, actorId: actor.id });
    return toEmployeeResponse(updated);
  }

  async remove(actor: AuthenticatedUser, id: number): Promise<void> {
    const employee = await this.getEmployeeOrThrow(id);
    await this.assertCanAccessEmployee(actor, employee.unitId);
    await this.prisma.employee.delete({ where: { id } });
    this.logger.info('Employee removed', { employeeId: id, actorId: actor.id });
  }

  private async getEmployeeOrThrow(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: employeeInclude,
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  private async assertCanAccessEmployee(
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
}
