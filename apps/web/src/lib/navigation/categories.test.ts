import { UserRole } from '@raizes/shared';
import { describe, expect, it } from 'vitest';
import {
  categoryOfHref,
  findActiveHref,
  getCategoriesForRoles,
  stripLocalePrefix,
} from './categories';

describe('stripLocalePrefix', () => {
  it('removes locale prefixes', () => {
    expect(stripLocalePrefix('/en/orders')).toBe('/orders');
    expect(stripLocalePrefix('/pt-BR')).toBe('/');
    expect(stripLocalePrefix('/orders')).toBe('/orders');
  });
});

describe('getCategoriesForRoles', () => {
  it('groups admin items into function categories', () => {
    const categories = getCategoriesForRoles([UserRole.ADMINISTRADOR]);
    expect(categories.map((category) => category.key)).toEqual([
      'home',
      'operations',
      'catalog',
      'people',
      'marketing',
      'network',
      'reports',
    ]);
  });

  it('hides empty categories for cliente', () => {
    const categories = getCategoriesForRoles([UserRole.CLIENTE]);
    expect(categories.map((category) => category.key)).toEqual([
      'operations',
      'marketing',
    ]);
    expect(categories.find((category) => category.key === 'home')).toBeUndefined();
  });
});

describe('findActiveHref', () => {
  const categories = getCategoriesForRoles([
    UserRole.ADMINISTRADOR,
    UserRole.COZINHEIRO,
  ]);

  it('prefers the longest matching href', () => {
    expect(findActiveHref('/orders/board', categories)).toBe('/orders/board');
    expect(findActiveHref('/orders/12', categories)).toBe('/orders');
    expect(findActiveHref('/', categories)).toBe('/');
  });

  it('ignores locale prefixes', () => {
    expect(findActiveHref('/en/products', categories)).toBe('/products');
  });
});

describe('categoryOfHref', () => {
  it('maps an item href back to its category', () => {
    const categories = getCategoriesForRoles([UserRole.ADMINISTRADOR]);
    expect(categoryOfHref('/stock', categories)).toBe('catalog');
    expect(categoryOfHref('/unknown', categories)).toBeUndefined();
  });
});
