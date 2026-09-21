import type { ReactNode } from 'react';

export function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--raizes-glass-border)] bg-[var(--raizes-glass-bg)] p-4 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
