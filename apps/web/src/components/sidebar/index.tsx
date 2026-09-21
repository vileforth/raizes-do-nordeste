'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { getMenuForRoles } from '@/lib/navigation/menu';

export function Sidebar() {
  const pathname = usePathname() ?? '';
  const t = useTranslations('nav');
  const { user } = useAuth();
  const items = getMenuForRoles(user?.roles ?? []);

  return (
    <aside
      className="flex h-full w-56 flex-col rounded-2xl border border-[var(--raizes-sidebar-border)] bg-[var(--raizes-sidebar)] p-3 backdrop-blur-xl"
    >
      <Link href="/" className="mb-4 px-2 py-2 text-sm font-bold text-[var(--raizes-brand)]">
        Raízes
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition"
              style={{
                background: active ? 'var(--raizes-sidebar-active)' : undefined,
                color: active ? 'var(--raizes-sidebar-text-active)' : 'var(--raizes-sidebar-text)',
              }}
            >
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
