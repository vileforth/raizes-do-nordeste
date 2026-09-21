export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export type PaginationInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Paginated<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export function normalizePagination(input: PaginationInput = {}) {
  const page = Math.max(DEFAULT_PAGE, Number(input.page) || DEFAULT_PAGE);
  const rawSize = Number(input.pageSize) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, rawSize));
  const search = input.search?.trim() || undefined;
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    search,
  };
}

export function buildPaginated<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: total > 0 && page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function searchContains(fields: string[], search?: string) {
  if (!search) {
    return undefined;
  }
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' as const },
    })),
  };
}

export function resolveOrderBy(
  orderBy: string | undefined,
  allowed: string[],
  fallback: Record<string, 'asc' | 'desc'>,
): Record<string, 'asc' | 'desc'> {
  if (!orderBy) {
    return fallback;
  }
  const desc = orderBy.startsWith('-');
  const field = desc ? orderBy.slice(1) : orderBy;
  if (!allowed.includes(field)) {
    return fallback;
  }
  return { [field]: desc ? 'desc' : 'asc' };
}
