import { buildPaginated, normalizePagination } from './pagination';

describe('pagination helpers', () => {
  it('normalizes defaults and clamps pageSize', () => {
    expect(normalizePagination()).toEqual({
      page: 1,
      pageSize: 20,
      skip: 0,
      take: 20,
      search: undefined,
    });
    expect(normalizePagination({ page: 3, pageSize: 500, search: '  tapioca  ' })).toEqual({
      page: 3,
      pageSize: 100,
      skip: 200,
      take: 100,
      search: 'tapioca',
    });
  });

  it('builds pagination meta', () => {
    const result = buildPaginated(['a'], 2, 20, 45);
    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 20,
      total: 45,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    });
  });

  it('handles empty collections', () => {
    const result = buildPaginated([], 1, 20, 0);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.totalPages).toBe(1);
  });
});
