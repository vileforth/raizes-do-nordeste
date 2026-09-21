import { z } from 'zod';

export const supportSchema = z.object({
  type: z.enum(['PEDIDO', 'SUPORTE', 'PAGAMENTO', 'FIDELIDADE']),
  description: z.string().trim().min(8),
});

export type SupportFormValues = z.infer<typeof supportSchema>;
