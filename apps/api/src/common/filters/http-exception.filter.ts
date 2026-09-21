import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

type ExceptionBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.buildResponseBody(exception);

    this.loggerService.error('HTTP exception', {
      method: request.method,
      path: request.url,
      statusCode: body.statusCode,
      message: body.message,
      error: body.error,
    });

    response.status(body.statusCode).json({
      statusCode: body.statusCode,
      message: body.message,
      error: body.error,
    });
  }

  private buildResponseBody(exception: unknown): ExceptionBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          statusCode,
          message: exceptionResponse,
          error: HttpStatus[statusCode] ?? 'Error',
        };
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as Record<string, unknown>;
        const message = payload.message ?? exception.message;
        const error =
          typeof payload.error === 'string'
            ? payload.error
            : (HttpStatus[statusCode] ?? 'Error');

        return {
          statusCode,
          message: message as string | string[],
          error,
        };
      }
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: 'Internal Server Error',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
  }
}
