import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseTokenResponse } from '../types/auth-user.types';

interface SupabaseAuthErrorBody {
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
}

interface SupabaseTokenBody {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class SupabaseAuthClient {
  private readonly supabaseUrl = process.env.SUPABASE_URL ?? '';
  private readonly anonKey = process.env.SUPABASE_ANON_KEY ?? '';

  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<SupabaseTokenResponse> {
    const response = await this.request<SupabaseTokenBody>(
      '/auth/v1/token?grant_type=password',
      { email, password },
    );
    return this.mapTokenResponse(response);
  }

  async signUp(
    email: string,
    password: string,
    metadata: { name: string; phone: string },
  ): Promise<SupabaseTokenResponse> {
    const response = await this.request<SupabaseTokenBody>('/auth/v1/signup', {
      email,
      password,
      data: metadata,
    });
    return this.mapTokenResponse(response);
  }

  async recoverPassword(email: string): Promise<void> {
    await this.request('/auth/v1/recover', { email });
  }

  async refreshSession(refreshToken: string): Promise<SupabaseTokenResponse> {
    const response = await this.request<SupabaseTokenBody>(
      '/auth/v1/token?grant_type=refresh_token',
      { refresh_token: refreshToken },
    );
    return this.mapTokenResponse(response);
  }

  private mapTokenResponse(body: SupabaseTokenBody): SupabaseTokenResponse {
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresIn: body.expires_in,
      tokenType: body.token_type,
    };
  }

  private async request<T = unknown>(
    path: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    if (!this.supabaseUrl || !this.anonKey) {
      throw new BadRequestException('Supabase configuration is missing');
    }

    const response = await fetch(`${this.supabaseUrl}${path}`, {
      method: 'POST',
      headers: {
        apikey: this.anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => ({}))) as SupabaseAuthErrorBody;
      const message =
        errorBody.error_description ??
        errorBody.msg ??
        errorBody.message ??
        errorBody.error ??
        'Supabase authentication failed';

      if (response.status === 400 || response.status === 422) {
        throw new BadRequestException(message);
      }

      throw new UnauthorizedException(message);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }
}
