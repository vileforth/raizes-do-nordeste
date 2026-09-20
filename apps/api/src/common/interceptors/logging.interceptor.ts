import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
    }>();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<{ statusCode: number }>();
          const duration = Date.now() - start;
          this.loggerService.info('HTTP request completed', {
            method: request.method,
            path: request.url,
            status: response.statusCode,
            duration,
          });
        },
        error: (error: { status?: number; message?: string }) => {
          const duration = Date.now() - start;
          const status = error.status ?? 500;
          this.loggerService.warn('HTTP request failed', {
            method: request.method,
            path: request.url,
            status,
            duration,
          });
        },
      }),
    );
  }
}
