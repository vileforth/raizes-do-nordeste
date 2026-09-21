'use client';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function FormPageScaffold({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="t-page-title">{title}</h1>
        {subtitle && <p className="mt-1.5 t-subtitle">{subtitle}</p>}
      </div>
      <div className="surface-card p-6">{children}</div>
    </div>
  );
}
