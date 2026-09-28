import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  SUPABASE_PASSWORD_PLACEHOLDER,
} from './constants/auth.constants';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseAuthClient } from './supabase/supabase-auth.client';
import { SupabaseTokenResponse } from './types/auth-user.types';

export interface RegisterResult extends SupabaseTokenResponse {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseAuth: SupabaseAuthClient,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async login(dto: LoginDto): Promise<SupabaseTokenResponse> {
    const tokens = await this.supabaseAuth.signInWithPassword(
      dto.email,
      dto.password,
    );

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    this.logger.info('User login', {
      email: dto.email,
      userId: user?.id,
    });

    return tokens;
  }

  async refresh(refreshToken: string): Promise<SupabaseTokenResponse> {
    const tokens = await this.supabaseAuth.refreshSession(refreshToken);
    this.logger.info('Session refreshed');
    return tokens;
  }

  async register(dto: RegisterDto): Promise<RegisterResult> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const tokens = await this.supabaseAuth.signUp(dto.email, dto.password, {
      name: dto.name,
      phone: dto.phone,
    });

    const clienteProfile = await this.prisma.profile.findUnique({
      where: { name: UserRole.CLIENTE },
    });

    if (!clienteProfile) {
      throw new NotFoundException('Default CLIENTE profile not found');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash: SUPABASE_PASSWORD_PLACEHOLDER,
        status: UserStatus.ATIVO,
        userProfiles: {
          create: {
            profileId: clienteProfile.id,
          },
        },
      },
    });

    this.logger.info('User registered', {
      email: dto.email,
      userId: user.id,
    });

    return {
      ...tokens,
      userId: user.id,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.supabaseAuth.recoverPassword(dto.email);

    this.logger.info('Password recovery requested', { email: dto.email });

    return { message: 'Password recovery email sent' };
  }
}
