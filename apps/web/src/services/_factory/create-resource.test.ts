import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/lib/query-keys';

describe('createResource query keys', () => {
  it('builds list key with params', () => {
    expect(queryKeys.list('clients', { page: 1 })).toEqual([
      'clients',
      'list',
      { page: 1 },
    ]);
  });

  it('builds detail key', () => {
    expect(queryKeys.detail('orders', '42')).toEqual(['orders', 'detail', '42']);
  });
});
