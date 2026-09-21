import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ALL_USER_ROLES, UserRole } from '@raizes/shared';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/auth-user.types';
import { resolveSupabaseJwtKey } from './supabase-jwt-key';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    if (!process.env.SUPABASE_URL && !process.env.SUPABASE_JWT_SECRET) {
      throw new Error('Supabase JWT configuration is missing');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['ES256', 'HS256'],
      secretOrKeyProvider: (_request, rawJwtToken, done) => {
        resolveSupabaseJwtKey(rawJwtToken)
          .then((key) => done(null, key))
          .catch((error: unknown) =>
            done(error instanceof Error ? error : new Error('JWT key resolution failed')),
          );
      },
    });
  }

  async validate(payload: SupabaseJwtPayload): Promise<AuthenticatedUser> {
    const email = payload.email;
    if (!email) {
      throw new UnauthorizedException('JWT email claim is missing');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userProfiles: {
          include: { profile: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles = user.userProfiles
      .map((userProfile) => userProfile.profile.name as UserRole)
      .filter((role) => ALL_USER_ROLES.includes(role));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      roles,
      sub: payload.sub,
    };
  }
}
