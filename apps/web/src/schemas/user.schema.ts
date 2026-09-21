import { ALL_USER_ROLES, UserRole } from '@raizes/shared';
import { z } from 'zod';

export const USER_STATUSES = ['ATIVO', 'INATIVO', 'BLOQUEADO'] as const;
export const USER_ROLES = ALL_USER_ROLES;

export const userSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8),
  password: z.string().min(6),
  status: z.enum(USER_STATUSES),
  profileNames: z.array(z.nativeEnum(UserRole)).min(1),
});

export const updateUserSchema = userSchema.omit({ password: true });

export type UserFormValues = z.infer<typeof userSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
