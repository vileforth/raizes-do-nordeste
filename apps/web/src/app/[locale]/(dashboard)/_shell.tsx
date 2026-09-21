'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { DashboardMain } from './_layout-inner';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{ background: 'var(--raizes-canvas-gradient)' }}
    >
      <DashboardMain>{children}</DashboardMain>
      <div className="absolute inset-x-0 top-0 z-30">
        <Topbar />
      </div>
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-40 p-2.5">
        <div className="pointer-events-auto h-full">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
