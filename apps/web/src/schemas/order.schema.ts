import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const orderSchema = z.object({
  clientId: z.coerce.number().int().positive(),
  unitId: z.coerce.number().int().positive(),
  consumptionType: z.enum(['CONSUMO_NO_LOCAL', 'RETIRADA_NO_BALCAO']),
  items: z.array(orderItemSchema).min(1),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
