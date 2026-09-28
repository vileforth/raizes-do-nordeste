import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .transform((value) => value.toUpperCase()),
  expiry: z.string().refine((value) => !Number.isNaN(new Date(value).getTime())),
  usageLimit: z.coerce.number().int().min(1),
  active: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
