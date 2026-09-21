'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSidebarClearLeft } from '@/components/sidebar';
import { stripLocalePrefix } from '@/lib/navigation/categories';
import { HEADER_HEIGHT } from '@/lib/navigation/sidebar-collapse';

export function DashboardMain({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const clearLeft = useSidebarClearLeft();
  const immersive = stripLocalePrefix(pathname) === '/';

  if (immersive) {
    return <main className="absolute inset-0 overflow-y-auto">{children}</main>;
  }

  return (
    <main
      className="absolute inset-0 overflow-y-auto max-md:!pl-4"
      style={{ paddingTop: HEADER_HEIGHT, paddingLeft: clearLeft }}
    >
      <div className="pt-8 pr-6 pb-10 lg:pr-10">{children}</div>
    </main>
  );
}
