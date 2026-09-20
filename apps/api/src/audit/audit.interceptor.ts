import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { parseAuditEntity } from './audit-entity.parser';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      user?: AuthenticatedUser;
    }>();

    if (request.method === 'GET') {
      return next.handle();
    }

    const action = this.mapAction(request.method);

    return next.handle().pipe(
      tap((result) => {
        void this.writeAuditLog(request, action, result);
      }),
    );
  }

  private mapAction(method: string): AuditAction {
    if (method === 'POST') {
      return AuditAction.CRIAR;
    }
    return AuditAction.ALTERAR;
  }

  private async writeAuditLog(
    request: { url: string; user?: AuthenticatedUser },
    action: AuditAction,
    result: unknown,
  ): Promise<void> {
    try {
      const { entity, entityId } = parseAuditEntity(request.url, result);
      await this.prisma.auditLog.create({
        data: {
          userId: request.user?.id,
          action,
          entity,
          entityId,
          details: request.url,
        },
      });
    } catch (error) {
      this.logger.error('Failed to write audit log', {
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
