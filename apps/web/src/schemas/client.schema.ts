import { z } from 'zod';

export const clientSchema = z.object({
  userId: z.coerce.number().int().positive(),
  cpf: z.string().trim().min(11).max(14),
  birthDate: z.string().optional(),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  state: z.string().trim().length(2),
  zipCode: z.string().trim().min(8).max(9),
  preferredUnitId: z.preprocess(
    (value) => (value === '' || value === undefined || value === null ? undefined : Number(value)),
    z.number().int().positive().optional(),
  ),
  active: z.boolean(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
