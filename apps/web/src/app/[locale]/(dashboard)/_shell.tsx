'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: 'var(--raizes-canvas-gradient)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 z-40 hidden p-3 md:block">
        <Sidebar />
      </div>
      <div className="absolute top-0 inset-x-0 z-30">
        <Topbar />
      </div>
      <main className="min-h-screen px-4 pb-8 pt-16 md:pl-60">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
