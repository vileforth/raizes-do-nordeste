import { describe, expect, it } from 'vitest';
import { couponSchema } from './coupon.schema';

describe('couponSchema', () => {
  it('accepts a coupon and uppercases the code', () => {
    const result = couponSchema.safeParse({
      code: ' nordeste10 ',
      expiry: '2099-12-31T23:59',
      usageLimit: '50',
      active: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('NORDESTE10');
      expect(result.data.usageLimit).toBe(50);
    }
  });

  it('rejects an empty code and a usage limit below one', () => {
    const result = couponSchema.safeParse({
      code: '   ',
      expiry: 'not-a-date',
      usageLimit: 0,
      active: false,
    });
    expect(result.success).toBe(false);
  });
});
