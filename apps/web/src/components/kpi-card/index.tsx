'use client';

import { motion } from 'framer-motion';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

export type KpiSpec = {
  key: string;
  Icon: PhosphorIcon;
  accent: string;
  label: string;
  raw?: number;
  format: (n: number) => string;
};

export function KpiCard({ kpi, index }: { kpi: KpiSpec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border border-[var(--raizes-border)] bg-[var(--raizes-glass-bg)] p-4 backdrop-blur-xl"
    >
      <p className="t-eyebrow">{kpi.label}</p>
      <p className="t-stat-lg mt-2" style={{ color: kpi.accent }}>
        {kpi.raw != null ? kpi.format(kpi.raw) : '—'}
      </p>
    </motion.div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--raizes-border)] p-4">
      <div className="h-3 w-16 animate-pulse rounded bg-black/5" />
      <div className="mt-3 h-8 w-24 animate-pulse rounded bg-black/5" />
    </div>
  );
}
