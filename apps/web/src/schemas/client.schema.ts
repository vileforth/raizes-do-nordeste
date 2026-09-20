import { z } from 'zod';

export const clientSchema = z.object({
  cpf: z.string().min(11).max(14),
  active: z.boolean().default(true),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
