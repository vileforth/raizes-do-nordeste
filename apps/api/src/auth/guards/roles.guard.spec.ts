import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { AuthenticatedUser } from '../types/auth-user.types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const buildContext = (user?: AuthenticatedUser): ExecutionContext => {
    const request = { user };
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(buildContext())).toBe(true);
  });

  it('allows access when user has a required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.GERENTE]);

    const user: AuthenticatedUser = {
      id: 1,
      email: 'gerente@example.com',
      name: 'Gerente',
      status: UserStatus.ATIVO,
      roles: [UserRole.GERENTE],
      sub: 'sub-1',
    };

    expect(guard.canActivate(buildContext(user))).toBe(true);
  });

  it('throws when user lacks required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMINISTRADOR]);

    const user: AuthenticatedUser = {
      id: 2,
      email: 'cliente@example.com',
      name: 'Cliente',
      status: UserStatus.ATIVO,
      roles: [UserRole.CLIENTE],
      sub: 'sub-2',
    };

    expect(() => guard.canActivate(buildContext(user))).toThrow(
      ForbiddenException,
    );
  });
});
