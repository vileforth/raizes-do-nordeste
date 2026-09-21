const mockWinstonLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

jest.mock('winston', () => ({
  createLogger: jest.fn(() => mockWinstonLogger),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LoggerService();
  });

  it('logs error messages', () => {
    service.error('error message', { key: 'value' });
    expect(mockWinstonLogger.error).toHaveBeenCalledWith('error message', {
      key: 'value',
    });
  });

  it('logs warn messages', () => {
    service.warn('warn message');
    expect(mockWinstonLogger.warn).toHaveBeenCalledWith('warn message', undefined);
  });

  it('logs info messages', () => {
    service.info('info message');
    expect(mockWinstonLogger.info).toHaveBeenCalledWith('info message', undefined);
  });

  it('logs debug messages', () => {
    service.debug('debug message');
    expect(mockWinstonLogger.debug).toHaveBeenCalledWith('debug message', undefined);
  });
});
