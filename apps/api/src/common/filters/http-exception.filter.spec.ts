import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggerService } from '../../logger/logger.service';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let loggerService: jest.Mocked<LoggerService>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as jest.Mocked<LoggerService>;

    filter = new HttpExceptionFilter(loggerService);

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => ({ method: 'GET', url: '/test' }),
      }),
    } as ArgumentsHost;
  });

  it('returns structured HttpException response', () => {
    filter.catch(new BadRequestException('Invalid payload'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid payload',
      error: 'Bad Request',
    });
    expect(loggerService.error).toHaveBeenCalled();
  });

  it('returns structured internal error response', () => {
    filter.catch(new Error('Unexpected failure'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected failure',
      error: 'Internal Server Error',
    });
    expect(loggerService.error).toHaveBeenCalled();
  });
});
