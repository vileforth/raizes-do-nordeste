import { z } from 'zod';

export const clientSchema = z.object({
  userId: z.coerce.number().int().positive(),
  cpf: z.string().trim().min(11).max(14),
  active: z.boolean(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
