import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  status: UserStatus;
  roles: UserRole[];
  sub: string;
}

export interface SupabaseTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
