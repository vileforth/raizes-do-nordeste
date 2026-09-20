import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly logger: LoggerService) {}

  async sendEmail(input: SendEmailInput): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured, skipping email');
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Raizes <onboarding@resend.dev>',
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error('Failed to send email', {
        status: response.status,
        body,
      });
      return;
    }

    this.logger.info('Email sent', { to: input.to, subject: input.subject });
  }
}
