import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { Prisma } from '@prisma/client';
import { SUPABASE_PASSWORD_PLACEHOLDER } from '../auth/constants/auth.constants';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import {
  assertAnyRole,
  hasRole,
  resolveManagerUnitId,
} from '../common/utils/access-scope.util';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfilesDto } from './dto/update-user-profiles.dto';
import { UserResponseDto } from './dto/user-response.dto';

const userInclude = {
  userProfiles: {
    include: {
      profile: true,
    },
  },
  employee: true,
} satisfies Prisma.UserInclude;

type UserWithProfiles = Prisma.UserGetPayload<{ include: typeof userInclude }>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(actor: AuthenticatedUser): Promise<UserResponseDto[]> {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      const users = await this.prisma.user.findMany({
        include: userInclude,
        orderBy: { id: 'asc' },
      });
      return users.map((user) => this.toResponse(user));
    }

    if (hasRole(actor, UserRole.GERENTE)) {
      const unitId = await resolveManagerUnitId(this.prisma, actor.id);
      const users = await this.prisma.user.findMany({
        where: { employee: { unitId } },
        include: userInclude,
        orderBy: { id: 'asc' },
      });
      return users.map((user) => this.toResponse(user));
    }

    throw new ForbiddenException('Insufficient role permissions');
  }

  async findOne(actor: AuthenticatedUser, id: number): Promise<UserResponseDto> {
    const user = await this.getUserOrThrow(id);
    await this.assertCanAccessUser(actor, user);
    return this.toResponse(user);
  }

  async create(actor: AuthenticatedUser, dto: CreateUserDto): Promise<UserResponseDto> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        status: dto.status,
        passwordHash: SUPABASE_PASSWORD_PLACEHOLDER,
      },
      include: userInclude,
    });

    this.logger.info('User created', { userId: user.id, actorId: actor.id });
    return this.toResponse(user);
  }

  async update(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);
    await this.getUserOrThrow(id);

    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: userInclude,
    });

    this.logger.info('User updated', { userId: id, actorId: actor.id });
    return this.toResponse(user);
  }

  async updateProfiles(
    actor: AuthenticatedUser,
    id: number,
    dto: UpdateUserProfilesDto,
  ): Promise<UserResponseDto> {
    assertAnyRole(actor, [UserRole.ADMINISTRADOR]);
    await this.getUserOrThrow(id);

    const profiles = await this.prisma.profile.findMany({
      where: { name: { in: dto.profileNames } },
    });

    if (profiles.length !== dto.profileNames.length) {
      throw new NotFoundException('One or more profiles not found');
    }

    await this.prisma.$transaction([
      this.prisma.userProfile.deleteMany({ where: { userId: id } }),
      this.prisma.userProfile.createMany({
        data: profiles.map((profile) => ({
          userId: id,
          profileId: profile.id,
        })),
      }),
    ]);

    const user = await this.getUserOrThrow(id);
    this.logger.info('User profiles updated', { userId: id, actorId: actor.id });
    return this.toResponse(user);
  }

  private async getUserOrThrow(id: number): Promise<UserWithProfiles> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async assertCanAccessUser(
    actor: AuthenticatedUser,
    user: UserWithProfiles,
  ): Promise<void> {
    if (hasRole(actor, UserRole.ADMINISTRADOR)) {
      return;
    }

    if (hasRole(actor, UserRole.GERENTE)) {
      const unitId = await resolveManagerUnitId(this.prisma, actor.id);
      if (user.employee?.unitId === unitId) {
        return;
      }
    }

    throw new ForbiddenException('Insufficient role permissions');
  }

  private toResponse(user: UserWithProfiles): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      registeredAt: user.registeredAt,
      profiles: user.userProfiles.map(
        (userProfile) => userProfile.profile.name as UserRole,
      ),
    };
  }
}
