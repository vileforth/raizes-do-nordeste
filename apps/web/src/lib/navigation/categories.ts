import {
  ChartBar,
  Gift,
  House,
  Kanban,
  Package,
  Storefront,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react';
import { UserRole } from '@raizes/shared';
import { getMenuForRoles, type NavItem } from './menu';

export type SidebarCategory = {
  key: string;
  labelKey: string;
  icon: Icon;
  items: NavItem[];
};

type CategoryDefinition = {
  key: string;
  labelKey: string;
  icon: Icon;
  itemKeys: string[];
};

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { key: 'home', labelKey: 'categoryHome', icon: House, itemKeys: ['dashboard'] },
  {
    key: 'operations',
    labelKey: 'categoryOperations',
    icon: Kanban,
    itemKeys: ['orders', 'ordersBoard', 'support'],
  },
  {
    key: 'catalog',
    labelKey: 'categoryCatalog',
    icon: Package,
    itemKeys: ['products', 'stock'],
  },
  {
    key: 'people',
    labelKey: 'categoryPeople',
    icon: UsersThree,
    itemKeys: ['clients', 'users', 'employees'],
  },
  {
    key: 'marketing',
    labelKey: 'categoryMarketing',
    icon: Gift,
    itemKeys: ['promotions', 'coupons', 'loyalty'],
  },
  {
    key: 'network',
    labelKey: 'categoryNetwork',
    icon: Storefront,
    itemKeys: ['units', 'network'],
  },
  {
    key: 'reports',
    labelKey: 'categoryReports',
    icon: ChartBar,
    itemKeys: ['reports'],
  },
];

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/(pt-BR|en)(?=\/|$)/, '') || '/';
}

export function getCategoriesForRoles(roles: UserRole[]): SidebarCategory[] {
  const items = getMenuForRoles(roles);
  const itemsByKey = new Map(items.map((item) => [item.key, item]));
  return CATEGORY_DEFINITIONS.map((definition) => ({
    key: definition.key,
    labelKey: definition.labelKey,
    icon: definition.icon,
    items: definition.itemKeys
      .map((key) => itemsByKey.get(key))
      .filter((item): item is NavItem => Boolean(item)),
  })).filter((category) => category.items.length > 0);
}

export function findActiveHref(pathname: string, categories: SidebarCategory[]): string {
  const normalized = stripLocalePrefix(pathname);
  const hrefs = categories.flatMap((category) => category.items.map((item) => item.href));
  const matches = hrefs.filter((href) => {
    if (href === '/') {
      return normalized === '/';
    }
    return normalized === href || normalized.startsWith(`${href}/`);
  });
  return matches.sort((left, right) => right.length - left.length)[0] ?? hrefs[0] ?? '/';
}

export function categoryOfHref(href: string, categories: SidebarCategory[]): string | undefined {
  return categories.find((category) => category.items.some((item) => item.href === href))?.key;
}
