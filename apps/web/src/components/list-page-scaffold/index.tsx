'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  kpis?: ReactNode;
  children: ReactNode;
};

export function ListPageScaffold({ title, subtitle, actions, kpis, children }: Props) {
  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <h1 className="t-page-title">{title}</h1>
          {subtitle && <p className="mt-1.5 t-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </motion.header>
      {kpis}
      <div className="surface-card overflow-hidden">{children}</div>
    </div>
  );
}
