import { LoggerService } from '../logger/logger.service';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let logger: jest.Mocked<LoggerService>;
  const originalFetch = global.fetch;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new EmailService(logger);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
  });

  it('skips send when api key is missing', async () => {
    await service.sendEmail({
      to: 'user@test.com',
      subject: 'Test',
      html: '<p>Hi</p>',
    });
    expect(logger.warn).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends email via Resend API', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await service.sendEmail({
      to: 'user@test.com',
      subject: 'Ticket opened',
      html: '<p>Your ticket was created</p>',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(logger.info).toHaveBeenCalled();
  });

  it('logs error and does not throw when Resend fails', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 502,
      text: async () => 'bad gateway',
    });

    await expect(
      service.sendEmail({
        to: 'user@test.com',
        subject: 'Ticket opened',
        html: '<p>Your ticket was created</p>',
      }),
    ).resolves.toBeUndefined();

    expect(logger.error).toHaveBeenCalledWith('Failed to send email', {
      status: 502,
      body: 'bad gateway',
    });
  });
});
