import { describe, expect, it } from 'vitest';
import { toQueryString } from './list-query';

describe('toQueryString', () => {
  it('omits empty values', () => {
    expect(toQueryString({ page: 2, search: '', orderBy: undefined })).toBe('?page=2');
  });

  it('returns empty string without params', () => {
    expect(toQueryString()).toBe('');
  });
});
