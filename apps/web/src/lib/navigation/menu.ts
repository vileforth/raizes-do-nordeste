import { UserRole } from '@raizes/shared';
import type { Icon } from '@phosphor-icons/react';
import {
  ChartBar,
  Ticket,
  Gift,
  Headset,
  House,
  Package,
  ShoppingCart,
  Storefront,
  Users,
  UsersThree,
  Warehouse,
} from '@phosphor-icons/react';

export type NavItem = {
  key: string;
  href: string;
  icon: Icon;
  labelKey: string;
};

const ALL_ITEMS: Record<string, NavItem> = {
  dashboard: { key: 'dashboard', href: '/', icon: House, labelKey: 'dashboard' },
  orders: { key: 'orders', href: '/orders', icon: ShoppingCart, labelKey: 'orders' },
  ordersBoard: { key: 'ordersBoard', href: '/orders/board', icon: ShoppingCart, labelKey: 'ordersBoard' },
  clients: { key: 'clients', href: '/clients', icon: Users, labelKey: 'clients' },
  users: { key: 'users', href: '/users', icon: UsersThree, labelKey: 'users' },
  products: { key: 'products', href: '/products', icon: Package, labelKey: 'products' },
  stock: { key: 'stock', href: '/stock', icon: Warehouse, labelKey: 'stock' },
  promotions: { key: 'promotions', href: '/promotions', icon: Gift, labelKey: 'promotions' },
  coupons: { key: 'coupons', href: '/coupons', icon: Ticket, labelKey: 'coupons' },
  loyalty: { key: 'loyalty', href: '/loyalty', icon: Gift, labelKey: 'loyalty' },
  support: { key: 'support', href: '/support', icon: Headset, labelKey: 'support' },
  units: { key: 'units', href: '/units', icon: Storefront, labelKey: 'units' },
  employees: { key: 'employees', href: '/employees', icon: UsersThree, labelKey: 'employees' },
  network: { key: 'network', href: '/network', icon: Storefront, labelKey: 'network' },
  reports: { key: 'reports', href: '/reports', icon: ChartBar, labelKey: 'reports' },
};

const ROLE_MENUS: Record<UserRole, string[]> = {
  [UserRole.CLIENTE]: ['orders', 'loyalty', 'support', 'promotions'],
  [UserRole.ATENDENTE]: ['orders', 'clients', 'coupons', 'support'],
  [UserRole.COZINHEIRO]: ['ordersBoard'],
  [UserRole.GERENTE]: [
    'dashboard',
    'orders',
    'products',
    'stock',
    'employees',
    'promotions',
    'reports',
    'units',
  ],
  [UserRole.ADMINISTRADOR]: [
    'dashboard',
    'orders',
    'ordersBoard',
    'clients',
    'users',
    'products',
    'stock',
    'promotions',
    'coupons',
    'loyalty',
    'support',
    'units',
    'employees',
    'network',
    'reports',
  ],
};

export function getMenuForRoles(roles: UserRole[]): NavItem[] {
  const keys = new Set<string>();
  for (const role of roles) {
    for (const key of ROLE_MENUS[role] ?? []) {
      keys.add(key);
    }
  }
  const ordered = [
    'dashboard',
    'orders',
    'ordersBoard',
    'clients',
    'users',
    'products',
    'stock',
    'promotions',
    'coupons',
    'loyalty',
    'support',
    'units',
    'employees',
    'network',
    'reports',
  ];
  return ordered.filter((k) => keys.has(k)).map((k) => ALL_ITEMS[k]);
}

export function getPrimaryRole(roles: UserRole[]): UserRole {
  const priority = [
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.CLIENTE,
  ];
  for (const role of priority) {
    if (roles.includes(role)) return role;
  }
  return UserRole.CLIENTE;
}
