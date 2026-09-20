import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ALL_USER_ROLES, UserRole } from '@raizes/shared';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/auth-user.types';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error('SUPABASE_JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
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
