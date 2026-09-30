import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  privacyConsent: z.boolean().refine((value) => value === true),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
